// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model container for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Beaker = require( 'BEERS_LAW_LAB/concentration/model/Beaker' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ConcentrationMeter = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationMeter' );
  var ConcentrationSolution = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationSolution' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Dropper = require( 'BEERS_LAW_LAB/concentration/model/Dropper' );
  var Evaporator = require( 'BEERS_LAW_LAB/concentration/model/Evaporator' );
  var Faucet = require( 'BEERS_LAW_LAB/concentration/model/Faucet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Precipitate = require( 'BEERS_LAW_LAB/concentration/model/Precipitate' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Shaker = require( 'BEERS_LAW_LAB/concentration/model/Shaker' );
  var ShakerParticles = require( 'BEERS_LAW_LAB/concentration/model/ShakerParticles' );
  var Solute = require( 'BEERS_LAW_LAB/concentration/model/Solute' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BEAKER_VOLUME = 1; // L
  var SOLUTION_VOLUME_RANGE = new Range( 0, BEAKER_VOLUME, 0.5 ); // L
  var SOLUTE_AMOUNT = new Range( 0, 6, 0 ); // moles
  var DEFAULT_SOLUTE_AMOUNT = 0; // moles
  var MAX_EVAPORATION_RATE = 0.25; // L/sec
  var MAX_INPUT_FLOW_RATE = 0.25; // L/sec
  var MAX_OUTPUT_FLOW_RATE = MAX_INPUT_FLOW_RATE; // L/sec
  var DROPPER_FLOW_RATE = 0.05; // L/sec
  var SHAKER_MAX_DISPENSING_RATE = 0.2; // mol/sec

  function ConcentrationModel() {

    var thisModel = this;

    // Solutes, in rainbow (ROYGBIV) order.
    thisModel.solutes = [
      Solute.DRINK_MIX,
      Solute.COBALT_II_NITRATE,
      Solute.COBALT_CHLORIDE,
      Solute.POTASSIUM_DICHROMATE,
      Solute.POTASSIUM_CHROMATE,
      Solute.NICKEL_II_CHLORIDE,
      Solute.COPPER_SULFATE,
      Solute.POTASSIUM_PERMANGANATE
    ];

    // model elements
    thisModel.solute = new Property( thisModel.solutes[ 0 ] );

    // The Public API for this simulation provides a simplified name for the selected solute
    // Here, we perform 2-way binding between the solute name and the solute instance
    // This means we can get the value of the solute by name, and set it back by name,
    // which enables save/load/record/playback/configuration through query parameters/etc.
    var soluteAPINameProperty = new Property( thisModel.solute.value.apiName );
    thisModel.solute.link( function( solute ) {
      soluteAPINameProperty.value = solute.apiName;
    } );
    soluteAPINameProperty.link( function( soluteAPIName ) {
      for ( var i = 0; i < thisModel.solutes.length; i++ ) {
        var solute = thisModel.solutes[ i ];
        if ( solute.apiName === soluteAPIName ) {
          thisModel.solute.value = solute;
        }
      }
    } );

    thisModel.solution = new ConcentrationSolution( thisModel.solute, DEFAULT_SOLUTE_AMOUNT, SOLUTION_VOLUME_RANGE.defaultValue );
    thisModel.beaker = new Beaker( new Vector2( 400, 550 ), new Dimension2( 600, 300 ), 1 );
    thisModel.precipitate = new Precipitate( thisModel.solution, thisModel.beaker );
    thisModel.shaker = new Shaker( new Vector2( thisModel.beaker.location.x, 170 ), new Bounds2( 225, 50, 625, 210 ), 0.75 * Math.PI, thisModel.solute, SHAKER_MAX_DISPENSING_RATE, true );
    thisModel.shakerParticles = new ShakerParticles( thisModel.shaker, thisModel.solution, thisModel.beaker );
    thisModel.dropper = new Dropper( new Vector2( thisModel.beaker.location.x, 225 ), new Bounds2( 250, 225, 570, 225 ), thisModel.solute, DROPPER_FLOW_RATE, false );
    thisModel.evaporator = new Evaporator( MAX_EVAPORATION_RATE, thisModel.solution );
    thisModel.solventFaucet = new Faucet( new Vector2( 155, 220 ), -400, 45, MAX_INPUT_FLOW_RATE, { flowRateComponentID: 'concentrationScreen.solventFaucet.flowRate' } );
    thisModel.drainFaucet = new Faucet( new Vector2( 800, 630 ), thisModel.beaker.getRight(), 45, MAX_OUTPUT_FLOW_RATE, { flowRateComponentID: 'concentrationScreen.drainFaucet.flowRate' } );
    thisModel.concentrationMeter = new ConcentrationMeter( new Vector2( 785, 210 ), new Bounds2( 10, 150, 835, 680 ),
      new Vector2( 750, 370 ), new Bounds2( 30, 150, 966, 680 ) );

    // Things to do when the solute is changed.
    thisModel.solute.link( function() {
      thisModel.solution.soluteAmount.set( 0 );
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    thisModel.solution.volume.link( function( volume ) {
      thisModel.solventFaucet.enabled.set( volume < SOLUTION_VOLUME_RANGE.max );
      thisModel.drainFaucet.enabled.set( volume > SOLUTION_VOLUME_RANGE.min );
      thisModel.dropper.enabled.set( !thisModel.dropper.empty.get() && ( volume < SOLUTION_VOLUME_RANGE.max ) );
    } );

    // Empty shaker and dropper when max solute is reached.
    thisModel.solution.soluteAmount.link( function( soluteAmount ) {
      var containsMaxSolute = ( soluteAmount >= SOLUTE_AMOUNT.max );
      thisModel.shaker.empty.set( containsMaxSolute );
      thisModel.dropper.empty.set( containsMaxSolute );
      thisModel.dropper.enabled.set( !thisModel.dropper.empty.get() && !containsMaxSolute && thisModel.solution.volume.get() < SOLUTION_VOLUME_RANGE.max );
    } );
  }

  return inherit( Object, ConcentrationModel, {

    // Resets all model elements
    reset: function() {
      this.solute.reset();
      this.solution.reset();
      this.shaker.reset();
      this.dropper.reset();
      this.evaporator.reset();
      this.solventFaucet.reset();
      this.drainFaucet.reset();
      this.concentrationMeter.reset();
    },

    /*
     * Moves time forward by the specified amount.
     * @param deltaSeconds clock time change, in seconds.
     */
    step: function( deltaSeconds ) {
      this.addSolventFromInputFaucet( deltaSeconds );
      this.drainSolutionFromOutputFaucet( deltaSeconds );
      this.addStockSolutionFromDropper( deltaSeconds );
      this.evaporateSolvent( deltaSeconds );
      this.propagateShakerParticles( deltaSeconds );
      this.createShakerParticles();
    },

    // @private Add solvent from the input faucet
    addSolventFromInputFaucet: function( deltaSeconds ) {
      this.addSolvent( this.solventFaucet.flowRate.get() * deltaSeconds );
    },

    // @private Drain solution from the output faucet
    drainSolutionFromOutputFaucet: function( deltaSeconds ) {
      var drainVolume = this.drainFaucet.flowRate.get() * deltaSeconds;
      if ( drainVolume > 0 ) {
        var concentration = this.solution.concentration.get(); // get concentration before changing volume
        var volumeRemoved = this.removeSolvent( drainVolume );
        this.removeSolute( concentration * volumeRemoved );
      }
    },

    // @private Add stock solution from dropper
    addStockSolutionFromDropper: function( deltaSeconds ) {
      var dropperVolume = this.dropper.flowRate.get() * deltaSeconds;
      if ( dropperVolume > 0 ) {
        var volumeAdded = this.addSolvent( dropperVolume );
        this.addSolute( this.solution.solute.get().stockSolutionConcentration * volumeAdded );
      }
    },

    // @private Evaporate solvent
    evaporateSolvent: function( deltaSeconds ) {
      this.removeSolvent( this.evaporator.evaporationRate.get() * deltaSeconds );
    },

    // @private Propagates solid solute that came out of the shaker
    propagateShakerParticles: function( deltaSeconds ) {
      this.shakerParticles.step( deltaSeconds );
    },

    // @private Creates new solute particles when the shaker is shaken.
    createShakerParticles: function() {
      this.shaker.step();
    },

    // @private Adds solvent to the solution. Returns the amount actually added.
    addSolvent: function( deltaVolume ) {
      if ( deltaVolume > 0 ) {
        var volumeBefore = this.solution.volume.get();
        this.solution.volume.set( Math.min( SOLUTION_VOLUME_RANGE.max, this.solution.volume.get() + deltaVolume ) );
        return this.solution.volume.get() - volumeBefore;
      }
      else {
        return 0;
      }
    },

    // @private Removes solvent from the solution. Returns the amount actually removed.
    removeSolvent: function( deltaVolume ) {
      if ( deltaVolume > 0 ) {
        var volumeBefore = this.solution.volume.get();
        this.solution.volume.set( Math.max( SOLUTION_VOLUME_RANGE.min, this.solution.volume.get() - deltaVolume ) );
        return volumeBefore - this.solution.volume.get();
      }
      else {
        return 0;
      }
    },

    // @private Adds solute to the solution. Returns the amount actually added.
    addSolute: function( deltaAmount ) {
      if ( deltaAmount > 0 ) {
        var amountBefore = this.solution.soluteAmount.get();
        this.solution.soluteAmount.set( Math.min( SOLUTE_AMOUNT.max, this.solution.soluteAmount.get() + deltaAmount ) );
        return this.solution.soluteAmount.get() - amountBefore;
      }
      else {
        return 0;
      }
    },

    // @private Removes solute from the solution. Returns the amount actually removed.
    removeSolute: function( deltaAmount ) {
      if ( deltaAmount > 0 ) {
        var amountBefore = this.solution.soluteAmount.get();
        this.solution.soluteAmount.set( Math.max( SOLUTE_AMOUNT.min, this.solution.soluteAmount.get() - deltaAmount ) );
        return amountBefore - this.solution.soluteAmount.get();
      }
      else {
        return 0;
      }
    }
  } );
} );
