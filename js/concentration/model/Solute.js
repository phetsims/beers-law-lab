// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a solute, immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import BLLSymbols from '../../common/BLLSymbols.js';
import Solvent from '../../common/model/Solvent.js';
import SoluteColorScheme from './SoluteColorScheme.js';

class Solute extends PhetioObject {

  /**
   * @param {string} name
   * @param {string} formula
   * @param {number} stockSolutionConcentration - mol/L
   * @param {number} molarMass - g/mol
   * @param {SoluteColorScheme} colorScheme
   * @param {Object} [options]
   */
  constructor( name, formula, stockSolutionConcentration, molarMass, colorScheme, options ) {

    options = merge( {
      particleColor: colorScheme.maxColor,
      particleSize: 5,
      particlesPerMole: 200,
      phetioType: Solute.SoluteIO,
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // @public - the name of the solute in tandem id format. Used to other make tandems that pertain to this solute.
    this.tandemName = options.tandem.name;

    // @public (read-only), (read-write, phet-io)
    this.name = name;
    this.formula = formula;

    // @public (read-only)
    this.stockSolutionConcentration = stockSolutionConcentration; // mol/L
    this.molarMass = molarMass; // g/mol
    this.colorScheme = colorScheme;
    this.particleColor = options.particleColor;
    this.particleSize = options.particleSize;
    this.particlesPerMole = options.particlesPerMole;

    // @public (read-only) percent concentration [0,100] of stock solution, see beers-law-lab#149
    this.stockSolutionPercentConcentration = 100 * ( molarMass * stockSolutionConcentration ) /
                                             ( Solvent.WATER.density + ( molarMass * stockSolutionConcentration ) );
    assert && assert( this.stockSolutionPercentConcentration >= 0 && this.stockSolutionPercentConcentration <= 100 );
  }

  // @public gets the saturated concentration, in mol/L
  getSaturatedConcentration() {
    return this.colorScheme.maxConcentration;
  }
}

Solute.SoluteIO = new IOType( 'SoluteIO', {
  valueType: Solute,
  supertype: ReferenceIO( IOType.ObjectIO ),
  methods: {
    setName: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: text => {
        this.name = text;
      },
      documentation: 'Set the name of the solute',
      invocableForReadOnlyElements: false
    },
    setFormula: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: text => {
        this.formula = text;
      },
      documentation: 'Set the formula of the solute',
      invocableForReadOnlyElements: false
    }
  }
} );

// Static instances

// parent tandem for all static instances of Solute
const SOLUTES_TANDEM = BLLConstants.CONCENTRATION_SCREEN_TANDEM.createTandem( 'solutes' );

Solute.DRINK_MIX = new Solute(
  beersLawLabStrings.drinkMix,
  beersLawLabStrings.drinkMix,
  5.5, // stockSolutionConcentration, mol/L
  342.296, // molarMass, g/mol (sucrose)
  new SoluteColorScheme( 0, new Color( 224, 255, 255 ), 0.05, new Color( 255, 225, 225 ), 5.96, new Color( 255, 0, 0 ) ), {
    tandem: SOLUTES_TANDEM.createTandem( 'drinkMix' )
  }
);

Solute.COBALT_II_NITRATE = new Solute(
  beersLawLabStrings.cobaltIINitrate,
  BLLSymbols.COBALT_II_NITRATE,
  5.0, // stockSolutionConcentration, mol/L
  182.942, // molarMass, g/mol
  new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 225, 225 ), 5.64, new Color( 255, 0, 0 ) ), {
    tandem: SOLUTES_TANDEM.createTandem( 'cobaltIINitrate' )
  }
);

Solute.COBALT_CHLORIDE = new Solute(
  beersLawLabStrings.cobaltChloride,
  BLLSymbols.COBALT_CHLORIDE,
  4.0, // stockSolutionConcentration, mol/L
  129.839, // molarMass, g/mol
  new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 242, 242 ), 4.33, new Color( 255, 106, 106 ) ), {
    tandem: SOLUTES_TANDEM.createTandem( 'cobaltChloride' )
  }
);

Solute.POTASSIUM_DICHROMATE = new Solute(
  beersLawLabStrings.potassiumDichromate,
  BLLSymbols.POTASSIUM_DICHROMATE,
  0.5, // stockSolutionConcentration, mol/L
  294.185, // molarMass, g/mol
  new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.01, new Color( 255, 204, 153 ), 0.51, new Color( 255, 127, 0 ) ), {
    tandem: SOLUTES_TANDEM.createTandem( 'potassiumDichromate' )
  }
);

Solute.POTASSIUM_CHROMATE = new Solute(
  beersLawLabStrings.potassiumChromate,
  BLLSymbols.POTASSIUM_CHROMATE,
  3.0, // stockSolutionConcentration, mol/L
  194.191, // molarMass, g/mol
  new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 255, 153 ), 3.35, new Color( 255, 255, 0 ) ), {
    tandem: SOLUTES_TANDEM.createTandem( 'potassiumChromate' )
  }
);

Solute.NICKEL_II_CHLORIDE = new Solute(
  beersLawLabStrings.nickelIIChloride,
  BLLSymbols.NICKEL_II_CHLORIDE,
  5.0, // stockSolutionConcentration, mol/L
  129.599, // molarMass, g/mol
  new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.2, new Color( 170, 255, 170 ), 5.21, new Color( 0, 128, 0 ) ), {
    tandem: SOLUTES_TANDEM.createTandem( 'nickelIIChloride' )
  }
);

Solute.COPPER_SULFATE = new Solute(
  beersLawLabStrings.copperSulfate,
  BLLSymbols.COPPER_SULFATE,
  1.0, // stockSolutionConcentration, mol/L
  159.609, // molarMass, g/mol
  new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.2, new Color( 200, 225, 255 ), 1.38, new Color( 30, 144, 255 ) ), {
    tandem: SOLUTES_TANDEM.createTandem( 'copperSulfate' )
  }
);

Solute.POTASSIUM_PERMANGANATE = new Solute(
  beersLawLabStrings.potassiumPermanganate,
  BLLSymbols.POTASSIUM_PERMANGANATE,
  0.4, // stockSolutionConcentration, mol/L
  158.034, // molarMass, g/mol
  new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.01, new Color( 255, 0, 255 ), 0.48, new Color( 80, 0, 120 ) ), {
    tandem: SOLUTES_TANDEM.createTandem( 'potassiumPermanganate' ),
    particleColor: Color.BLACK
  }
);

Solute.SODIUM_CHLORIDE = new Solute(
  beersLawLabStrings.sodiumChloride,
  BLLSymbols.SODIUM_CHLORIDE,
  5.50, // stockSolutionConcentration, mol/L
  58.443, // molarMass, g/mol
  new SoluteColorScheme( 0, Solvent.WATER_COLOR, 5.00, new Color( 225, 250, 250 ), 6.15, new Color( 225, 240, 240 ) ), {
    tandem: SOLUTES_TANDEM.createTandem( 'sodiumChloride' )
  }
);

beersLawLab.register( 'Solute', Solute );

export default Solute;