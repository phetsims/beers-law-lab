// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model container for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import Beaker from './Beaker.js';
import ConcentrationMeter from './ConcentrationMeter.js';
import ConcentrationSolution from './ConcentrationSolution.js';
import Dropper from './Dropper.js';
import Evaporator from './Evaporator.js';
import Faucet from './Faucet.js';
import Precipitate from './Precipitate.js';
import Shaker from './Shaker.js';
import ShakerParticles from './ShakerParticles.js';
import Solute from './Solute.js';
import SoluteForm from './SoluteForm.js';

// constants
const SOLUTION_VOLUME_RANGE = BLLConstants.SOLUTION_VOLUME_RANGE; // L
const SOLUTE_AMOUNT_RANGE = BLLConstants.SOLUTE_AMOUNT_RANGE; // moles
const MAX_EVAPORATION_RATE = 0.25; // L/sec
const MAX_FAUCET_FLOW_RATE = 0.25; // L/sec
const DROPPER_FLOW_RATE = 0.05; // L/sec
const SHAKER_MAX_DISPENSING_RATE = 0.2; // mol/sec

class ConcentrationModel extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioType: ConcentrationModel.ConcentrationModelIO,
      phetioState: false // does not contribute self-state, all of the state is from child instances (via composition)
    }, options );

    super( options );

    // @public {Solute[]} in rainbow (ROYGBIV) order.
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

    // @public
    this.soluteProperty = new Property( this.solutes[ 0 ], {
      tandem: options.tandem.createTandem( 'soluteProperty' ),
      phetioType: Property.PropertyIO( Solute.SoluteIO )
    } );
    this.soluteFormProperty = new EnumerationProperty( SoluteForm, SoluteForm.SOLID, {
      tandem: options.tandem.createTandem( 'soluteFormProperty' )
    } );

    // @public
    this.solution = new ConcentrationSolution( this.soluteProperty, SOLUTE_AMOUNT_RANGE.defaultValue,
      SOLUTION_VOLUME_RANGE.defaultValue, {
        tandem: options.tandem.createTandem( 'solution' )
      } );
    this.beaker = new Beaker( new Vector2( 350, 550 ), new Dimension2( 600, 300 ), 1 );
    this.precipitate = new Precipitate( this.solution, this.beaker, {
      tandem: options.tandem.createTandem( 'precipitate' )
    } );
    this.shaker = new Shaker(
      new Vector2( this.beaker.position.x, 170 ),
      new Bounds2( 250, 50, 575, 210 ),
      0.75 * Math.PI,
      this.soluteProperty,
      SHAKER_MAX_DISPENSING_RATE,
      this.soluteFormProperty.value === SoluteForm.SOLID, {
        tandem: options.tandem.createTandem( 'shaker' )
      } );
    this.shakerParticles = new ShakerParticles( this.shaker, this.solution, this.beaker, {
      tandem: options.tandem.createTandem( 'shakerParticles' )
    } );
    this.dropper = new Dropper(
      new Vector2( this.beaker.position.x, 225 ),
      new Bounds2( 260, 225, 580, 225 ),
      this.soluteProperty,
      DROPPER_FLOW_RATE,
      this.soluteFormProperty.value === SoluteForm.SOLUTION, {
        tandem: options.tandem.createTandem( 'dropper' )
      }
    );
    this.evaporator = new Evaporator( MAX_EVAPORATION_RATE, this.solution, {
      tandem: options.tandem.createTandem( 'evaporator' )
    } );
    this.solventFaucet = new Faucet( new Vector2( 155, 220 ), -400, 45, MAX_FAUCET_FLOW_RATE, {
      tandem: options.tandem.createTandem( 'solventFaucet' )
    } );
    this.drainFaucet = new Faucet( new Vector2( 750, 630 ), this.beaker.getRight(), 45, MAX_FAUCET_FLOW_RATE, {
      tandem: options.tandem.createTandem( 'drainFaucet' )
    } );
    this.concentrationMeter = new ConcentrationMeter(
      new Vector2( 785, 210 ), new Bounds2( 10, 150, 835, 680 ),
      new Vector2( 750, 370 ), new Bounds2( 30, 150, 966, 680 ), {
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

  /*
   * May be called from PhET-iO before the UI is constructed to choose a different set of solutes.  The first solute
   * becomes the selected solute
   * @param {Array.<Solute>} solutes
   * @public
   */
  setSolutes( solutes ) {
    assert && assert( solutes.length > 0, 'Must specify at least one solute' );
    this.solutes = solutes;
    this.soluteProperty.value = solutes[ 0 ];
  }

  // @public Resets all model elements
  reset() {
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
   * Moves time forward by the specified amount.
   * @param {number} deltaSeconds clock time change, in seconds.
   * @public
   */
  step( deltaSeconds ) {
    this.addSolventFromInputFaucet( deltaSeconds );
    this.drainSolutionFromOutputFaucet( deltaSeconds );
    this.addStockSolutionFromDropper( deltaSeconds );
    this.evaporateSolvent( deltaSeconds );
    this.propagateShakerParticles( deltaSeconds );
    this.createShakerParticles();
  }

  // @private Add solvent from the input faucet
  addSolventFromInputFaucet( deltaSeconds ) {
    this.addSolvent( this.solventFaucet.flowRateProperty.value * deltaSeconds );
  }

  // @private Drain solution from the output faucet
  drainSolutionFromOutputFaucet( deltaSeconds ) {
    const drainVolume = this.drainFaucet.flowRateProperty.value * deltaSeconds;
    if ( drainVolume > 0 ) {
      const concentration = this.solution.concentrationProperty.value; // get concentration before changing volume
      const volumeRemoved = this.removeSolvent( drainVolume );
      this.removeSolute( concentration * volumeRemoved );
    }
  }

  // @private Add stock solution from dropper
  addStockSolutionFromDropper( deltaSeconds ) {
    const dropperVolume = this.dropper.flowRateProperty.value * deltaSeconds;
    if ( dropperVolume > 0 ) {

      // defer update of precipitateAmount until we've changed both volume and solute amount, see concentration#1
      this.solution.updatePrecipitateAmount = false;
      const volumeAdded = this.addSolvent( dropperVolume );
      this.solution.updatePrecipitateAmount = true;
      this.addSolute( this.solution.soluteProperty.value.stockSolutionConcentration * volumeAdded );
    }
  }

  // @private Evaporate solvent
  evaporateSolvent( deltaSeconds ) {
    this.removeSolvent( this.evaporator.evaporationRateProperty.value * deltaSeconds );
  }

  // @private Propagates solid solute that came out of the shaker
  propagateShakerParticles( deltaSeconds ) {
    this.shakerParticles.step( deltaSeconds );
  }

  // @private Creates new solute particles when the shaker is shaken.
  createShakerParticles() {
    this.shaker.step();
  }

  // @private Adds solvent to the solution. Returns the amount actually added.
  addSolvent( deltaVolume ) {
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

  // @private Removes solvent from the solution. Returns the amount actually removed.
  removeSolvent( deltaVolume ) {
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

  // @private Adds solute to the solution. Returns the amount actually added.
  addSolute( deltaAmount ) {
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

  // @private Removes solute from the solution. Returns the amount actually removed.
  removeSolute( deltaAmount ) {
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

ConcentrationModel.SOLUTION_VOLUME_RANGE = SOLUTION_VOLUME_RANGE; // Exported for access to phet-io API

ConcentrationModel.ConcentrationModelIO = new IOType( 'ConcentrationModelIO', {
  valueType: ConcentrationModel,
  documentation: 'The model for the concentration screen.',
  methods: {
    setSolutes: {
      parameterTypes: [ ArrayIO( Solute.SoluteIO ) ],
      returnType: VoidIO,
      implementation: solutes => this.setSolutes( solutes ),
      documentation: 'Set which solutes are allowed for selection',
      invocableForReadOnlyElements: false
    }
  }
} );

beersLawLab.register( 'ConcentrationModel', ConcentrationModel );
export default ConcentrationModel;