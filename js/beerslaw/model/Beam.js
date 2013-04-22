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
    thisBeam.paint = new Property( Color.WHITE );
    thisBeam.visible = new Property( false );

    // Make the beam visible when the light is on.
    light.on.addObserver( function( on ) {
         thisBeam.visible.set( on );
    } );

    // update shape of the beam
    var updateShape = function () {
      if ( thisBeam.visible.get() ) {
        var x = light.location.x;
        var y = light.getMinY();
        var width = detector.probeInBeam() ? detector.probe.getX() - x : MAX_LIGHT_WIDTH;
        var height = light.lensDiameter;
        shape.set( Shape.rect( x, y, width, height ) );
      }
    };
    cuvette.width.addObserver( updateShape );
    detector.probe.location.addObserver( updateShape );
    thisBeam.visible.addObserver( updateShape );

    // update color of beam
    var updateColor = function () {
      if ( thisBeam.visible.get() ) {
        var wavelength = light.wavelength.get();
        var transmittance = absorbance.getTransmittance();
        var leftColor = Color.withAlpha( VisibleColor.wavelengthToColor( wavelength ), MAX_LIGHT_ALPHA );
        var rightColor = Color.withAlpha( VisibleColor.wavelengthToColor( wavelength ), TRANSMITTANCE_TO_ALPHA.evaluate( transmittance ) );
        var x = mvt.modelToView( cuvette.location.x );
        var w = mvt.modelToView( cuvette.width.get() );
//TODO how to do gradient?
//        paint.set( new GradientPaint( x, 0, leftColor, ( x + w ), 0, rightColor ) );
      }
    };
    light.wavelength.addObserver( updateColor );
    cuvette.width.addObserver( updateColor );
    absorbance.value.addObserver( updateColor );
    thisBeam.visible.addObserver( updateColor );
  }

  return Beam;
} );