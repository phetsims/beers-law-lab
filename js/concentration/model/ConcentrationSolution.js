// Copyright 2013-2019, University of Colorado Boulder

/**
 * Solution model for the 'Concentration' screen.
 * This screen has a single solution that is mutated by changing the solute, solute amount, and volume.
 * Concentration is derived via M=mol/L.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  const BooleanIO = require( 'TANDEM/types/BooleanIO' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const Fluid = require( 'BEERS_LAW_LAB/common/model/Fluid' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Solvent = require( 'BEERS_LAW_LAB/common/model/Solvent' );
  const Utils = require( 'DOT/Utils' );

  /**
   * @param {Property.<Solute>} soluteProperty
   * @param {number} soluteAmount moles
   * @param {number} volume L
   * @param {Tandem} tandem
   * @constructor
   */
  function ConcentrationSolution( soluteProperty, soluteAmount, volume, tandem ) {

    const self = this;

    this.solvent = Solvent.WATER; // @public (read-only)

    // @public
    this.soluteProperty = soluteProperty;
    this.soluteAmountProperty = new NumberProperty( soluteAmount, {
      units: 'moles',
      range: BLLConstants.SOLUTE_AMOUNT_RANGE,
      tandem: tandem.createTandem( 'soluteAmountProperty' )
    } );
    this.volumeProperty = new NumberProperty( volume, {
      units: 'liters', range: BLLConstants.SOLUTION_VOLUME_RANGE,
      tandem: tandem.createTandem( 'volumeProperty' )
    } ); // L

    // @public for deferring update of precipitateAmount until we've changed both volume and soluteAmount, see concentration#1
    this.updatePrecipitateAmount = true;

    // @public derive amount of precipitate (moles)
    this.precipitateAmountProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      function( solute, soluteAmount, volume ) {
        if ( self.updatePrecipitateAmount ) {
          return Math.max( 0, soluteAmount - ( volume * self.getSaturatedConcentration() ) );
        }
        else {
          return self.precipitateAmountProperty.get();
        }
      }, {
        tandem: tandem.createTandem( 'precipitateAmountProperty' ),
        units: 'moles',
        phetioType: DerivedPropertyIO( NumberIO )
      }
    );

    // @public derive concentration (M = mol/L)
    this.concentrationProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      function( solute, soluteAmount, volume ) {
        return ( volume > 0 ) ? Math.min( self.getSaturatedConcentration(), soluteAmount / volume ) : 0;
      }, {
        tandem: tandem.createTandem( 'concentrationProperty' ),
        units: 'moles/liter',
        phetioType: DerivedPropertyIO( NumberIO )
      }
    );

    // @public boolean property indicating whether the solution is saturated or not.
    this.saturatedProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      function( solute, soluteAmount, volume ) {
        return ( volume > 0 ) && ( soluteAmount / volume ) > solute.getSaturatedConcentration();
      }, {
        tandem: tandem.createTandem( 'saturatedProperty' ),
        phetioType: DerivedPropertyIO( BooleanIO )
      }
    );

    // @public {number} amount of solute, in grams
    this.soluteGramsProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteAmountProperty, this.precipitateAmountProperty ],
      function( solute, soluteAmount, precipitateAmount ) {
        const soluteGrams = solute.molarMass * ( soluteAmount - precipitateAmount );
        assert && assert( soluteGrams >= 0, 'invalid soluteGrams: ' + soluteGrams );
        return soluteGrams;
      }, {
        tandem: tandem.createTandem( 'soluteGramsProperty' ),
        units: 'grams',
        phetioType: DerivedPropertyIO( NumberIO )
      }
    );

    // @public {number} percent concentration [0,100]
    this.percentConcentrationProperty = new DerivedProperty(
      [ this.volumeProperty, this.soluteGramsProperty ],
      function( volume, soluteGrams ) {
        let percentConcentration = 0;
        if ( volume > 0 ) {
          const solventGrams = volume * self.solvent.density;
          percentConcentration = 100 * ( soluteGrams / ( soluteGrams + solventGrams ) );
        }
        assert && assert( percentConcentration >= 0 && percentConcentration <= 100,
          'percentConcentration out of range: ' + percentConcentration );
        return percentConcentration;
      }, {
        tandem: tandem.createTandem( 'percentConcentrationProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'percent'
      }
    );

    Fluid.call( this, ConcentrationSolution.createColor( this.solvent, this.soluteProperty.get(), this.concentrationProperty.get() ) );

    // derive the solution color
    const updateColor = function() {
      self.colorProperty.set( ConcentrationSolution.createColor( self.solvent, self.soluteProperty.get(), self.concentrationProperty.get() ) );
    };
    this.soluteProperty.lazyLink( updateColor );
    this.concentrationProperty.lazyLink( updateColor );
  }

  beersLawLab.register( 'ConcentrationSolution', ConcentrationSolution );

  return inherit( Fluid, ConcentrationSolution, {

    // @public
    reset: function() {
      Fluid.prototype.reset.call( this );
      this.soluteAmountProperty.reset();
      this.volumeProperty.reset();
    },

    // @public convenience function
    getSaturatedConcentration: function() {
      return this.soluteProperty.get().getSaturatedConcentration();
    },

    // @public
    getNumberOfPrecipitateParticles: function() {
      let numberOfParticles = Utils.roundSymmetric( this.soluteProperty.get().particlesPerMole * this.precipitateAmountProperty.get() );
      if ( numberOfParticles === 0 && this.precipitateAmountProperty.get() > 0 ) {
        numberOfParticles = 1;
      }
      return numberOfParticles;
    }
  }, {

    /*
     * Creates a color that corresponds to the solution's concentration.
     * @param {Solvent) solvent
     * @param {Solute} solute
     * @param {number} concentration
     * @static
     */
    createColor: function( solvent, solute, concentration ) {
      let color = solvent.colorProperty.get();
      if ( concentration > 0 ) {
        color = solute.colorScheme.concentrationToColor( concentration );
      }
      return color;
    }
  } );
} );
