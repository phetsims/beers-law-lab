// Copyright 2002-2013, University of Colorado

/**
 * Model container for the "Concentration" tab.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Beaker = require( "concentration/model/Beaker" );
  var Bounds2 = require( "DOT/Bounds2" );
  var ConcentrationMeter = require( "concentration/model/ConcentrationMeter" );
  var ConcentrationSolution = require( "concentration/model/ConcentrationSolution" );
  var Dimension2 = require( "DOT/Dimension2" );
  var Dropper = require( "concentration/model/Dropper" );
  var Evaporator = require( "concentration/model/Evaporator" );
  var Faucet = require( "concentration/model/Faucet" );
  var Precipitate = require( "concentration/model/Precipitate" );
  var Property = require( "AXON/Property" );
  var Range = require( "DOT/Range" );
  var Shaker = require( "concentration/model/Shaker" );
  var ShakerParticles = require( "concentration/model/ShakerParticles" );
  var Solute = require( "concentration/model/Solute" );
  var Vector2 = require( "DOT/Vector2" );

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
    thisModel.solute = new Property( thisModel.solutes[0] );
    thisModel.solution = new ConcentrationSolution( thisModel.solute, DEFAULT_SOLUTE_AMOUNT, SOLUTION_VOLUME_RANGE.defaultValue );
    thisModel.beaker = new Beaker( new Vector2( 400, 550 ), new Dimension2( 600, 300 ), 1 );
    thisModel.precipitate = new Precipitate( thisModel.solution, thisModel.beaker );
    thisModel.shaker = new Shaker( new Vector2( thisModel.beaker.location.x, 170 ), new Bounds2( 225, 50, 625, 210 ), 0.75 * Math.PI, thisModel.solute, SHAKER_MAX_DISPENSING_RATE, true );
    thisModel.shakerParticles = new ShakerParticles( thisModel.shaker, thisModel.solution, thisModel.beaker );
    thisModel.dropper = new Dropper( new Vector2( thisModel.beaker.location.x, 210 ), new Bounds2( 230, 205, 630, 235 ), thisModel.solute, DROPPER_FLOW_RATE, false );
    thisModel.evaporator = new Evaporator( MAX_EVAPORATION_RATE, thisModel.solution );
    thisModel.solventFaucet = new Faucet( new Vector2( 150, 220 ), -100, 40, MAX_INPUT_FLOW_RATE );
    thisModel.drainFaucet = new Faucet( new Vector2( 800, 607 ), thisModel.beaker.getRight(), 40, MAX_OUTPUT_FLOW_RATE );
    thisModel.concentrationMeter = new ConcentrationMeter( new Vector2( 785, 210 ), new Bounds2( 10, 150, 835, 680 ),
      new Vector2( 750, 370 ), new Bounds2( 30, 150, 966, 680 ) );

    // Things to do when the solute is changed.
    thisModel.solute.link( function( solute ) {
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

  ConcentrationModel.prototype = {

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
      this._addSolventFromInputFaucet( deltaSeconds );
      this._drainSolutionFromOutputFaucet( deltaSeconds );
      this._addStockSolutionFromDropper( deltaSeconds );
      this._evaporateSolvent( deltaSeconds );
      this._propagateShakerParticles( deltaSeconds );
      this._createShakerParticles();
    },

    // Add solvent from the input faucet
    _addSolventFromInputFaucet: function( deltaSeconds ) {
      this._addSolvent( this.solventFaucet.flowRate.get() * deltaSeconds );
    },

    // Drain solution from the output faucet
    _drainSolutionFromOutputFaucet: function( deltaSeconds ) {
      var drainVolume = this.drainFaucet.flowRate.get() * deltaSeconds;
      if ( drainVolume > 0 ) {
        var concentration = this.solution.concentration.get(); // get concentration before changing volume
        var volumeRemoved = this._removeSolvent( drainVolume );
        this._removeSolute( concentration * volumeRemoved );
      }
    },

    // Add stock solution from dropper
    _addStockSolutionFromDropper: function( deltaSeconds ) {
      var dropperVolume = this.dropper.flowRate.get() * deltaSeconds;
      if ( dropperVolume > 0 ) {
        var volumeAdded = this._addSolvent( dropperVolume );
        this._addSolute( this.solution.solute.get().stockSolutionConcentration * volumeAdded );
      }
    },

    // Evaporate solvent
    _evaporateSolvent: function( deltaSeconds ) {
      this._removeSolvent( this.evaporator.evaporationRate.get() * deltaSeconds );
    },

    // Propagate solid solute that came out of the shaker
    _propagateShakerParticles: function( deltaSeconds ) {
      this.shakerParticles.step( deltaSeconds );
    },

    // Create new solute particles when the shaker is shaken.
    _createShakerParticles: function() {
      this.shaker.step();
    },

    // Adds solvent to the solution. Returns the amount actually added.
    _addSolvent: function( deltaVolume ) {
      if ( deltaVolume > 0 ) {
        var volumeBefore = this.solution.volume.get();
        this.solution.volume.set( Math.min( SOLUTION_VOLUME_RANGE.max, this.solution.volume.get() + deltaVolume ) );
        return this.solution.volume.get() - volumeBefore;
      }
      else {
        return 0;
      }
    },

    // Removes solvent from the solution. Returns the amount actually removed.
    _removeSolvent: function( deltaVolume ) {
      if ( deltaVolume > 0 ) {
        var volumeBefore = this.solution.volume.get();
        this.solution.volume.set( Math.max( SOLUTION_VOLUME_RANGE.min, this.solution.volume.get() - deltaVolume ) );
        return volumeBefore - this.solution.volume.get();
      }
      else {
        return 0;
      }
    },

    // Adds solvent to the solution. Returns the amount actually added.
    _addSolute: function( deltaAmount ) {
      if ( deltaAmount > 0 ) {
        var amountBefore = this.solution.soluteAmount.get();
        this.solution.soluteAmount.set( Math.min( SOLUTE_AMOUNT.max, this.solution.soluteAmount.get() + deltaAmount ) );
        return this.solution.soluteAmount.get() - amountBefore;
      }
      else {
        return 0;
      }
    },

    // Removes solvent from the solution. Returns the amount actually removed.
    _removeSolute: function( deltaAmount ) {
      if ( deltaAmount > 0 ) {
        var amountBefore = this.solution.soluteAmount.get();
        this.solution.soluteAmount.set( Math.max( SOLUTE_AMOUNT.min, this.solution.soluteAmount.get() - deltaAmount ) );
        return amountBefore - this.solution.soluteAmount.get();
      }
      else {
        return 0;
      }
    }
  };

  return ConcentrationModel;
} );
