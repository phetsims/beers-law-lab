// Copyright 2013-2021, University of Colorado Boulder

/**
 * Model of a solute, immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import SoluteColorScheme from '../../concentration/model/SoluteColorScheme.js';
import BLLSymbols from '../BLLSymbols.js';
import Solvent from './Solvent.js';

class Solute extends PhetioObject {

  /**
   * @param {Object} config
   */
  constructor( config ) {

    config = merge( {

      // required
      name: required( config.name ), // {string}
      stockSolutionConcentration: required( config.stockSolutionConcentration ), // {number} mol/L
      molarMass: required( config.molarMass ), // {number} g/mol
      colorScheme: required( config.colorScheme ), // {SoluteColorScheme}

      // options
      formula: null, // {string|null} null or empty string defaults to nameProperty
      particleColor: config.colorScheme.maxColor,
      particleSize: 5, // cm
      particlesPerMole: 200,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: Solute.SoluteIO
    }, config );

    super( config );

    // @public - the name of the solute in tandem id format. Used to other make tandems that pertain to this solute.
    this.tandemName = config.tandem.name;

    // @public Added for PhET-iO, see https://github.com/phetsims/beers-law-lab/issues/272
    this.nameProperty = new StringProperty( config.name, {
      tandem: config.tandem.createTandem( 'nameProperty' ),
      phetioDocumentation: 'The solute name. Changing it here will change it everywhere in the user interface.'
    } );

    // @public Added for PhET-iO, see https://github.com/phetsims/beers-law-lab/issues/272
    this.formulaProperty = new Property( config.formula, {
      tandem: config.tandem.createTandem( 'formulaProperty' ),
      phetioType: Property.PropertyIO( NullableIO( StringIO ) ),
      phetioDocumentation:
        'The solute formula, using RichText markup. Changing it here will change it everywhere in ' +
        'the user interface. A null value will cause the formula to default to the value of nameProperty.'
    } );

    // @public (read-only)
    this.stockSolutionConcentration = config.stockSolutionConcentration; // mol/L
    this.molarMass = config.molarMass; // g/mol
    this.colorScheme = config.colorScheme;
    this.particleColor = config.particleColor;
    this.particleSize = config.particleSize;
    this.particlesPerMole = config.particlesPerMole;

    // @public (read-only) percent concentration [0,100] of stock solution, see beers-law-lab#149
    this.stockSolutionPercentConcentration =
      100 * ( config.molarMass * config.stockSolutionConcentration ) /
      ( Solvent.WATER.density + ( config.molarMass * config.stockSolutionConcentration ) );
    assert && assert( this.stockSolutionPercentConcentration >= 0 && this.stockSolutionPercentConcentration <= 100 );
  }

  /**
   * Gets the saturated concentration, in mol/L
   * @returns {number}
   * @public
   */
  getSaturatedConcentration() {
    return this.colorScheme.maxConcentration;
  }
}

/**
 * SoluteIO handles PhET-iO serialization of Solute. Since all Solutes are static instances, it implements
 * 'Reference type serialization', as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 * @public
 */
Solute.SoluteIO = new IOType( 'SoluteIO', {
  valueType: Solute,
  supertype: ReferenceIO( IOType.ObjectIO ),
  documentation: 'A solute in the Concentration screen'
} );

// Static instances

// parent tandem for all static instances of Solute
const SOLUTES_TANDEM = Tandem.GLOBAL_MODEL.createTandem( 'solutes' );

Solute.DRINK_MIX = new Solute( {
  name: beersLawLabStrings.drinkMix,
  stockSolutionConcentration: 5.5,
  molarMass: 342.296, // sucrose
  colorScheme: new SoluteColorScheme( 0, new Color( 224, 255, 255 ), 0.05, new Color( 255, 225, 225 ), 5.96, new Color( 255, 0, 0 ) ),
  tandem: SOLUTES_TANDEM.createTandem( 'drinkMix' )
} );

Solute.COBALT_II_NITRATE = new Solute( {
  name: beersLawLabStrings.cobaltIINitrate,
  formula: BLLSymbols.COBALT_II_NITRATE,
  stockSolutionConcentration: 5.0,
  molarMass: 182.942,
  colorScheme: new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 225, 225 ), 5.64, new Color( 255, 0, 0 ) ),
  tandem: SOLUTES_TANDEM.createTandem( 'cobaltIINitrate' )
} );

Solute.COBALT_CHLORIDE = new Solute( {
  name: beersLawLabStrings.cobaltChloride,
  formula: BLLSymbols.COBALT_CHLORIDE,
  stockSolutionConcentration: 4.0,
  molarMass: 129.839,
  colorScheme: new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 242, 242 ), 4.33, new Color( 255, 106, 106 ) ),
  tandem: SOLUTES_TANDEM.createTandem( 'cobaltChloride' )
} );

Solute.POTASSIUM_DICHROMATE = new Solute( {
  name: beersLawLabStrings.potassiumDichromate,
  formula: BLLSymbols.POTASSIUM_DICHROMATE,
  stockSolutionConcentration: 0.5,
  molarMass: 294.185,
  colorScheme: new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.01, new Color( 255, 204, 153 ), 0.51, new Color( 255, 127, 0 ) ),
  tandem: SOLUTES_TANDEM.createTandem( 'potassiumDichromate' )
} );

Solute.POTASSIUM_CHROMATE = new Solute( {
  name: beersLawLabStrings.potassiumChromate,
  formula: BLLSymbols.POTASSIUM_CHROMATE,
  stockSolutionConcentration: 3.0,
  molarMass: 194.191,
  colorScheme: new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 255, 153 ), 3.35, new Color( 255, 255, 0 ) ),
  tandem: SOLUTES_TANDEM.createTandem( 'potassiumChromate' )
} );

Solute.NICKEL_II_CHLORIDE = new Solute( {
  name: beersLawLabStrings.nickelIIChloride,
  formula: BLLSymbols.NICKEL_II_CHLORIDE,
  stockSolutionConcentration: 5.0,
  molarMass: 129.599,
  colorScheme: new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.2, new Color( 170, 255, 170 ), 5.21, new Color( 0, 128, 0 ) ),
  tandem: SOLUTES_TANDEM.createTandem( 'nickelIIChloride' )
} );

Solute.COPPER_SULFATE = new Solute( {
  name: beersLawLabStrings.copperSulfate,
  formula: BLLSymbols.COPPER_SULFATE,
  stockSolutionConcentration: 1.0,
  molarMass: 159.609,
  colorScheme: new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.2, new Color( 200, 225, 255 ), 1.38, new Color( 30, 144, 255 ) ),
  tandem: SOLUTES_TANDEM.createTandem( 'copperSulfate' )
} );

Solute.POTASSIUM_PERMANGANATE = new Solute( {
  name: beersLawLabStrings.potassiumPermanganate,
  formula: BLLSymbols.POTASSIUM_PERMANGANATE,
  stockSolutionConcentration: 0.4,
  molarMass: 158.034,
  colorScheme: new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.01, new Color( 255, 0, 255 ), 0.48, new Color( 80, 0, 120 ) ),
  tandem: SOLUTES_TANDEM.createTandem( 'potassiumPermanganate' ),
  particleColor: Color.BLACK
} );

Solute.SODIUM_CHLORIDE = new Solute( {
  name: beersLawLabStrings.sodiumChloride,
  formula: BLLSymbols.SODIUM_CHLORIDE,
  stockSolutionConcentration: 5.50,
  molarMass: 58.443,
  colorScheme: new SoluteColorScheme( 0, Solvent.WATER_COLOR, 5.00, new Color( 225, 250, 250 ), 6.15, new Color( 225, 240, 240 ) ),
  tandem: SOLUTES_TANDEM.createTandem( 'sodiumChloride' )
} );

beersLawLab.register( 'Solute', Solute );
export default Solute;