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
define( function( require ) {
  "use strict";

  // imports
  var Color = require( "SCENERY/util/Color" );
  var linear = require( "DOT/Util" ).linear;
  var LinearGradient = require( "SCENERY/util/LinearGradient" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Range = require( "DOT/Range" );
  var Shape = require( "KITE/Shape" );
  var VisibleColor = require( "common/util/VisibleColor" );

  // constants
  var MAX_LIGHT_WIDTH = 50; // cm, wide enough to be way off the right edge of the play area
  var MAX_LIGHT_ALPHA = 0.78; // transparency of light when transmittance is 1.0 (tuned by eye)
  var MIN_LIGHT_ALPHA = 0.078; // min transparency of light when transmittance is non-zero (tuned by eye)

  /**
   * @param {Light} light
   * @param {Cuvette} cuvette
   * @param {ATDetector} detector
   * @param {Absorbance} absorbance
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function Beam( light, cuvette, detector, absorbance, mvt ) {

    var thisBeam = this;

    // Proper values will be set when observers are registered
    thisBeam.shape = new Property( Shape.rect( 0, 0, 0, 0 ) );
    thisBeam.fill = new Property( Color.WHITE );
    thisBeam.visible = new Property( false );

    // Make the beam visible when the light is on.
    light.on.link( function( on ) {
      thisBeam.visible.set( on );
    } );

    // update shape of the beam
    var updateShape = function() {
      if ( thisBeam.visible.get() ) {
        var x = mvt.modelToViewPosition( light.location ).x;
        var y = mvt.modelToViewPosition( light.location ).y - mvt.modelToViewDeltaY( light.lensDiameter / 2 );
        var w = mvt.modelToViewDeltaX( detector.probeInBeam() ? detector.probe.location.get().x - light.location.x : MAX_LIGHT_WIDTH );
        var h = mvt.modelToViewDeltaY( light.lensDiameter );
        thisBeam.shape.set( Shape.rect( x, y, w, h ) );
      }
    };
    cuvette.width.link( updateShape );
    detector.probe.location.link( updateShape );
    thisBeam.visible.link( updateShape );

    // update color of beam, a left-to-right linear gradient that transitions inside the solution
    var updateColor = function() {
      if ( thisBeam.visible.get() ) {
        var baseColor = VisibleColor.wavelengthToColor( light.wavelength.get() );
        var leftColor = baseColor.withAlpha( MAX_LIGHT_ALPHA );
        var rightColor = baseColor.withAlpha( linear( 0, MIN_LIGHT_ALPHA, 1, MAX_LIGHT_ALPHA, absorbance.getTransmittance() ) );
        var x = mvt.modelToViewPosition( cuvette.location ).x;
        var w = mvt.modelToViewDeltaX( cuvette.width.get() );
        thisBeam.fill.set( new LinearGradient( x, 0, x + w, 0 )
                               .addColorStop( 0, leftColor )
                               .addColorStop( 1, rightColor ) );
      }
    };
    light.wavelength.link( updateColor );
    cuvette.width.link( updateColor );
    absorbance.value.link( updateColor );
    thisBeam.visible.link( updateColor );
  }

  return Beam;
} );