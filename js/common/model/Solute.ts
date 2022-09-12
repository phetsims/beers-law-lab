// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model of a solute, immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import SoluteColorScheme from '../../concentration/model/SoluteColorScheme.js';
import BLLSymbols from '../BLLSymbols.js';
import Solvent from './Solvent.js';

// parent tandem for all static instances of Solute
const SOLUTES_TANDEM = Tandem.GLOBAL_MODEL.createTandem( 'solutes' );

type SelfOptions = {

  // required
  name: string;
  stockSolutionConcentration: number; // mol/L
  molarMass: number; // g/mol
  colorScheme: SoluteColorScheme;

  // optional
  formula?: string | null; // null or empty string defaults to nameProperty
  particleColor?: Color;
  particleSize?: number; // cm
  particlesPerMole?: number;
};

type SoluteOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Solute extends PhetioObject {

  // the solute's tandem name, used to create other tandems that pertain to this solute
  public readonly tandemName: string;

  // Added for PhET-iO, see https://github.com/phetsims/beers-law-lab/issues/272
  public readonly nameProperty: Property<string>;

  // Added for PhET-iO, see https://github.com/phetsims/beers-law-lab/issues/272
  public readonly formulaProperty: Property<string | null>;

  public readonly stockSolutionConcentration: number; // mol/L
  public readonly molarMass: number; // g/mol
  public readonly colorScheme: SoluteColorScheme;
  public readonly particleColor: Color;
  public readonly particleSize: number;
  public readonly particlesPerMole: number;

  // percent concentration [0,100] of stock solution, see https://github.com/phetsims/beers-law-lab/issues/149
  public readonly stockSolutionPercentConcentration: number;

  public constructor( providedOptions: SoluteOptions ) {

    const options = optionize<SoluteOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      formula: null,
      particleColor: providedOptions.colorScheme.maxColor,
      particleSize: 5, // cm
      particlesPerMole: 200,

      // PhetioObjectOptions
      phetioType: Solute.SoluteIO,
      phetioState: false // because SoluteIO extends ReferenceIO
    }, providedOptions );

    super( options );

    this.tandemName = options.tandem.name;

    this.nameProperty = new StringProperty( options.name, {
      tandem: options.tandem.createTandem( 'nameProperty' ),
      phetioDocumentation: 'The solute name. Changing it here will change it everywhere in the user interface.'
    } );

    this.formulaProperty = new Property( options.formula, {
      tandem: options.tandem.createTandem( 'formulaProperty' ),
      phetioValueType: NullableIO( StringIO ),
      phetioDocumentation:
        'The solute formula, using RichText markup. Changing it here will change it everywhere in ' +
        'the user interface. A null value will cause the formula to default to the value of nameProperty.'
    } );

    this.stockSolutionConcentration = options.stockSolutionConcentration;
    this.molarMass = options.molarMass;
    this.colorScheme = options.colorScheme;
    this.particleColor = options.particleColor;
    this.particleSize = options.particleSize;
    this.particlesPerMole = options.particlesPerMole;

    this.stockSolutionPercentConcentration =
      100 * ( options.molarMass * options.stockSolutionConcentration ) /
      ( Solvent.WATER.density + ( options.molarMass * options.stockSolutionConcentration ) );
    assert && assert( this.stockSolutionPercentConcentration >= 0 && this.stockSolutionPercentConcentration <= 100 );
  }

  /**
   * Gets the saturated concentration, in mol/L.
   */
  public getSaturatedConcentration(): number {
    return this.colorScheme.maxConcentration;
  }

  public static readonly DRINK_MIX = new Solute( {
    name: BeersLawLabStrings.drinkMix,
    stockSolutionConcentration: 5.5,
    molarMass: 342.296, // sucrose
    colorScheme: new SoluteColorScheme( 0, new Color( 224, 255, 255 ), 0.05, new Color( 255, 225, 225 ), 5.96, new Color( 255, 0, 0 ) ),
    tandem: SOLUTES_TANDEM.createTandem( 'drinkMix' )
  } );

  public static readonly COBALT_II_NITRATE = new Solute( {
    name: BeersLawLabStrings.cobaltIINitrate,
    formula: BLLSymbols.COBALT_II_NITRATE,
    stockSolutionConcentration: 5.0,
    molarMass: 182.942,
    colorScheme: new SoluteColorScheme( 0, Solvent.WATER.colorProperty.value, 0.05, new Color( 255, 225, 225 ), 5.64, new Color( 255, 0, 0 ) ),
    tandem: SOLUTES_TANDEM.createTandem( 'cobaltIINitrate' )
  } );

  public static readonly COBALT_CHLORIDE = new Solute( {
    name: BeersLawLabStrings.cobaltChloride,
    formula: BLLSymbols.COBALT_CHLORIDE,
    stockSolutionConcentration: 4.0,
    molarMass: 129.839,
    colorScheme: new SoluteColorScheme( 0, Solvent.WATER.colorProperty.value, 0.05, new Color( 255, 242, 242 ), 4.33, new Color( 255, 106, 106 ) ),
    tandem: SOLUTES_TANDEM.createTandem( 'cobaltChloride' )
  } );

  public static readonly POTASSIUM_DICHROMATE = new Solute( {
    name: BeersLawLabStrings.potassiumDichromate,
    formula: BLLSymbols.POTASSIUM_DICHROMATE,
    stockSolutionConcentration: 0.5,
    molarMass: 294.185,
    colorScheme: new SoluteColorScheme( 0, Solvent.WATER.colorProperty.value, 0.01, new Color( 255, 204, 153 ), 0.51, new Color( 255, 127, 0 ) ),
    tandem: SOLUTES_TANDEM.createTandem( 'potassiumDichromate' )
  } );

  public static readonly POTASSIUM_CHROMATE = new Solute( {
    name: BeersLawLabStrings.potassiumChromate,
    formula: BLLSymbols.POTASSIUM_CHROMATE,
    stockSolutionConcentration: 3.0,
    molarMass: 194.191,
    colorScheme: new SoluteColorScheme( 0, Solvent.WATER.colorProperty.value, 0.05, new Color( 255, 255, 153 ), 3.35, new Color( 255, 255, 0 ) ),
    tandem: SOLUTES_TANDEM.createTandem( 'potassiumChromate' )
  } );

  public static readonly NICKEL_II_CHLORIDE = new Solute( {
    name: BeersLawLabStrings.nickelIIChloride,
    formula: BLLSymbols.NICKEL_II_CHLORIDE,
    stockSolutionConcentration: 5.0,
    molarMass: 129.599,
    colorScheme: new SoluteColorScheme( 0, Solvent.WATER.colorProperty.value, 0.2, new Color( 170, 255, 170 ), 5.21, new Color( 0, 128, 0 ) ),
    tandem: SOLUTES_TANDEM.createTandem( 'nickelIIChloride' )
  } );

  public static readonly COPPER_SULFATE = new Solute( {
    name: BeersLawLabStrings.copperSulfate,
    formula: BLLSymbols.COPPER_SULFATE,
    stockSolutionConcentration: 1.0,
    molarMass: 159.609,
    colorScheme: new SoluteColorScheme( 0, Solvent.WATER.colorProperty.value, 0.2, new Color( 200, 225, 255 ), 1.38, new Color( 30, 144, 255 ) ),
    tandem: SOLUTES_TANDEM.createTandem( 'copperSulfate' )
  } );

  public static readonly POTASSIUM_PERMANGANATE = new Solute( {
    name: BeersLawLabStrings.potassiumPermanganate,
    formula: BLLSymbols.POTASSIUM_PERMANGANATE,
    stockSolutionConcentration: 0.4,
    molarMass: 158.034,
    colorScheme: new SoluteColorScheme( 0, Solvent.WATER.colorProperty.value, 0.01, new Color( 255, 0, 255 ), 0.48, new Color( 80, 0, 120 ) ),
    tandem: SOLUTES_TANDEM.createTandem( 'potassiumPermanganate' ),
    particleColor: Color.BLACK
  } );

  public static readonly SODIUM_CHLORIDE = new Solute( {
    name: BeersLawLabStrings.sodiumChloride,
    formula: BLLSymbols.SODIUM_CHLORIDE,
    stockSolutionConcentration: 5.50,
    molarMass: 58.443,
    colorScheme: new SoluteColorScheme( 0, Solvent.WATER.colorProperty.value, 5.00, new Color( 225, 250, 250 ), 6.15, new Color( 225, 240, 240 ) ),
    tandem: SOLUTES_TANDEM.createTandem( 'sodiumChloride' )
  } );

  /**
   * SoluteIO handles PhET-iO serialization of Solute. Since all Solutes are static instances, it implements
   * 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  //TODO https://github.com/phetsims/beers-law-lab/issues/287 does IOType need generic params?
  public static readonly SoluteIO = new IOType( 'SoluteIO', {
    valueType: Solute,
    supertype: ReferenceIO( IOType.ObjectIO ),
    documentation: 'A solute in the Concentration screen'
  } );
}

beersLawLab.register( 'Solute', Solute );