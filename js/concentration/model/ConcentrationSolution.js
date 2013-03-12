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
     * @param {Property(Solute)} soluteProperty
     * @param {Number} soluteAmount moles
     * @param {NUmber} volume L
     */
    function ConcentrationSolution( soluteProperty, soluteAmount, volume ) {

      Fluid.call( this, Color.WHITE ); // constructor stealing

      var solution = this;

      solution.solvent = Solvent.WATER;
      solution.soluteProperty = soluteProperty;
      solution.soluteAmountProperty = new Property( soluteAmount );
      solution.volumeProperty = new Property( volume );

      // derive concentration (M)
      {
        var computeConcentration = function () {
          var volume = solution.volumeProperty.get();
          var soluteAmount = solution.soluteAmountProperty.get();
          if ( volume > 0 ) {
            return Math.min( solution.getSaturatedConcentration(), soluteAmount / volume ); // M = mol/L
          }
          else {
            return 0;
          }
        };
        solution.concentrationProperty = new Property( computeConcentration() );
        solution.soluteProperty.addObserver( computeConcentration );
        solution.soluteAmountProperty.addObserver( computeConcentration );
        solution.volumeProperty.addObserver( computeConcentration );
      }

      // derive amount of precipitate (moles)
      {
        var computePrecipitateAmount = function () {
          var volume = solution.volumeProperty.get();
          var soluteAmount = solution.soluteAmountProperty.get();
          if ( volume > 0 ) {
            return Math.max( 0, volume * ( ( solution.soluteAmountProperty.get() / volume ) - solution.getSaturatedConcentration() ) );
          }
          else {
            return soluteAmount;
          }
        };
        solution.precipitateAmountProperty = new Property( computePrecipitateAmount() );
        solution.soluteProperty.addObserver( computePrecipitateAmount );
        solution.soluteAmountProperty.addObserver( computePrecipitateAmount );
        solution.volumeProperty.addObserver( computePrecipitateAmount );
      }

      // derive the solution color
      {
        var colorObserver = function() {
          solution.colorProperty.set( ConcentrationSolution.createColor( solution.solvent, solution.soluteProperty.get(), solution.concentrationProperty.get() ) );
        }
        solution.soluteProperty.addObserver( colorObserver );
        solution.concentrationProperty.addObserver( colorObserver );
      }

      // reset
      solution.reset = function () {
        Inheritance.callSuper( Fluid, "reset", this );
        solution.soluteAmountProperty.reset();
        solution.volumeProperty.reset();
      }
    }

    Inheritance.inheritPrototype( ConcentrationSolution, Fluid ); // prototype chaining

    // convenience function
    ConcentrationSolution.prototype.getSaturatedConcentration = function () {
      return this.soluteProperty.get().getSaturatedConcentration();
    };

    ConcentrationSolution.prototype.isSaturated = function() {
      var solution = this;
      var saturated = false;
      if ( solution.volumeProperty.get() > 0 ) {
        saturated = ( solution.soluteAmountProperty.get() / solution.volumeProperty.get() ) > solution.getSaturatedConcentration();
      }
      return saturated;
    };

    ConcentrationSolution.prototype.getNumberOfPrecipitateParticles = function () {
      var solution = this;
      var numberOfParticles = (int)( solution.soluteProperty.get().particlesPerMole * precipitateAmount.get() );
      if ( numberOfParticles == 0 && solution.precipitateAmountProperty.get() > 0 ) {
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
      var color = solvent.color;
      if ( concentration > 0 ) {
        color = solute.colorScheme.get().concentrationToColor( concentration );
      }
      return color;
    };

    return ConcentrationSolution;
  }
);
