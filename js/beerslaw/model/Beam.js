// Copyright 2013-2020, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Shape = require( 'KITE/Shape' );
  const Utils = require( 'DOT/Utils' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  // constants
  const MAX_LIGHT_WIDTH = 50; // cm, wide enough to be way off the right edge of the play area
  const MAX_LIGHT_ALPHA = 0.78; // transparency of light when transmittance is 1.0 (tuned by eye)
  const MIN_LIGHT_ALPHA = 0.078; // min transparency of light when transmittance is non-zero (tuned by eye)

  class Beam {

    /**
     * @param {Light} light
     * @param {Cuvette} cuvette
     * @param {ATDetector} detector
     * @param {Absorbance} absorbance
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( light, cuvette, detector, absorbance, modelViewTransform ) {

      // @public Make the beam visible when the light is on.
      this.visibleProperty = new DerivedProperty( [ light.onProperty ],
        function( on ) {
          return on;
        } );

      // beam shape
      const xOverlap = modelViewTransform.modelToViewDeltaX( 1 ); // add some overlap, to hide space between beam and light housing
      // @public
      this.shapeProperty = new DerivedProperty(
        [ this.visibleProperty, cuvette.widthProperty, detector.probe.positionProperty ],
        ( beamVisible, cuvetteWidth, probePosition ) => {
          if ( beamVisible ) {
            const x = modelViewTransform.modelToViewPosition( light.position ).x - xOverlap;
            const y = modelViewTransform.modelToViewPosition( light.position ).y - modelViewTransform.modelToViewDeltaY( light.lensDiameter / 2 );
            const w = modelViewTransform.modelToViewDeltaX( detector.probeInBeam() ? probePosition.x - light.position.x : MAX_LIGHT_WIDTH ) + xOverlap;
            const h = modelViewTransform.modelToViewDeltaY( light.lensDiameter );
            return Shape.rect( x, y, w, h );
          }
          else {
            return null;
          }
        } );

      // @public beam color, a left-to-right linear gradient that transitions inside the solution
      this.fillProperty = new DerivedProperty(
        [ this.visibleProperty, cuvette.widthProperty, light.wavelengthProperty, absorbance.absorbanceProperty ],
        ( beamVisible, cuvetteWidth, wavelength, absorbanceValue ) => {
          if ( beamVisible ) {
            const baseColor = VisibleColor.wavelengthToColor( wavelength );
            const leftColor = baseColor.withAlpha( MAX_LIGHT_ALPHA );
            const rightColor = baseColor.withAlpha( Utils.linear( 0, 1, MIN_LIGHT_ALPHA, MAX_LIGHT_ALPHA, absorbance.getTransmittance() ) );
            const x = modelViewTransform.modelToViewPosition( cuvette.position ).x;
            const w = modelViewTransform.modelToViewDeltaX( cuvetteWidth );
            return new LinearGradient( x, 0, x + w, 0 ).addColorStop( 0, leftColor ).addColorStop( 1, rightColor );
          }
          else {
            return null;
          }
        } );
    }
  }

  return beersLawLab.register( 'Beam', Beam );
} );