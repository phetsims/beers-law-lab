// Copyright 2002-2013, University of Colorado

/**
 * Solution model for the "Concentration" module.
 * This module has a single solution that is mutated by changing the solute, solute amount, and volume.
 * Concentration is derived via M=mol/L.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var callSuper = require( "PHET_CORE/callSuper" );
  var Color = require( "SCENERY/util/Color" );
  var Fluid = require( "common/model/Fluid" );
  var inherit = require( "PHET_CORE/inherit" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Solvent = require( "common/model/Solvent" );

  /**
   * @param {Property<Solute>} solute
   * @param {Number} soluteAmount moles
   * @param {NUmber} volume L
   */
  function ConcentrationSolution( solute, soluteAmount, volume ) {

    var thisSolution = this;
    Fluid.call( thisSolution, Color.WHITE ); // use a bogus initial color, so we'll need to set color properly in reset

    thisSolution.solvent = Solvent.WATER;
    thisSolution.solute = solute;
    thisSolution.soluteAmount = new Property( soluteAmount );
    thisSolution.volume = new Property( volume );

    // derive amount of precipitate (moles)
    thisSolution.precipitateAmount = new Property( 0 );
    thisSolution.concentration = new Property( 0 );
    var updatePrecipitateAmount = function() {

      // derive amount of precipitate (moles)
      var volume = thisSolution.volume.get();
      if ( volume > 0 ) {
        thisSolution.precipitateAmount.set( Math.max( 0, volume * ( ( thisSolution.soluteAmount.get() / volume ) - thisSolution.getSaturatedConcentration() ) ) );
      }
      else {
        thisSolution.precipitateAmount.set( thisSolution.soluteAmount.get() );
      }

      // derive concentration (M)
      var soluteAmount = thisSolution.soluteAmount.get();
      var concentration = ( volume > 0 ) ? Math.min( thisSolution.getSaturatedConcentration(), soluteAmount / volume ) : 0; // M = mol/L
      thisSolution.concentration.set( concentration );
    };
    thisSolution.solute.addObserver( updatePrecipitateAmount );
    thisSolution.soluteAmount.addObserver( updatePrecipitateAmount );
    thisSolution.volume.addObserver( updatePrecipitateAmount );

    // derive the solution color
    var updateColor = function() {
      thisSolution.color.set( ConcentrationSolution.createColor( thisSolution.solvent, thisSolution.solute.get(), thisSolution.concentration.get() ) );
    };
    thisSolution.solute.addObserver( updateColor );
    thisSolution.concentration.addObserver( updateColor );

    // reset
    thisSolution.reset = function() {
      callSuper( Fluid, "reset", this );
      thisSolution.soluteAmount.reset();
      thisSolution.volume.reset();
      updateColor(); // because we provided a bogus initial color to Fluid constructor
    };
  }

  inherit( ConcentrationSolution, Fluid );

  // convenience function
  ConcentrationSolution.prototype.getSaturatedConcentration = function() {
    return this.solute.get().getSaturatedConcentration();
  };

  ConcentrationSolution.prototype.isSaturated = function() {
    var saturated = false;
    if ( this.volume.get() > 0 ) {
      saturated = ( this.soluteAmount.get() / this.volume.get() ) > this.getSaturatedConcentration();
    }
    return saturated;
  };

  ConcentrationSolution.prototype.getNumberOfPrecipitateParticles = function() {
    var numberOfParticles = Math.round( this.solute.get().particlesPerMole * this.precipitateAmount.get() );
    if ( numberOfParticles === 0 && this.precipitateAmount.get() > 0 ) {
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
  ConcentrationSolution.createColor = function( solvent, solute, concentration ) {
    var color = solvent.color.get();
    if ( concentration > 0 ) {
      color = solute.colorScheme.concentrationToColor( concentration );
    }
    return color;
  };

  return ConcentrationSolution;
} );
