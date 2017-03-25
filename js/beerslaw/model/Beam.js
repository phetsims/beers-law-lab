// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model of the light as a solid beam.
 * Changes in wavelength affect the entire beam instantaneously.
 * Consists of 3 segments: left (between light and cuvette), center (inside cuvette), and right (to right of cuvette).
 * Beam may be intercepted at any point by the Absorbance-Transmittance detector.
 * The beam is in the probe if the entire beam is in contact with the probe lens.
 *
 * Unlike most model types, properties are in view coordinates.
 * This makes it convenient to describe the beam's shape and gradient fill.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
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

    // @public Make the beam visible when the light is on.
    this.visibleProperty = new DerivedProperty( [ light.onProperty ],
      function( on ) {
        return on;
      } );

    // beam shape
    var xOverlap = modelViewTransform.modelToViewDeltaX( 1 ); // add some overlap, to hide space between beam and light housing
    // @public
    this.shapeProperty = new DerivedProperty( [ this.visibleProperty, cuvette.widthProperty, detector.probe.locationProperty ],
      function( beamVisible, cuvetteWidth, probeLocation ) {
        if ( beamVisible ) {
          var x = modelViewTransform.modelToViewPosition( light.location ).x - xOverlap;
          var y = modelViewTransform.modelToViewPosition( light.location ).y - modelViewTransform.modelToViewDeltaY( light.lensDiameter / 2 );
          var w = modelViewTransform.modelToViewDeltaX( detector.probeInBeam() ? probeLocation.x - light.location.x : MAX_LIGHT_WIDTH ) + xOverlap;
          var h = modelViewTransform.modelToViewDeltaY( light.lensDiameter );
          return Shape.rect( x, y, w, h );
        }
        else {
          return null;
        }
      } );

    // @public beam color, a left-to-right linear gradient that transitions inside the solution
    this.fillProperty = new DerivedProperty( [ this.visibleProperty, cuvette.widthProperty, light.wavelengthProperty, absorbance.absorbanceProperty ],
      function( beamVisible, cuvetteWidth, wavelength, absorbanceValue ) {
        if ( beamVisible ) {
          var baseColor = VisibleColor.wavelengthToColor( wavelength );
          var leftColor = baseColor.withAlpha( MAX_LIGHT_ALPHA );
          var rightColor = baseColor.withAlpha( Util.linear( 0, 1, MIN_LIGHT_ALPHA, MAX_LIGHT_ALPHA, absorbance.getTransmittance() ) );
          var x = modelViewTransform.modelToViewPosition( cuvette.location ).x;
          var w = modelViewTransform.modelToViewDeltaX( cuvetteWidth );
          return new LinearGradient( x, 0, x + w, 0 ).addColorStop( 0, leftColor ).addColorStop( 1, rightColor );
        }
        else {
          return null;
        }
      } );
  }

  beersLawLab.register( 'Beam', Beam );

  return inherit( Object, Beam );
} );