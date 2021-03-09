// Copyright 2013-2020, University of Colorado Boulder

/**
 * Solution model for the 'Concentration' screen.
 * This screen has a single solution that is mutated by changing the solute, solute amount, and volume.
 * Concentration is derived via M=mol/L.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import Fluid from '../../common/model/Fluid.js';
import Solvent from '../../common/model/Solvent.js';

class ConcentrationSolution extends Fluid {

  /**
   * @param {Property.<Solute>} soluteProperty
   * @param {number} soluteAmount moles
   * @param {number} volume L
   * @param {Object} [options]
   */
  constructor( soluteProperty, soluteAmount, volume, options ) {

    const solvent = Solvent.WATER; // @public (read-only)

    super( ConcentrationSolution.createColor( solvent, soluteProperty.get(), 0 ) );

    // @public (read-only)
    this.solvent = solvent;

    // @public
    this.soluteProperty = soluteProperty;

    // @public
    this.soluteAmountProperty = new NumberProperty( soluteAmount, {
      units: 'moles',
      range: BLLConstants.SOLUTE_AMOUNT_RANGE,
      tandem: options.tandem.createTandem( 'soluteAmountProperty' )
    } );

    // @public
    this.volumeProperty = new NumberProperty( volume, {
      units: 'liters', range: BLLConstants.SOLUTION_VOLUME_RANGE,
      tandem: options.tandem.createTandem( 'volumeProperty' )
    } ); // L

    // @public for deferring update of precipitateAmount until we've changed both volume and soluteAmount, see concentration#1
    this.updatePrecipitateAmount = true;

    // @public derive amount of precipitate (moles)
    this.precipitateAmountProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      ( solute, soluteAmount, volume ) => {
        if ( this.updatePrecipitateAmount ) {
          return Math.max( 0, soluteAmount - ( volume * this.getSaturatedConcentration() ) );
        }
        else {
          return this.precipitateAmountProperty.get();
        }
      }, {
        tandem: options.tandem.createTandem( 'precipitateAmountProperty' ),
        units: 'moles',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      }
    );

    // @public derive concentration (M = mol/L)
    this.concentrationProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      ( solute, soluteAmount, volume ) => {
        return ( volume > 0 ) ? Math.min( this.getSaturatedConcentration(), soluteAmount / volume ) : 0;
      }, {
        tandem: options.tandem.createTandem( 'concentrationProperty' ),
        units: 'moles/liter',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      }
    );

    // @public boolean property indicating whether the solution is saturated or not.
    this.saturatedProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      ( solute, soluteAmount, volume ) => {
        return ( volume > 0 ) && ( soluteAmount / volume ) > solute.getSaturatedConcentration();
      }, {
        tandem: options.tandem.createTandem( 'saturatedProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
      }
    );

    // @public {number} amount of solute, in grams
    this.soluteGramsProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteAmountProperty, this.precipitateAmountProperty ],
      ( solute, soluteAmount, precipitateAmount ) => {
        const soluteGrams = solute.molarMass * ( soluteAmount - precipitateAmount );
        assert && assert( soluteGrams >= 0, 'invalid soluteGrams: ' + soluteGrams );
        return soluteGrams;
      }, {
        tandem: options.tandem.createTandem( 'soluteGramsProperty' ),
        units: 'grams',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      }
    );

    // @public {number} percent concentration [0,100]
    this.percentConcentrationProperty = new DerivedProperty(
      [ this.volumeProperty, this.soluteGramsProperty ],
      ( volume, soluteGrams ) => {
        let percentConcentration = 0;
        if ( volume > 0 ) {
          const solventGrams = volume * this.solvent.density;
          percentConcentration = 100 * ( soluteGrams / ( soluteGrams + solventGrams ) );
        }
        assert && assert( percentConcentration >= 0 && percentConcentration <= 100,
          'percentConcentration out of range: ' + percentConcentration );
        return percentConcentration;
      }, {
        tandem: options.tandem.createTandem( 'percentConcentrationProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        units: 'percent'
      }
    );

    // derive the solution color
    const updateColor = () => {
      this.colorProperty.set( ConcentrationSolution.createColor( this.solvent, this.soluteProperty.get(), this.concentrationProperty.get() ) );
    };
    this.soluteProperty.lazyLink( updateColor );
    this.concentrationProperty.link( updateColor ); // link to force update of color
  }

  // @public
  reset() {
    super.reset();
    this.soluteAmountProperty.reset();
    this.volumeProperty.reset();
  }

  // @public convenience function
  getSaturatedConcentration() {
    return this.soluteProperty.get().getSaturatedConcentration();
  }

  // @public
  getNumberOfPrecipitateParticles() {
    let numberOfParticles = Utils.roundSymmetric( this.soluteProperty.get().particlesPerMole * this.precipitateAmountProperty.get() );
    if ( numberOfParticles === 0 && this.precipitateAmountProperty.get() > 0 ) {
      numberOfParticles = 1;
    }
    return numberOfParticles;
  }

  /**
   * Creates a color that corresponds to the solution's concentration.
   * @param {Solvent) solvent
   * @param {Solute} solute
   * @param {number} concentration
   * @public
   * @static
   */
  static createColor( solvent, solute, concentration ) {
    let color = solvent.colorProperty.get();
    if ( concentration > 0 ) {
      color = solute.colorScheme.concentrationToColor( concentration );
    }
    return color;
  }
}

beersLawLab.register( 'ConcentrationSolution', ConcentrationSolution );
export default ConcentrationSolution;