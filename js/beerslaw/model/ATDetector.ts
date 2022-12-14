// Copyright 2013-2022, University of Colorado Boulder

/**
 * ATDetector is the detector for absorbance (A) and percent transmittance (%T) of light passing through
 * a solution in a cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import BLLMovable, { BLLMovableOptions } from '../../common/model/BLLMovable.js';
import AbsorbanceModel from './AbsorbanceModel.js';
import ATDetectorMode from './ATDetectorMode.js';
import Cuvette from './Cuvette.js';
import Light from './Light.js';

type SelfOptions = {
  bodyPosition?: Vector2;
  probePosition?: Vector2;
  probeDragBounds?: Bounds2;
};

type ATDetectorOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class ATDetector extends PhetioObject {

  private readonly light: Light;
  public readonly body: BLLMovable;
  public readonly probe: Probe;
  public readonly modeProperty: EnumerationProperty<ATDetectorMode>;

  // value is either absorbance (A) or percent transmittance (%T) depending on mode
  public readonly valueProperty: TReadOnlyProperty<number | null>;

  public constructor( light: Light, cuvette: Cuvette, solutionInCuvette: AbsorbanceModel, providedOptions: ATDetectorOptions ) {

    const options = optionize<ATDetectorOptions, SelfOptions, PhetioObjectOptions>()( {
      bodyPosition: Vector2.ZERO,
      probePosition: Vector2.ZERO,
      probeDragBounds: Bounds2.EVERYTHING,
      phetioState: false
    }, providedOptions );

    super( options );

    this.light = light;

    this.body = new BLLMovable( {
      position: options.bodyPosition,
      tandem: options.tandem.createTandem( 'body' )
    } );

    this.probe = new Probe( {
      sensorDiameter: 0.57,
      position: options.probePosition,
      dragBounds: options.probeDragBounds,
      tandem: options.tandem.createTandem( 'probe' )
    } );

    this.modeProperty = new EnumerationProperty( ATDetectorMode.TRANSMITTANCE, {
      tandem: options.tandem.createTandem( 'modeProperty' )
    } );

    //TODO https://github.com/phetsims/beers-law-lab/issues/298 add units
    this.valueProperty = new DerivedProperty( [
        this.probe.positionProperty,
        this.light.isOnProperty,
        this.modeProperty,
        cuvette.widthProperty,
        solutionInCuvette.absorbanceProperty
      ],
      ( probePosition, lightIsOn, mode, cuvetteWidth, absorbance ) => {

        // Computes the displayed value, null if the light is off or the probe is outside the beam.
        let value = null;
        if ( this.isProbeInBeam() ) {

          // path length is between 0 and cuvette width
          const pathLength = Math.min( Math.max( 0, probePosition.x - cuvette.position.x ), cuvetteWidth );
          if ( this.modeProperty.value === ATDetectorMode.ABSORBANCE ) {
            value = solutionInCuvette.getAbsorbanceAt( pathLength );
          }
          else {
            value = 100 * solutionInCuvette.getTransmittanceAt( pathLength );
          }
        }
        return value;
      }, {
        tandem: options.tandem.createTandem( 'valueProperty' ),
        phetioValueType: NullableIO( NumberIO ),
        phetioDocumentation: 'absorbance (A) or percent transmittance (%T), depending on mode. ' +
                             'null if the probe is not in the light beam.'
      } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.body.reset();
    this.probe.reset();
    this.modeProperty.reset();
  }

  /**
   * Is the probe in some segment of the beam?
   */
  public isProbeInBeam(): boolean {
    return this.light.isOnProperty.value &&
           ( this.probe.getMinY() < this.light.getMinY() ) &&
           ( this.probe.getMaxY() > this.light.getMaxY() ) &&
           ( this.probe.positionProperty.value.x > this.light.position.x );
  }
}

/**
 * Probe is the probe part of the detector, whose position indicates where the measurement is being made.
 */
type ProbeSelfOptions = {
  sensorDiameter?: number; // in cm
};
type ProbeOptions = ProbeSelfOptions & BLLMovableOptions;

class Probe extends BLLMovable {

  private readonly sensorDiameter: number;

  public constructor( providedOptions: ProbeOptions ) {

    const options = optionize<ProbeOptions, ProbeSelfOptions, BLLMovableOptions>()( {

      // ProbeSelfOptions
      sensorDiameter: 1,

      // BLLMovableOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.sensorDiameter = options.sensorDiameter;
  }

  public getMinY(): number {
    return this.positionProperty.value.y - ( this.sensorDiameter / 2 );
  }

  public getMaxY(): number {
    return this.positionProperty.value.y + ( this.sensorDiameter / 2 );
  }
}

beersLawLab.register( 'ATDetector', ATDetector );