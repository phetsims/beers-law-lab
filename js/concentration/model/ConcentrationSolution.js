// Copyright 2002-2013, University of Colorado

/**
* Solution model for the "Concentration" module.
* This module has a single solution that is mutated by changing the solute, solute amount, and volume.
* Concentration is derived via M=mol/L.
*
* @author Chris Malley (cmalley@pixelzoom.com)
*/
define(
  [
    "PHETCOMMON/util/Inheritance",
    "PHETCOMMON/model/property/Property",
    "common/model/Color",
    "common/model/Solvent",
    "common/model/Fluid"
  ],
  function( Inheritance, Property, Color, Solvent, Fluid ) {
    "use strict";

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
      {
        var computeConcentration = function () {
          var volume = solution.volume.get();
          var soluteAmount = solution.soluteAmount.get();
          if ( volume > 0 ) {
            return Math.min( solution.getSaturatedConcentration(), soluteAmount / volume ); // M = mol/L
          }
          else {
            return 0;
          }
        };
        solution.concentration = new Property( computeConcentration() );
        solution.solute.addObserver( computeConcentration );
        solution.soluteAmount.addObserver( computeConcentration );
        solution.volume.addObserver( computeConcentration );
      }

      // derive amount of precipitate (moles)
      {
        var computePrecipitateAmount = function () {
          var volume = solution.volume.get();
          var soluteAmount = solution.soluteAmount.get();
          if ( volume > 0 ) {
            return Math.max( 0, volume * ( ( solution.soluteAmount.get() / volume ) - solution.getSaturatedConcentration() ) );
          }
          else {
            return soluteAmount;
          }
        };
        solution.precipitateAmount = new Property( computePrecipitateAmount() );
        solution.solute.addObserver( computePrecipitateAmount );
        solution.soluteAmount.addObserver( computePrecipitateAmount );
        solution.volume.addObserver( computePrecipitateAmount );
      }

      // derive the solution color
      {
        var colorObserver = function() {
          solution.color.set( ConcentrationSolution.createColor( solution.solvent, solution.solute.get(), solution.concentration.get() ) );
        }
        solution.solute.addObserver( colorObserver );
        solution.concentration.addObserver( colorObserver );
      }

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

    ConcentrationSolution.prototype.isSaturated = function() {
      var solution = this;
      var saturated = false;
      if ( solution.volume.get() > 0 ) {
        saturated = ( solution.soluteAmount.get() / solution.volume.get() ) > solution.getSaturatedConcentration();
      }
      return saturated;
    };

    ConcentrationSolution.prototype.getNumberOfPrecipitateParticles = function () {
      var solution = this;
      var numberOfParticles = (int)( solution.solute.get().particlesPerMole * precipitateAmount.get() );
      if ( numberOfParticles == 0 && solution.precipitateAmount.get() > 0 ) {
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
  }
);
