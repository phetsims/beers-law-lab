// Copyright 2013-2022, University of Colorado Boulder

/**
 * Faucet model, used for input and output faucets.
 * This model assumes that the pipe enters the faucet from the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';

type SelfOptions = {
  position?: Vector2; // center of output pipe, cm
  pipeMinX?: number; // x-coordinate of where the pipe starts, cm
  spoutWidth?: number; // cm
  maxFlowRate?: number; // L/s
};

type FaucetOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Faucet {

  public readonly position: Vector2;
  public readonly pipeMinX: number;
  public readonly spoutWidth: number;
  public readonly maxFlowRate: number;
  public readonly flowRateProperty: NumberProperty;
  public readonly enabledProperty: Property<boolean>;

  public constructor( providedOptions: FaucetOptions ) {

    const options = optionize<FaucetOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      pipeMinX: -100,
      spoutWidth: 45,
      maxFlowRate: 0.25
    }, providedOptions );

    assert && assert( options.pipeMinX < options.position.x ); // pipe enters the faucet from the left

    this.position = options.position;
    this.pipeMinX = options.pipeMinX;
    this.spoutWidth = options.spoutWidth;
    this.maxFlowRate = options.maxFlowRate;

    this.flowRateProperty = new NumberProperty( 0, {
      range: new Range( 0, options.maxFlowRate ),
      units: 'L/s',
      tandem: options.tandem.createTandem( 'flowRateProperty' ),
      phetioReadOnly: true
    } );

    this.enabledProperty = new BooleanProperty( true );

    // when disabled, turn off the faucet.
    this.enabledProperty.link( enabled => {
      if ( !enabled ) {
        this.flowRateProperty.value = 0;
      }
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.flowRateProperty.reset();
    this.enabledProperty.reset();
  }
}

beersLawLab.register( 'Faucet', Faucet );