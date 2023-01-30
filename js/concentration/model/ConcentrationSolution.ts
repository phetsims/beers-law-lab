// Copyright 2013-2023, University of Colorado Boulder

/**
 * Solution model for the 'Concentration' screen.
 * This screen has a single solution that is mutated by changing the solute, solute amount, and volume.
 * Concentration is derived via M=mol/L.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color } from '../../../../scenery/js/imports.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import Fluid from '../../common/model/Fluid.js';
import Solute from '../../common/model/Solute.js';
import Solvent from '../../common/model/Solvent.js';

type SelfOptions = EmptySelfOptions &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'> &
  PickRequired<PhetioObjectOptions, 'tandem'>;

type ConcentrationSolutionOptions = SelfOptions;

export default class ConcentrationSolution extends Fluid {

  public readonly solvent: Solvent;
  public readonly soluteProperty: Property<Solute>;
  public readonly soluteMolesProperty: Property<number>; // total solute, dissolved and precipitate, in mol
  public readonly volumeProperty: Property<number>; // L

  // for deferring update of precipitateAmount until we've changed both volume and soluteAmount
  // see https://github.com/phetsims/concentration/issues/1
  public updatePrecipitateAmount: boolean;

  public readonly precipitateMolesProperty: TReadOnlyProperty<number>; // mol
  public readonly concentrationProperty: TReadOnlyProperty<number>; // M
  public readonly isSaturatedProperty: TReadOnlyProperty<boolean>;
  public readonly soluteGramsProperty: TReadOnlyProperty<number>; // solute dissolved in solution, in grams
  public readonly percentConcentrationProperty: TReadOnlyProperty<number>; // [0,100]

  public constructor( soluteProperty: Property<Solute>,
                      soluteAmountRange: RangeWithValue,
                      volumeRange: RangeWithValue,
                      providedOptions: ConcentrationSolutionOptions ) {

    const options = optionize<ConcentrationSolutionOptions, SelfOptions>()( {
      phetioDocumentation: 'The solution in the beaker'
    }, providedOptions );

    const solvent = Solvent.WATER;

    super( ConcentrationSolution.createColor( solvent, soluteProperty.value, 0 ) );

    this.solvent = solvent;

    this.soluteProperty = soluteProperty;

    this.soluteMolesProperty = new NumberProperty( soluteAmountRange.defaultValue, {
      units: 'mol',
      range: soluteAmountRange,
      tandem: options.tandem.createTandem( 'soluteMolesProperty' )
    } );

    this.volumeProperty = new NumberProperty( volumeRange.defaultValue, {
      units: 'L',
      range: volumeRange,
      tandem: options.tandem.createTandem( 'volumeProperty' )
    } );

    this.updatePrecipitateAmount = true;

    this.precipitateMolesProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteMolesProperty, this.volumeProperty ],
      ( solute, soluteMoles, volume ) => {
        if ( this.updatePrecipitateAmount ) {
          return Math.max( 0, soluteMoles - ( volume * this.getSaturatedConcentration() ) );
        }
        else {
          return this.precipitateMolesProperty.value;
        }
      }, {
        tandem: options.tandem.createTandem( 'precipitateMolesProperty' ),
        units: 'mol',
        phetioValueType: NumberIO
      }
    );

    this.concentrationProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteMolesProperty, this.volumeProperty ],
      ( solute, soluteMoles, volume ) => {
        return ( volume > 0 ) ? Math.min( this.getSaturatedConcentration(), soluteMoles / volume ) : 0;
      }, {
        tandem: options.tandem.createTandem( 'concentrationProperty' ),
        units: 'mol/L',
        phetioValueType: NumberIO
      }
    );

    this.isSaturatedProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteMolesProperty, this.volumeProperty ],
      ( solute, soluteMoles, volume ) => {
        return ( volume > 0 ) && ( soluteMoles / volume ) > solute.getSaturatedConcentration();
      }, {
        tandem: options.tandem.createTandem( 'isSaturatedProperty' ),
        phetioValueType: BooleanIO
      }
    );

    this.soluteGramsProperty = new DerivedProperty(
      [ this.soluteProperty, this.soluteMolesProperty, this.precipitateMolesProperty ],
      ( solute, soluteMoles, precipitateMoles ) => {

        // Use Math.max to prevent a negative value during intermediate states.
        // See https://github.com/phetsims/beers-law-lab/issues/253
        const soluteGrams = solute.molarMass * Math.max( 0, soluteMoles - precipitateMoles );
        assert && assert( soluteGrams >= 0, `invalid soluteGrams: ${soluteGrams}` );
        return soluteGrams;
      }, {
        tandem: options.tandem.createTandem( 'soluteGramsProperty' ),
        units: 'g',
        phetioValueType: NumberIO
      }
    );

    this.percentConcentrationProperty = new DerivedProperty(
      [ this.volumeProperty, this.soluteGramsProperty ],
      ( volume, soluteGrams ) => {
        let percentConcentration = 0;
        if ( volume > 0 ) {
          const solventGrams = volume * this.solvent.density;
          percentConcentration = 100 * ( soluteGrams / ( soluteGrams + solventGrams ) );
        }
        assert && assert( percentConcentration >= 0 && percentConcentration <= 100,
          `percentConcentration out of range: ${percentConcentration}` );
        return percentConcentration;
      }, {
        tandem: options.tandem.createTandem( 'percentConcentrationProperty' ),
        phetioValueType: NumberIO,
        units: '%',
        phetioDocumentation: 'Calculated as a mass percent.'
      }
    );

    // derive the solution color
    const updateColor = () => {
      this.colorProperty.value =
        ConcentrationSolution.createColor( this.solvent, this.soluteProperty.value, this.concentrationProperty.value );
    };
    this.soluteProperty.lazyLink( updateColor );
    this.concentrationProperty.link( updateColor ); // link to force update of color
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override reset(): void {
    super.reset();
    this.soluteMolesProperty.reset();
    this.volumeProperty.reset();
  }

  public getSaturatedConcentration(): number {
    return this.soluteProperty.value.getSaturatedConcentration();
  }

  public getNumberOfPrecipitateParticles(): number {
    let numberOfParticles = Utils.roundSymmetric( this.soluteProperty.value.particlesPerMole * this.precipitateMolesProperty.value );
    if ( numberOfParticles === 0 && this.precipitateMolesProperty.value > 0 ) {
      numberOfParticles = 1;
    }
    return numberOfParticles;
  }

  /**
   * Creates a color that corresponds to the solution's concentration.
   */
  public static createColor( solvent: Solvent, solute: Solute, concentration: number ): Color {
    let color = solvent.colorProperty.value;
    if ( concentration > 0 ) {
      color = solute.colorScheme.concentrationToColor( concentration );
    }
    return color;
  }
}

beersLawLab.register( 'ConcentrationSolution', ConcentrationSolution );