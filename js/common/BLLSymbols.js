// Copyright 2013-2022, University of Colorado Boulder

/**
 * Universal chemical symbols, no i18n needed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import beersLawLab from '../beersLawLab.js';
import BeersLawLabStrings from '../BeersLawLabStrings.js';

const BLLSymbols = {
  COBALT_II_NITRATE: 'Co(NO<sub>3</sub>)<sub>2</sub>',
  COBALT_CHLORIDE: 'CoCl<sub>2</sub>',
  COPPER_SULFATE: 'CuSO<sub>4</sub>',
  DRINK_MIX: BeersLawLabStrings.drinkMix,
  NICKEL_II_CHLORIDE: 'NiCl<sub>2</sub>',
  POTASSIUM_CHROMATE: 'K<sub>2</sub>CrO<sub>4</sub>',
  POTASSIUM_DICHROMATE: 'K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub>',
  POTASSIUM_PERMANGANATE: 'KMnO<sub>4</sub>',
  SODIUM_CHLORIDE: 'NaCl',
  WATER: 'H<sub>2</sub>O'
};

beersLawLab.register( 'BLLSymbols', BLLSymbols );
export default BLLSymbols;