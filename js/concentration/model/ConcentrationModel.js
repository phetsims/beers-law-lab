// Copyright 2002-2013, University of Colorado

/**
 * Model container for the "Concentration" module.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Dimension2 = require( "DOT/Dimension2" );
  var Vector2 = require( "DOT/Vector2" );
  var Range = require( "PHETCOMMON/math/Range" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Rectangle = require( "common/model/Rectangle" );
  var Beaker = require( "concentration/model/Beaker" );
  var ConcentrationSolution = require( "concentration/model/ConcentrationSolution" );
  var Shaker = require( "concentration/model/Shaker" );
  var Dropper = require( "concentration/model/Dropper" );
  var Faucet = require( "concentration/model/Faucet" );
  var Solute = require( "concentration/model/Solute" );
  var Evaporator = require( "concentration/model/Evaporator" );
  var ConcentrationMeter = require( "concentration/model/ConcentrationMeter" );
  var Precipitate = require( "concentration/model/Precipitate" );
  var ShakerParticles = require( "concentration/model/ShakerParticles" );

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

    var model = this;

    // Solutes, in rainbow (ROYGBIV) order.
    model.solutes = [
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
    model.solute = new Property( model.solutes[0] );
    model.solution = new ConcentrationSolution( model.solute, DEFAULT_SOLUTE_AMOUNT, SOLUTION_VOLUME_RANGE.defaultValue );
    model.beaker = new Beaker( new Vector2( 400, 550 ), new Dimension2( 600, 300 ), 1 );
    model.precipitate = new Precipitate( model.solution, model.beaker );
    model.shaker = new Shaker( new Vector2( 340, 170 ), new Rectangle( 225, 50, 400, 160 ), 0.75 * Math.PI, model.solute, SHAKER_MAX_DISPENSING_RATE );
    model.shakerParticles = new ShakerParticles( model.shaker, model.solution, model.beaker );
    model.dropper = new Dropper( new Vector2( 375, 210 ), new Rectangle( 230, 205, 400, 30 ), model.solute, DROPPER_FLOW_RATE );
    model.evaporator = new Evaporator( MAX_EVAPORATION_RATE, model.solution );
    model.solventFaucet = new Faucet( new Vector2( 150, 220 ), 40, 100, MAX_INPUT_FLOW_RATE );
    model.drainFaucet = new Faucet( new Vector2( 790, 607 ), 40, 5, MAX_OUTPUT_FLOW_RATE );
    model.concentrationMeter = new ConcentrationMeter( new Vector2( 785, 210 ), new Rectangle( 10, 150, 825, 530 ),
                                                       new Vector2( 750, 370 ), new Rectangle( 30, 150, 935, 530 ) );

    // Things to do when the solute is changed.
    model.solute.addObserver( function ( solute ) {
      model.solution.soluteAmount.set( 0 );
    } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    model.solution.volume.addObserver( function ( volume ) {
      model.solventFaucet.enabled.set( volume < SOLUTION_VOLUME_RANGE.max );
      model.drainFaucet.enabled.set( volume > SOLUTION_VOLUME_RANGE.min );
      model.dropper.enabled.set( !model.dropper.empty.get() && ( volume < SOLUTION_VOLUME_RANGE.max ) );
    } );

    // Empty shaker and dropper when max solute is reached.
    model.solution.soluteAmount.addObserver( function ( soluteAmount ) {
      var containsMaxSolute = ( soluteAmount >= SOLUTE_AMOUNT.max );
      model.shaker.empty.set( containsMaxSolute );
      model.dropper.empty.set( containsMaxSolute );
      model.dropper.enabled.set( !model.dropper.empty.get() && !containsMaxSolute && model.solution.volume.get() < SOLUTION_VOLUME_RANGE.max );
    } );
  }

  // Resets all model elements
  ConcentrationModel.prototype.reset = function () {
    var model = this;
    model.solute.reset();
    model.solution.reset();
    model.shaker.reset();
    model.dropper.reset();
    model.evaporator.reset();
    model.solventFaucet.reset();
    model.drainFaucet.reset();
    model.concentrationMeter.reset();
  };

  /*
   * Moves time forward by the specified amount.
   * @param deltaSeconds clock time change, in seconds.
   */
  ConcentrationModel.prototype.step = function ( deltaSeconds ) {
    this._addSolventFromInputFaucet( deltaSeconds );
    this._drainSolutionFromOutputFaucet( deltaSeconds );
    this._addStockSolutionFromDropper( deltaSeconds );
    this._evaporateSolvent( deltaSeconds );
    this._propagateShakerParticles( deltaSeconds );
    this._createShakerParticles();
  };

  // Add solvent from the input faucet
  ConcentrationModel.prototype._addSolventFromInputFaucet = function ( deltaSeconds ) {
    this._addSolvent( this.solventFaucet.flowRate.get() * deltaSeconds );
  };

  // Drain solution from the output faucet
  ConcentrationModel.prototype._drainSolutionFromOutputFaucet = function ( deltaSeconds ) {
    var drainVolume = this.drainFaucet.flowRate.get() * deltaSeconds;
    if ( drainVolume > 0 ) {
      var concentration = this.solution.concentration.get(); // get concentration before changing volume
      var volumeRemoved = this._removeSolvent( drainVolume );
      this._removeSolute( concentration * volumeRemoved );
    }
  };

  // Add stock solution from dropper
  ConcentrationModel.prototype._addStockSolutionFromDropper = function ( deltaSeconds ) {
    var dropperVolume = this.dropper.flowRate.get() * deltaSeconds;
    if ( dropperVolume > 0 ) {
      var volumeAdded = this._addSolvent( dropperVolume );
      this._addSolute( this.solution.solute.get().stockSolutionConcentration * volumeAdded );
    }
  };

  // Evaporate solvent
  ConcentrationModel.prototype._evaporateSolvent = function ( deltaSeconds ) {
    this._removeSolvent( this.evaporator.evaporationRate.get() * deltaSeconds );
  };

  // Propagate solid solute that came out of the shaker
  ConcentrationModel.prototype._propagateShakerParticles = function ( deltaSeconds ) {
    this.shakerParticles.step( deltaSeconds );
  };

  // Create new solute particles when the shaker is shaken.
  ConcentrationModel.prototype._createShakerParticles = function () {
    this.shaker.step();
  };

  // Adds solvent to the solution. Returns the amount actually added.
  ConcentrationModel.prototype._addSolvent = function ( deltaVolume ) {
    if ( deltaVolume > 0 ) {
      var volumeBefore = this.solution.volume.get();
      this.solution.volume.set( Math.min( SOLUTION_VOLUME_RANGE.max, this.solution.volume.get() + deltaVolume ) );
      return this.solution.volume.get() - volumeBefore;
    }
    else {
      return 0;
    }
  };

  // Removes solvent from the solution. Returns the amount actually removed.
  ConcentrationModel.prototype._removeSolvent = function ( deltaVolume ) {
    if ( deltaVolume > 0 ) {
      var volumeBefore = this.solution.volume.get();
      this.solution.volume.set( Math.max( SOLUTION_VOLUME_RANGE.min, this.solution.volume.get() - deltaVolume ) );
      return volumeBefore - this.solution.volume.get();
    }
    else {
      return 0;
    }
  };

  // Adds solvent to the solution. Returns the amount actually added.
  ConcentrationModel.prototype._addSolute = function ( deltaAmount ) {
    if ( deltaAmount > 0 ) {
      var amountBefore = this.solution.soluteAmount.get();
      this.solution.soluteAmount.set( Math.min( SOLUTE_AMOUNT.max, this.solution.soluteAmount.get() + deltaAmount ) );
      return this.solution.soluteAmount.get() - amountBefore;
    }
    else {
      return 0;
    }
  };

  // Removes solvent from the solution. Returns the amount actually removed.
  ConcentrationModel.prototype._removeSolute = function ( deltaAmount ) {
    if ( deltaAmount > 0 ) {
      var amountBefore = this.solution.soluteAmount.get();
      this.solution.soluteAmount.set( Math.max( SOLUTE_AMOUNT.min, this.solution.soluteAmount.get() - deltaAmount ) );
      return amountBefore - this.solution.soluteAmount.get();
    }
    else {
      return 0;
    }
  };

  return ConcentrationModel;
} );
