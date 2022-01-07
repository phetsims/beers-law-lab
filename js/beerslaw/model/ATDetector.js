// Copyright 2013-2022, University of Colorado Boulder

/**
 * ATDetector is the detector for absorbance (A) and percent transmittance (%T) of light passing through
 * a solution in a cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable from '../../common/model/BLLMovable.js';
import AbsorbanceModel from './AbsorbanceModel.js';
import Cuvette from './Cuvette.js';
import Light from './Light.js';

class ATDetector extends PhetioObject {

  /**
   * @param {Light} light
   * @param {Cuvette} cuvette
   * @param {AbsorbanceModel} absorbanceModel
   * @param {Object} [options]
   */
  constructor( light, cuvette, absorbanceModel, options ) {
    assert && assert( light instanceof Light, 'invalid light' );
    assert && assert( cuvette instanceof Cuvette, 'invalid cuvette' );
    assert && assert( absorbanceModel instanceof AbsorbanceModel, 'invalid absorbanceModel' );

    options = merge( {
      bodyPosition: Vector2.ZERO,
      probePosition: Vector2.ZERO,
      probeDragBounds: Bounds2.EVERYTHING,
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @private
    this.light = light;

    // @public
    this.body = new BLLMovable( {
      position: options.bodyPosition,
      tandem: options.tandem.createTandem( 'body' )
    } );

    // @public
    this.probe = new Probe( {
      sensorDiameter: 0.57,
      position: options.probePosition,
      dragBounds: options.probeDragBounds,
      tandem: options.tandem.createTandem( 'probe' )
    } );

    // @public for switching between absorbance (A) and percent transmittance (%T)
    this.modeProperty = new EnumerationProperty( ATDetector.Mode, ATDetector.Mode.TRANSMITTANCE, {
      tandem: options.tandem.createTandem( 'modeProperty' )
    } );

    // @public {DerivedProperty.<number>} value is either absorbance (A) or percent transmittance (%T) depending on mode
    this.valueProperty = new DerivedProperty( [
        this.probe.positionProperty,
        this.light.isOnProperty,
        this.modeProperty,
        cuvette.widthProperty,
        absorbanceModel.absorbanceProperty
      ],
      ( probePosition, lightOn, mode, cuvetteWidth, absorbance ) => {

        // Computes the displayed value, null if the light is off or the probe is outside the beam.
        let value = null;
        if ( this.isProbeInBeam() ) {

          // path length is between 0 and cuvette width
          const pathLength = Math.min( Math.max( 0, probePosition.x - cuvette.position.x ), cuvetteWidth );
          if ( this.modeProperty.value === ATDetector.Mode.ABSORBANCE ) {
            value = absorbanceModel.getAbsorbanceAt( pathLength );
          }
          else {
            value = 100 * absorbanceModel.getTransmittanceAt( pathLength );
          }
        }
        return value;
      }, {
        tandem: options.tandem.createTandem( 'valueProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) ),
        phetioDocumentation: 'absorbance (A) or percent transmittance (%T), depending on mode. ' +
                             'null if the probe is not in the light beam.'
      } );
  }

  /**
   * @public
   */
  reset() {
    this.body.reset();
    this.probe.reset();
    this.modeProperty.reset();
  }

  /**
   * Is the probe in some segment of the beam?
   * @returns {boolean}
   * @public
   */
  isProbeInBeam() {
    return this.light.isOnProperty.value &&
           ( this.probe.getMinY() < this.light.getMinY() ) &&
           ( this.probe.getMaxY() > this.light.getMaxY() ) &&
           ( this.probe.positionProperty.value.x > this.light.position.x );
  }
}

// @public Modes for the detector
ATDetector.Mode = EnumerationDeprecated.byKeys( [ 'TRANSMITTANCE', 'ABSORBANCE' ] );

/**
 * Probe is the probe part of the detector, whose position indicates where the measurement is being made.
 */
class Probe extends BLLMovable {

  /**
   * @param {Object} [options]
   * @constructor
   */
  constructor( options ) {

    options = merge( {
      sensorDiameter: 1, // in cm
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @private
    this.sensorDiameter = options.sensorDiameter;
  }

  // @public @returns {number}
  getMinY() {
    return this.positionProperty.value.y - ( this.sensorDiameter / 2 );
  }

  // @public @returns {number}
  getMaxY() {
    return this.positionProperty.value.y + ( this.sensorDiameter / 2 );
  }
}

beersLawLab.register( 'ATDetector', ATDetector );
export default ATDetector;