// Copyright 2002-2013, University of Colorado

/**
 * Model of the light as a solid beam.
 * Changes in wavelength affect the entire beam instantaneously.
 * Consists of 3 segments: left (between light and cuvette), center (inside cuvette), and right (to right of cuvette).
 * Beam may be intercepted at any point by the Absorbance-Transmittance detector.
 * The beam is in the probe if the entire beam is in contact with the probe lens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Color = require( "common/model/Color" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var LinearGradient = require( "SCENERY/util/LinearGradient" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Range = require( "DOT/Range" );
  var Shape = require( "KITE/Shape" );
  var VisibleColor = require( "common/util/VisibleColor" );

  // constants
  var MAX_LIGHT_WIDTH = 50; // cm, wide enough to be way off the right edge of the play area
  var MAX_LIGHT_ALPHA = 0.78; // transparency of light when transmittance is 1.0 (tuned by eye)
  var MIN_LIGHT_ALPHA = 0.078; // min transparency of light when transmittance is non-zero (tuned by eye)
  var TRANSMITTANCE_TO_ALPHA = new LinearFunction( new Range( 0, 1 ), new Range( MIN_LIGHT_ALPHA, MAX_LIGHT_ALPHA ) ); // maps transmittance to transparency

  /**
   * @param {Light} light
   * @param {Cuvette} cuvette
   * @param {ATDetector} detector
   * @param {Absorbance} absorbance
   * @param {ModelViewTransform2D} mvt
   * @constructor
   */
  function Beam( light, cuvette, detector, absorbance, mvt ) {

    var thisBeam = this;

    // Proper values will be set when observers are registered
    thisBeam.shape = new Property( Shape.rect( 0, 0, 0, 0 ) );
    thisBeam.fill = new Property( Color.WHITE );
    thisBeam.visible = new Property( false );

    // Make the beam visible when the light is on.
    light.on.addObserver( function( on ) {
         thisBeam.visible.set( on );
    } );

    // update shape of the beam
    var updateShape = function () {
      if ( thisBeam.visible.get() ) {
        var x = mvt.modelToView( light.location.x );
        var y = mvt.modelToView( light.getMinY() );
        var w = mvt.modelToView( detector.probeInBeam() ? detector.probe.location.get().x - light.location.x : MAX_LIGHT_WIDTH );
        var h = mvt.modelToView( light.lensDiameter );
        thisBeam.shape.set( Shape.rect( x, y, w, h ) );
      }
    };
    cuvette.width.addObserver( updateShape );
    detector.probe.location.addObserver( updateShape );
    thisBeam.visible.addObserver( updateShape );

    // update color of beam, a left-to-right linear gradient that transitions inside the solution
    var updateColor = function () {
      if ( thisBeam.visible.get() ) {
        var baseColor = VisibleColor.wavelengthToColor( light.wavelength.get() );
        var leftColor = Color.withAlpha( baseColor, MAX_LIGHT_ALPHA );
        var rightColor = Color.withAlpha( baseColor, TRANSMITTANCE_TO_ALPHA.evaluate( absorbance.getTransmittance() ) );
        var x = mvt.modelToView( cuvette.location.x );
        var w = mvt.modelToView( cuvette.width.get() );
        thisBeam.fill.set( new LinearGradient( x, 0, w, 0 )
                             .addColorStop( 0, leftColor.toCSS() )
                             .addColorStop( 1, rightColor.toCSS() ) );
      }
    };
    light.wavelength.addObserver( updateColor );
    cuvette.width.addObserver( updateColor );
    absorbance.value.addObserver( updateColor );
    thisBeam.visible.addObserver( updateColor );
  }

  return Beam;
} );