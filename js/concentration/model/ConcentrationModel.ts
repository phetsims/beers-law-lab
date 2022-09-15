// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model container for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import Solute from '../../common/model/Solute.js';
import Beaker from './Beaker.js';
import ConcentrationMeter from './ConcentrationMeter.js';
import ConcentrationSolution from './ConcentrationSolution.js';
import Dropper from './Dropper.js';
import Evaporator from './Evaporator.js';
import Faucet from './Faucet.js';
import Precipitate from './Precipitate.js';
import Shaker from './Shaker.js';
import ShakerParticles from './ShakerParticles.js';
import SoluteForm from './SoluteForm.js';

// constants
const SOLUTION_VOLUME_RANGE = BLLConstants.SOLUTION_VOLUME_RANGE; // L
const SOLUTE_AMOUNT_RANGE = BLLConstants.SOLUTE_AMOUNT_RANGE; // moles
const DROPPER_FLOW_RATE = 0.05; // L/sec
const SHAKER_MAX_DISPENSING_RATE = 0.2; // mol/sec

type SelfOptions = EmptySelfOptions;

type ConcentrationModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class ConcentrationModel {

  public solutes: Solute[];
  public readonly soluteProperty: Property<Solute>;
  public readonly soluteFormProperty: EnumerationProperty<SoluteForm>;
  public readonly solution: ConcentrationSolution;
  public readonly beaker: Beaker;
  public readonly precipitate: Precipitate;
  public readonly shaker: Shaker;
  public readonly shakerParticles: ShakerParticles;
  public readonly dropper: Dropper;
  public readonly evaporator: Evaporator;
  public readonly solventFaucet: Faucet;
  public readonly drainFaucet: Faucet;
  public readonly concentrationMeter: ConcentrationMeter;

  public constructor( providedOptions: ConcentrationModelOptions ) {

    const options = providedOptions;

    // in rainbow (ROYGBIV) order.
    this.solutes = [
      Solute.DRINK_MIX,
      Solute.COBALT_II_NITRATE,
      Solute.COBALT_CHLORIDE,
      Solute.POTASSIUM_DICHROMATE,
      Solute.POTASSIUM_CHROMATE,
      Solute.NICKEL_II_CHLORIDE,
      Solute.COPPER_SULFATE,
      Solute.POTASSIUM_PERMANGANATE,
      Solute.SODIUM_CHLORIDE
    ];

    this.soluteProperty = new Property( this.solutes[ 0 ], {
      tandem: options.tandem.createTandem( 'soluteProperty' ),
      phetioValueType: Solute.SoluteIO
    } );

    this.soluteFormProperty = new EnumerationProperty( SoluteForm.SOLID, {
      tandem: options.tandem.createTandem( 'soluteFormProperty' )
    } );

    this.solution = new ConcentrationSolution( this.soluteProperty, SOLUTE_AMOUNT_RANGE, SOLUTION_VOLUME_RANGE, {
      tandem: options.tandem.createTandem( 'solution' )
    } );

    this.beaker = new Beaker( {
      position: new Vector2( 350, 550 )
    } );

    this.precipitate = new Precipitate( this.solution, this.beaker, {
      tandem: options.tandem.createTandem( 'precipitate' )
    } );

    this.shaker = new Shaker( this.soluteProperty, {
      position: new Vector2( this.beaker.position.x, 170 ),
      dragBounds: new Bounds2( 250, 50, 575, 210 ),
      orientation: 0.75 * Math.PI,
      maxDispensingRate: SHAKER_MAX_DISPENSING_RATE,
      visible: ( this.soluteFormProperty.value === SoluteForm.SOLID ),
      tandem: options.tandem.createTandem( 'shaker' )
    } );

    this.shakerParticles = new ShakerParticles( this.shaker, this.solution, this.beaker, {
      tandem: options.tandem.createTandem( 'shakerParticles' )
    } );

    this.dropper = new Dropper( this.soluteProperty, {
      position: new Vector2( this.beaker.position.x, 225 ),
      dragBounds: new Bounds2( 260, 225, 580, 225 ),
      maxFlowRate: DROPPER_FLOW_RATE,
      visible: ( this.soluteFormProperty.value === SoluteForm.SOLUTION ),
      tandem: options.tandem.createTandem( 'dropper' )
    } );

    this.evaporator = new Evaporator( this.solution, {
      tandem: options.tandem.createTandem( 'evaporator' )
    } );

    this.solventFaucet = new Faucet( {
      position: new Vector2( 155, 220 ),
      pipeMinX: -400,
      tandem: options.tandem.createTandem( 'solventFaucet' )
    } );

    this.drainFaucet = new Faucet( {
      position: new Vector2( 750, 630 ),
      pipeMinX: this.beaker.right,
      tandem: options.tandem.createTandem( 'drainFaucet' )
    } );

    this.concentrationMeter = new ConcentrationMeter( {
      bodyPosition: new Vector2( 785, 210 ),
      bodyDragBounds: new Bounds2( 10, 150, 835, 680 ),
      probePosition: new Vector2( 750, 370 ),
      probeDragBounds: new Bounds2( 30, 150, 966, 680 ),
      tandem: options.tandem.createTandem( 'concentrationMeter' )
    } );

    // When the solute is changed, the amount of solute resets to 0.  If this occurs while restoring PhET-iO state,
    // then do nothing, so that we don't blow away the restored state.
    // See https://github.com/phetsims/beers-law-lab/issues/247
    this.soluteProperty.link( () => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.solution.soluteMolesProperty.value = 0;
      }
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    this.solution.volumeProperty.link( volume => {
      this.solventFaucet.enabledProperty.value = ( volume < SOLUTION_VOLUME_RANGE.max );
      this.drainFaucet.enabledProperty.value = ( volume > SOLUTION_VOLUME_RANGE.min );
      this.dropper.enabledProperty.value = ( !this.dropper.isEmptyProperty.value && ( volume < SOLUTION_VOLUME_RANGE.max ) );
    } );

    // Empty shaker and dropper when max solute is reached.
    this.solution.soluteMolesProperty.link( soluteAmount => {
      const containsMaxSolute = ( soluteAmount >= SOLUTE_AMOUNT_RANGE.max );
      this.shaker.isEmptyProperty.value = containsMaxSolute;
      this.dropper.isEmptyProperty.value = containsMaxSolute;
      this.dropper.enabledProperty.value =
        ( !this.dropper.isEmptyProperty.value && !containsMaxSolute && this.solution.volumeProperty.value < SOLUTION_VOLUME_RANGE.max );
    } );
  }

  public reset(): void {
    this.soluteProperty.reset();
    this.soluteFormProperty.reset();
    this.solution.reset();
    this.shaker.reset();
    this.shakerParticles.reset();
    this.dropper.reset();
    this.evaporator.reset();
    this.solventFaucet.reset();
    this.drainFaucet.reset();
    this.concentrationMeter.reset();
  }

  /*
   * Moves time forward by the specified time delta, in seconds.
   */
  public step( dt: number ): void {
    this.addSolventFromInputFaucet( dt );
    this.drainSolutionFromOutputFaucet( dt );
    this.addStockSolutionFromDropper( dt );
    this.evaporateSolvent( dt );
    this.propagateShakerParticles( dt );
    this.createShakerParticles();
  }

  // Adds solvent from the input faucet.
  private addSolventFromInputFaucet( dt: number ): void {
    this.addSolvent( this.solventFaucet.flowRateProperty.value * dt );
  }

  // Drains solution from the output faucet.
  private drainSolutionFromOutputFaucet( dt: number ): void {
    const drainVolume = this.drainFaucet.flowRateProperty.value * dt;
    if ( drainVolume > 0 ) {
      const concentration = this.solution.concentrationProperty.value; // get concentration before changing volume
      const volumeRemoved = this.removeSolvent( drainVolume );
      this.removeSolute( concentration * volumeRemoved );
    }
  }

  // Adds stock solution from dropper.
  private addStockSolutionFromDropper( dt: number ): void {
    const dropperVolume = this.dropper.flowRateProperty.value * dt;
    if ( dropperVolume > 0 ) {

      // defer update of precipitateAmount until we've changed both volume and solute amount, see concentration#1
      this.solution.updatePrecipitateAmount = false;
      const volumeAdded = this.addSolvent( dropperVolume );
      this.solution.updatePrecipitateAmount = true;
      this.addSolute( this.solution.soluteProperty.value.stockSolutionConcentration * volumeAdded );
    }
  }

  // Evaporates solvent.
  private evaporateSolvent( dt: number ): void {
    this.removeSolvent( this.evaporator.evaporationRateProperty.value * dt );
  }

  // Propagates solid solute that came out of the shaker.
  private propagateShakerParticles( dt: number ): void {
    this.shakerParticles.step( dt );
  }

  // Creates new solute particles when the shaker is shaken.
  private createShakerParticles(): void {
    this.shaker.step();
  }

  // Adds solvent to the solution. Returns the amount actually added.
  private addSolvent( deltaVolume: number ): number {
    if ( deltaVolume > 0 ) {
      const volumeProperty = this.solution.volumeProperty;
      const volumeBefore = volumeProperty.value;
      volumeProperty.value = Math.min( SOLUTION_VOLUME_RANGE.max, volumeProperty.value + deltaVolume );
      return volumeProperty.value - volumeBefore;
    }
    else {
      return 0;
    }
  }

  // Removes solvent from the solution. Returns the amount actually removed.
  private removeSolvent( deltaVolume: number ): number {
    if ( deltaVolume > 0 ) {
      const volumeProperty = this.solution.volumeProperty;
      const volumeBefore = volumeProperty.value;
      volumeProperty.value = Math.max( SOLUTION_VOLUME_RANGE.min, volumeProperty.value - deltaVolume );
      return volumeBefore - volumeProperty.value;
    }
    else {
      return 0;
    }
  }

  // Adds solute to the solution. Returns the amount actually added.
  private addSolute( deltaAmount: number ): number {
    if ( deltaAmount > 0 ) {
      const amountBefore = this.solution.soluteMolesProperty.value;
      this.solution.soluteMolesProperty.value =
        Math.min( SOLUTE_AMOUNT_RANGE.max, this.solution.soluteMolesProperty.value + deltaAmount );
      return this.solution.soluteMolesProperty.value - amountBefore;
    }
    else {
      return 0;
    }
  }

  // Removes solute from the solution. Returns the amount actually removed.
  private removeSolute( deltaAmount: number ): number {
    if ( deltaAmount > 0 ) {
      const amountBefore = this.solution.soluteMolesProperty.value;
      this.solution.soluteMolesProperty.value =
        Math.max( SOLUTE_AMOUNT_RANGE.min, this.solution.soluteMolesProperty.value - deltaAmount );
      return amountBefore - this.solution.soluteMolesProperty.value;
    }
    else {
      return 0;
    }
  }
}

beersLawLab.register( 'ConcentrationModel', ConcentrationModel );