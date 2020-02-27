// Copyright 2013-2020, University of Colorado Boulder

/**
 * Detector for absorbance (A) and percent transmittance (%T)
 * of light passing through a solution in a cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import Movable from '../../common/model/Movable.js';

class ATDetector {
  /**
   * @param {Vector2} bodyPosition
   * @param {Bounds2} bodyDragBounds
   * @param {Vector2} probePosition
   * @param {Bounds2} probeDragBounds
   * @param {Light} light
   * @param {Cuvette} cuvette
   * @param {Absorbance} absorbance
   * @param {Object} [options]
   */
  constructor( bodyPosition, bodyDragBounds, probePosition, probeDragBounds, light, cuvette, absorbance, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    this.light = light; // @private
    this.body = new Movable( bodyPosition, bodyDragBounds, {
      tandem: options.tandem.createTandem( 'body' )
    } ); // @public
    this.probe = new Probe( probePosition, probeDragBounds, 0.57, {
      tandem: options.tandem.createTandem( 'probe' )
    } ); // @public

    // @public for switching between absorbance (A) and percent transmittance (%T)
    this.modeProperty = new StringProperty( ATDetector.Mode.TRANSMITTANCE, {
      tandem: options.tandem.createTandem( 'modeProperty' )
    } );

    // @public value is either absorbance (A) or percent transmittance (%T) depending on mode
    this.valueProperty = new DerivedProperty( [
        this.probe.positionProperty,
        this.light.onProperty,
        this.modeProperty,
        cuvette.widthProperty,
        absorbance.absorbanceProperty
      ],
      ( probePosition, lightOn, mode, cuvetteWidth, absorbanceValue ) => {
        // Computes the displayed value, null if the light is off or the probe is outside the beam.
        let value = null;
        if ( this.probeInBeam() ) {
          // path length is between 0 and cuvette width
          const pathLength = Math.min( Math.max( 0, probePosition.x - cuvette.position.x ), cuvetteWidth );
          if ( this.modeProperty.get() === ATDetector.Mode.ABSORBANCE ) {
            value = absorbance.getAbsorbanceAt( pathLength );
          }
          else {
            value = 100 * absorbance.getTransmittanceAt( pathLength );
          }
        }
        return value;
      }, {
        tandem: options.tandem.createTandem( 'valueProperty' ),
        phetioType: DerivedPropertyIO( NullableIO( NumberIO ) )
      } );
  }

  // @public
  reset() {
    this.body.reset();
    this.probe.reset();
    this.modeProperty.reset();
  }

  // @public Is the probe in some segment of the beam?
  probeInBeam() {
    return this.light.onProperty.get() &&
           ( this.probe.getMinY() < this.light.getMinY() ) &&
           ( this.probe.getMaxY() > this.light.getMaxY() ) &&
           ( this.probe.positionProperty.get().x > this.light.position.x );
  }
}

// @static Modes for the detector
ATDetector.Mode = {
  TRANSMITTANCE: 'transmittance',
  ABSORBANCE: 'absorbance'
};

beersLawLab.register( 'ATDetector', ATDetector );

class Probe extends Movable {

  /**
   * The probe, whose position indicates where the measurement is being made.
   * @param {Vector2} position
   * @param {Bounds2} dragBounds
   * @param {number} sensorDiameter cm
   * @param {Tandem} tandem
   * @constructor
   */
  constructor( position, dragBounds, sensorDiameter, tandem ) {
    super( position, dragBounds, tandem );
    this.sensorDiameter = sensorDiameter; // @private
  }

  // @public
  getMinY() {
    return this.positionProperty.get().y - ( this.sensorDiameter / 2 );
  }

  // @public
  getMaxY() {
    return this.positionProperty.get().y + ( this.sensorDiameter / 2 );
  }
}

export default ATDetector;