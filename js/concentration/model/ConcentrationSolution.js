// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solution model for the 'Concentration' screen.
 * This screen has a single solution that is mutated by changing the solute, solute amount, and volume.
 * Concentration is derived via M=mol/L.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Fluid = require( 'BEERS_LAW_LAB/common/model/Fluid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Solvent = require( 'BEERS_LAW_LAB/common/model/Solvent' );

  /**
   * @param {Property.<Solute>} solute
   * @param {number} soluteAmount moles
   * @param {NUmber} volume L
   */
  function ConcentrationSolution( solute, soluteAmount, volume ) {

    var thisSolution = this;
    Fluid.call( thisSolution, Color.WHITE ); // use a bogus initial color, so we'll need to set color properly in reset

    thisSolution.solvent = Solvent.WATER;
    thisSolution.solute = solute;
    thisSolution.soluteAmount = new Property( soluteAmount, { componentID: 'concentrationScreen.solution.soluteAmount' } );
    thisSolution.volume = new Property( volume, { componentID: 'concentrationScreen.solution.volume' } );

    // derive amount of precipitate (moles)
    thisSolution.precipitateAmount = new Property( 0, { componentID: 'concentrationScreen.solution.precipitateAmount' } );
    thisSolution.concentration = new Property( 0, { componentID: 'concentrationScreen.solution.concentration' } );
    var updatePrecipitateAmount = function() {

      var volume = thisSolution.volume.get();
      var soluteAmount = thisSolution.soluteAmount.get();

      // derive amount of precipitate (moles)
      thisSolution.precipitateAmount.set( Math.max( 0, soluteAmount - ( volume * thisSolution.getSaturatedConcentration() ) ) );

      // derive concentration (M = mol/L)
      thisSolution.concentration.set( ( volume > 0 ) ? Math.min( thisSolution.getSaturatedConcentration(), soluteAmount / volume ) : 0 );
    };
    thisSolution.solute.link( updatePrecipitateAmount );
    thisSolution.soluteAmount.link( updatePrecipitateAmount );
    thisSolution.volume.link( updatePrecipitateAmount );

    // derive the solution color
    var updateColor = function() {
      thisSolution.color.set( ConcentrationSolution.createColor( thisSolution.solvent, thisSolution.solute.get(), thisSolution.concentration.get() ) );
    };
    thisSolution.solute.link( updateColor );
    thisSolution.concentration.link( updateColor );

    // reset
    thisSolution.reset = function() {
      Fluid.prototype.reset.call( this );
      thisSolution.soluteAmount.reset();
      thisSolution.volume.reset();
      updateColor(); // because we provided a bogus initial color to Fluid constructor
    };
  }

  return inherit( Fluid, ConcentrationSolution, {

    // convenience function
    getSaturatedConcentration: function() {
      return this.solute.get().getSaturatedConcentration();
    },

    isSaturated: function() {
      var saturated = false;
      if ( this.volume.get() > 0 ) {
        saturated = ( this.soluteAmount.get() / this.volume.get() ) > this.getSaturatedConcentration();
      }
      return saturated;
    },

    getNumberOfPrecipitateParticles: function() {
      var numberOfParticles = Math.round( this.solute.get().particlesPerMole * this.precipitateAmount.get() );
      if ( numberOfParticles === 0 && this.precipitateAmount.get() > 0 ) {
        numberOfParticles = 1;
      }
      return numberOfParticles;
    }
  }, {
    // static

    /*
     * Creates a color that corresponds to the solution's concentration.
     * @param {Solvent) solvent
     * @param {Solute} solute
     * @param {number} concentration
     */
    createColor: function( solvent, solute, concentration ) {
      var color = solvent.color.get();
      if ( concentration > 0 ) {
        color = solute.colorScheme.concentrationToColor( concentration );
      }
      return color;
    }
  } );
} );
