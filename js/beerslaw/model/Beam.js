// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of the light as a solid beam.
 * Changes in wavelength affect the entire beam instantaneously.
 * Consists of 3 segments: left (between light and cuvette), center (inside cuvette), and right (to right of cuvette).
 * Beam may be intercepted at any point by the Absorbance-Transmittance detector.
 * The beam is in the probe if the entire beam is in contact with the probe lens.
 * <p>
 * Unlike most model types, properties are in view coordinates.
 * This makes it convenient to describe the beam's shape and gradient fill.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  // constants
  var MAX_LIGHT_WIDTH = 50; // cm, wide enough to be way off the right edge of the play area
  var MAX_LIGHT_ALPHA = 0.78; // transparency of light when transmittance is 1.0 (tuned by eye)
  var MIN_LIGHT_ALPHA = 0.078; // min transparency of light when transmittance is non-zero (tuned by eye)

  /**
   * @param {Light} light
   * @param {Cuvette} cuvette
   * @param {ATDetector} detector
   * @param {Absorbance} absorbance
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function Beam( light, cuvette, detector, absorbance, modelViewTransform ) {

    var thisBeam = this;

    // Proper values will be set when observers are registered
    thisBeam.shapeProperty = new Property( Shape.rect( 0, 0, 0, 0 ) ); // in view coordinates
    thisBeam.fillProperty = new Property( Color.WHITE ); // gradient, prepared for shape
    thisBeam.visibleProperty = new Property( false );

    // Make the beam visible when the light is on.
    light.onProperty.link( function( on ) {
      thisBeam.visibleProperty.set( on );
    } );

    // update shape of the beam
    var xOverlap = modelViewTransform.modelToViewDeltaX( 1 ); // add some overlap, to hide space between beam and light housing
    var updateShape = function() {
      if ( thisBeam.visibleProperty.get() ) {
        var x = modelViewTransform.modelToViewPosition( light.location ).x - xOverlap;
        var y = modelViewTransform.modelToViewPosition( light.location ).y - modelViewTransform.modelToViewDeltaY( light.lensDiameter / 2 );
        var w = modelViewTransform.modelToViewDeltaX( detector.probeInBeam() ? detector.probe.locationProperty.get().x - light.location.x : MAX_LIGHT_WIDTH ) + xOverlap;
        var h = modelViewTransform.modelToViewDeltaY( light.lensDiameter );
        thisBeam.shapeProperty.set( Shape.rect( x, y, w, h ) );
      }
    };
    cuvette.widthProperty.link( updateShape );
    detector.probe.locationProperty.link( updateShape );
    thisBeam.visibleProperty.link( updateShape );

    // update color of beam, a left-to-right linear gradient that transitions inside the solution
    var updateColor = function() {
      if ( thisBeam.visibleProperty.get() ) {
        var baseColor = VisibleColor.wavelengthToColor( light.wavelengthProperty.get() );
        var leftColor = baseColor.withAlpha( MAX_LIGHT_ALPHA );
        var rightColor = baseColor.withAlpha( Util.linear( 0, 1, MIN_LIGHT_ALPHA, MAX_LIGHT_ALPHA, absorbance.getTransmittance() ) );
        var x = modelViewTransform.modelToViewPosition( cuvette.location ).x;
        var w = modelViewTransform.modelToViewDeltaX( cuvette.widthProperty.get() );
        thisBeam.fillProperty.set( new LinearGradient( x, 0, x + w, 0 ).addColorStop( 0, leftColor ).addColorStop( 1, rightColor ) );
      }
    };
    light.wavelengthProperty.link( updateColor );
    cuvette.widthProperty.link( updateColor );
    absorbance.value.link( updateColor );
    thisBeam.visibleProperty.link( updateColor );
  }

  return Beam;
} );