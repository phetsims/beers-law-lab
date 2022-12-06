// Copyright 2013-2022, University of Colorado Boulder

/**
 * Evaporator determines the rate at which solvent is evaporated from the solution in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';
import ConcentrationSolution from './ConcentrationSolution.js';

type SelfOptions = {
  maxEvaporationRate?: number; // L/s
};

type EvaporatorOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Evaporator {

  public readonly maxEvaporationRate: number;
  public readonly evaporationRateProperty: NumberProperty;
  public readonly enabledProperty: Property<boolean>;

  public constructor( solution: ConcentrationSolution, providedOptions: EvaporatorOptions ) {

    const options = optionize<EvaporatorOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      maxEvaporationRate: 0.25
    }, providedOptions );

    this.maxEvaporationRate = options.maxEvaporationRate;

    this.evaporationRateProperty = new NumberProperty( 0, {
      range: new Range( 0, options.maxEvaporationRate ),
      units: 'L/s',
      tandem: options.tandem.createTandem( 'evaporationRateProperty' ),
      phetioReadOnly: true // this is controlled by the model
    } );

    this.enabledProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'enabledProperty' ),
      phetioReadOnly: true // this is controlled by the model
    } );

    // disable when the volume gets to zero
    solution.volumeProperty.link( volume => {
      this.enabledProperty.value = ( volume > 0 );
    } );

    // when disabled, set the rate to zero
    this.enabledProperty.link( enabled => {
      if ( !enabled ) {
        this.evaporationRateProperty.value = 0;
      }
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.evaporationRateProperty.reset();
    this.enabledProperty.reset();
  }
}

beersLawLab.register( 'Evaporator', Evaporator );