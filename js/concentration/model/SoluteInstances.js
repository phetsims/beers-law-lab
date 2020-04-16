// Copyright 2020, University of Colorado Boulder

/**
 * SoluteInstances defines a set of Solute instances that are used in the Concentration screen.
 * These must be in their own .js file (versus in Solute.js) to avoid the cyclic dependency between
 * Solute and SoluteIO.
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Color from '../../../../scenery/js/util/Color.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import BLLSymbols from '../../common/BLLSymbols.js';
import Solvent from '../../common/model/Solvent.js';
import Solute from './Solute.js';
import SoluteColorScheme from './SoluteColorScheme.js';

// A new tandem instance is required here since the solutes are created statically. Signify that these solutes are
// only used in the concentration screen by attaching them to that screen's tandem.
const SOLUTES_TANDEM = BLLConstants.CONCENTRATION_SCREEN_TANDEM.createTandem( 'solutes' );

const SoluteInstances = {

  DRINK_MIX: new Solute(
    beersLawLabStrings.drinkMix,
    beersLawLabStrings.drinkMix,
    5.5, // stockSolutionConcentration, mol/L
    342.296, // molarMass, g/mol (sucrose)
    new SoluteColorScheme( 0, new Color( 224, 255, 255 ), 0.05, new Color( 255, 225, 225 ), 5.96, new Color( 255, 0, 0 ) ), {
      tandem: SOLUTES_TANDEM.createTandem( 'drinkMix' )
    }
  ),

  COBALT_II_NITRATE: new Solute(
    beersLawLabStrings.cobaltIINitrate,
    BLLSymbols.COBALT_II_NITRATE,
    5.0, // stockSolutionConcentration, mol/L
    182.942, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 225, 225 ), 5.64, new Color( 255, 0, 0 ) ), {
      tandem: SOLUTES_TANDEM.createTandem( 'cobaltIINitrate' )
    }
  ),

  COBALT_CHLORIDE: new Solute(
    beersLawLabStrings.cobaltChloride,
    BLLSymbols.COBALT_CHLORIDE,
    4.0, // stockSolutionConcentration, mol/L
    129.839, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 242, 242 ), 4.33, new Color( 255, 106, 106 ) ), {
      tandem: SOLUTES_TANDEM.createTandem( 'cobaltChloride' )
    }
  ),

  POTASSIUM_DICHROMATE: new Solute(
    beersLawLabStrings.potassiumDichromate,
    BLLSymbols.POTASSIUM_DICHROMATE,
    0.5, // stockSolutionConcentration, mol/L
    294.185, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.01, new Color( 255, 204, 153 ), 0.51, new Color( 255, 127, 0 ) ), {
      tandem: SOLUTES_TANDEM.createTandem( 'potassiumDichromate' )
    }
  ),

  POTASSIUM_CHROMATE: new Solute(
    beersLawLabStrings.potassiumChromate,
    BLLSymbols.POTASSIUM_CHROMATE,
    3.0, // stockSolutionConcentration, mol/L
    194.191, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.05, new Color( 255, 255, 153 ), 3.35, new Color( 255, 255, 0 ) ), {
      tandem: SOLUTES_TANDEM.createTandem( 'potassiumChromate' )
    }
  ),

  NICKEL_II_CHLORIDE: new Solute(
    beersLawLabStrings.nickelIIChloride,
    BLLSymbols.NICKEL_II_CHLORIDE,
    5.0, // stockSolutionConcentration, mol/L
    129.599, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.2, new Color( 170, 255, 170 ), 5.21, new Color( 0, 128, 0 ) ), {
      tandem: SOLUTES_TANDEM.createTandem( 'nickelIIChloride' )
    }
  ),

  COPPER_SULFATE: new Solute(
    beersLawLabStrings.copperSulfate,
    BLLSymbols.COPPER_SULFATE,
    1.0, // stockSolutionConcentration, mol/L
    159.609, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.2, new Color( 200, 225, 255 ), 1.38, new Color( 30, 144, 255 ) ), {
      tandem: SOLUTES_TANDEM.createTandem( 'copperSulfate' )
    }
  ),

  POTASSIUM_PERMANGANATE: new Solute(
    beersLawLabStrings.potassiumPermanganate,
    BLLSymbols.POTASSIUM_PERMANGANATE,
    0.4, // stockSolutionConcentration, mol/L
    158.034, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 0.01, new Color( 255, 0, 255 ), 0.48, new Color( 80, 0, 120 ) ), {
      tandem: SOLUTES_TANDEM.createTandem( 'potassiumPermanganate' ),
      particleColor: Color.BLACK
    }
  ),

  SODIUM_CHLORIDE: new Solute(
    beersLawLabStrings.sodiumChloride,
    BLLSymbols.SODIUM_CHLORIDE,
    5.50, // stockSolutionConcentration, mol/L
    58.443, // molarMass, g/mol
    new SoluteColorScheme( 0, Solvent.WATER_COLOR, 5.00, new Color( 225, 250, 250 ), 6.15, new Color( 225, 240, 240 ) ), {
      tandem: SOLUTES_TANDEM.createTandem( 'sodiumChloride' )
    }
  )
};

beersLawLab.register( 'SoluteInstances', SoluteInstances );

export default SoluteInstances;
