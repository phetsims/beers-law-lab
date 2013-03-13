// Copyright 2002-2013, University of Colorado

/**
 * Solution model for the "Concentration" module.
 * This module has a single solution that is mutated by changing the solute, solute amount, and volume.
 * Concentration is derived via M=mol/L.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Color = require( "common/model/Color" );
  var Solvent = require( "common/model/Solvent" );
  var Fluid = require( "common/model/Fluid" );

  /**
   * @param {Property(Solute)} solute
   * @param {Number} soluteAmount moles
   * @param {NUmber} volume L
   */
  function ConcentrationSolution( solute, soluteAmount, volume ) {

    Fluid.call( this, Color.WHITE ); // constructor stealing

    var solution = this;

    solution.solvent = Solvent.WATER;
    solution.solute = solute;
    solution.soluteAmount = new Property( soluteAmount );
    solution.volume = new Property( volume );

    // derive concentration (M)
    solution.concentration = new Property( 0 );
    var updateConcentration = function () {
      var volume = solution.volume.get();
      var soluteAmount = solution.soluteAmount.get();
      var concentration = ( volume > 0 ) ? Math.min( solution.getSaturatedConcentration(), soluteAmount / volume ) : 0; // M = mol/L
      solution.concentration.set( concentration );
    };
    solution.solute.addObserver( updateConcentration );
    solution.soluteAmount.addObserver( updateConcentration );
    solution.volume.addObserver( updateConcentration );

    // derive amount of precipitate (moles)
    solution.precipitateAmount = new Property( 0 );
    var updatePrecipitateAmount = function () {
      var volume = solution.volume.get();
      if ( volume > 0 ) {
        solution.precipitateAmount.set( Math.max( 0, volume * ( ( solution.soluteAmount.get() / volume ) - solution.getSaturatedConcentration() ) ) );
      }
      else {
        solution.precipitateAmount( solution.soluteAmount.get() );
      }
    };
    solution.solute.addObserver( updatePrecipitateAmount );
    solution.soluteAmount.addObserver( updatePrecipitateAmount );
    solution.volume.addObserver( updatePrecipitateAmount );

    // derive the solution color
    var updateColor = function () {
      solution.color.set( ConcentrationSolution.createColor( solution.solvent, solution.solute.get(), solution.concentration.get() ) );
    }
    solution.solute.addObserver( updateColor );
    solution.concentration.addObserver( updateColor );

    // reset
    solution.reset = function () {
      Inheritance.callSuper( Fluid, "reset", this );
      solution.soluteAmount.reset();
      solution.volume.reset();
    }
  }

  Inheritance.inheritPrototype( ConcentrationSolution, Fluid ); // prototype chaining

  // convenience function
  ConcentrationSolution.prototype.getSaturatedConcentration = function () {
    return this.solute.get().getSaturatedConcentration();
  };

  ConcentrationSolution.prototype.isSaturated = function () {
    var saturated = false;
    if ( this.volume.get() > 0 ) {
      saturated = ( this.soluteAmount.get() / this.volume.get() ) > this.getSaturatedConcentration();
    }
    return saturated;
  };

  ConcentrationSolution.prototype.getNumberOfPrecipitateParticles = function () {
    var numberOfParticles = Math.round( this.solute.get().particlesPerMole * this.precipitateAmount.get() );
    if ( numberOfParticles == 0 && this.precipitateAmount.get() > 0 ) {
      numberOfParticles = 1;
    }
    return numberOfParticles;
  };

  /*
   * Creates a color that corresponds to the solution's concentration.
   * @param {Solvent) solvent
   * @param {Solute} solute
   * @param {Number} concentration
   */
  ConcentrationSolution.createColor = function ( solvent, solute, concentration ) {
    var color = solvent.color.get();
    if ( concentration > 0 ) {
      color = solute.colorScheme.concentrationToColor( concentration );
    }
    return color;
  };

  return ConcentrationSolution;
} );
