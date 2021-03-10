// Copyright 2013-2020, University of Colorado Boulder

/**
 * Beam is the model of the light as a solid beam.
 * Changes in wavelength affect the entire beam instantaneously.
 * Consists of 3 segments: left (between light and cuvette), center (inside cuvette), and right (to right of cuvette).
 * Beam may be intercepted at any point by the AbsorbanceModel-Transmittance detector.
 * The beam is in the probe if the entire beam is in contact with the probe lens.
 *
 * Unlike most model types, properties are in view coordinates.
 * This makes it convenient to describe the beam's shape and gradient fill.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import beersLawLab from '../../beersLawLab.js';
import AbsorbanceModel from './AbsorbanceModel.js';
import ATDetector from './ATDetector.js';
import Cuvette from './Cuvette.js';
import Light from './Light.js';

// constants
const MAX_LIGHT_WIDTH = 50; // cm, wide enough to be way off the right edge of the play area
const MAX_LIGHT_ALPHA = 0.78; // transparency of light when transmittance is 1.0 (tuned by eye)
const MIN_LIGHT_ALPHA = 0.078; // min transparency of light when transmittance is non-zero (tuned by eye)

class Beam {

  /**
   * @param {Light} light
   * @param {Cuvette} cuvette
   * @param {ATDetector} detector
   * @param {AbsorbanceModel} absorbanceModel
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( light, cuvette, detector, absorbanceModel, modelViewTransform ) {
    assert && assert( light instanceof Light, 'invalid light' );
    assert && assert( cuvette instanceof Cuvette );
    assert && assert( detector instanceof ATDetector );
    assert && assert( absorbanceModel instanceof AbsorbanceModel );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    // @public Make the beam visible when the light is on.
    this.visibleProperty = new DerivedProperty( [ light.isOnProperty ], isOn => isOn );

    // beam shape, with add some overlap, to hide space between beam and light housing
    const xOverlap = modelViewTransform.modelToViewDeltaX( 1 );

    // @public {DerivedProperty.<Shape|null>} shape of the beam
    this.shapeProperty = new DerivedProperty(
      [ this.visibleProperty, cuvette.widthProperty, detector.probe.positionProperty ],
      ( beamVisible, cuvetteWidth, probePosition ) => {
        if ( beamVisible ) {
          const x = modelViewTransform.modelToViewPosition( light.position ).x - xOverlap;
          const y = modelViewTransform.modelToViewPosition( light.position ).y - modelViewTransform.modelToViewDeltaY( light.lensDiameter / 2 );
          const w = modelViewTransform.modelToViewDeltaX( detector.isProbeInBeam() ? probePosition.x - light.position.x : MAX_LIGHT_WIDTH ) + xOverlap;
          const h = modelViewTransform.modelToViewDeltaY( light.lensDiameter );
          return Shape.rect( x, y, w, h );
        }
        else {
          return null;
        }
      } );

    // @public {DerivedProperty.<LinearGradient>|null} beam color, a left-to-right linear gradient that transitions inside the solution
    this.fillProperty = new DerivedProperty(
      [ this.visibleProperty, cuvette.widthProperty, light.wavelengthProperty, absorbanceModel.absorbanceProperty ],
      ( beamVisible, cuvetteWidth, wavelength, absorbance ) => {
        if ( beamVisible ) {
          const baseColor = VisibleColor.wavelengthToColor( wavelength );
          const leftColor = baseColor.withAlpha( MAX_LIGHT_ALPHA );
          const rightColor = baseColor.withAlpha( Utils.linear( 0, 1, MIN_LIGHT_ALPHA, MAX_LIGHT_ALPHA, absorbanceModel.getTransmittance() ) );
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

beersLawLab.register( 'Beam', Beam );
export default Beam;