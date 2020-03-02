// Copyright 2020, University of Colorado Boulder

/**
 * BeersLawSolutionInstances defines a set of BeersLawSolution instances that are used in the Beer's Law screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Color from '../../../../scenery/js/util/Color.js';
import beersLawLabStrings from '../../beers-law-lab-strings.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import BLLSymbols from '../../common/BLLSymbols.js';
import ColorRange from '../../common/model/ColorRange.js';
import ConcentrationTransform from './ConcentrationTransform.js';
import BeersLawSolution from './BeersLawSolution.js';
import MolarAbsorptivityData from './MolarAbsorptivityData.js';

// strings
const cobaltChlorideString = beersLawLabStrings.cobaltChloride;
const cobaltIINitrateString = beersLawLabStrings.cobaltIINitrate;
const copperSulfateString = beersLawLabStrings.copperSulfate;
const drinkMixString = beersLawLabStrings.drinkMix;
const nickelIIChlorideString = beersLawLabStrings.nickelIIChloride;
const potassiumChromateString = beersLawLabStrings.potassiumChromate;
const potassiumDichromateString = beersLawLabStrings.potassiumDichromate;
const potassiumPermanganateString = beersLawLabStrings.potassiumPermanganate;

// A new tandem instance is required here since the solutes are created statically. Signify that these solutions
// are only used in the beers law screen by attaching them to that screen's tandem.
const tandem = BLLConstants.BEERS_LAW_SCREEN_TANDEM.createTandem( 'solutions' );

const BeersLawSolutionInstances = {

  DRINK_MIX: new BeersLawSolution(
    'drinkMix',
    drinkMixString,
    BLLSymbols.DRINK_MIX,
    MolarAbsorptivityData.DRINK_MIX,
    new RangeWithValue( 0, 0.400, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 225, 225 ), Color.RED ), {
      tandem: tandem.createTandem( 'drinkMix' )
    }
  ),

  COBALT_II_NITRATE: new BeersLawSolution(
    'cobaltIINitrate',
    cobaltIINitrateString,
    BLLSymbols.COBALT_II_NITRATE,
    MolarAbsorptivityData.COBALT_II_NITRATE,
    new RangeWithValue( 0, 0.400, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 225, 225 ), Color.RED ), {
      tandem: tandem.createTandem( 'cobaltIINitrate' )
    }
  ),

  COBALT_CHLORIDE: new BeersLawSolution(
    'cobaltChloride',
    cobaltChlorideString,
    BLLSymbols.COBALT_CHLORIDE,
    MolarAbsorptivityData.COBALT_CHLORIDE,
    new RangeWithValue( 0, 0.250, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 255, 242, 242 ), new Color( 255, 106, 106 ) ), {
      tandem: tandem.createTandem( 'cobaltChloride' )
    }
  ),

  POTASSIUM_DICHROMATE: new BeersLawSolution(
    'potassiumDichromate',
    potassiumDichromateString,
    BLLSymbols.POTASSIUM_DICHROMATE,
    MolarAbsorptivityData.POTASSIUM_DICHROMATE,
    new RangeWithValue( 0, 0.000500, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 232, 210 ), new Color( 255, 127, 0 ) ), {
      tandem: tandem.createTandem( 'potassiumDichromate' )
    }
  ),

  POTASSIUM_CHROMATE: new BeersLawSolution(
    'potassiumChromate',
    potassiumChromateString,
    BLLSymbols.POTASSIUM_CHROMATE,
    MolarAbsorptivityData.POTASSIUM_CHROMATE,
    new RangeWithValue( 0, 0.000400, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 255, 199 ), new Color( 255, 255, 0 ) ), {
      tandem: tandem.createTandem( 'potassiumChromate' )
    }
  ),

  NICKEL_II_CHLORIDE: new BeersLawSolution(
    'nickelIIChloride',
    nickelIIChlorideString,
    BLLSymbols.NICKEL_II_CHLORIDE,
    MolarAbsorptivityData.NICKEL_II_CHLORIDE,
    new RangeWithValue( 0, 0.350, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 234, 244, 234 ), new Color( 0, 128, 0 ) ), {
      tandem: tandem.createTandem( 'nickelIIChloride' )
    }
  ),

  COPPER_SULFATE: new BeersLawSolution(
    'copperSulfate',
    copperSulfateString,
    BLLSymbols.COPPER_SULFATE,
    MolarAbsorptivityData.COPPER_SULFATE,
    new RangeWithValue( 0, 0.200, 0.100 ),
    ConcentrationTransform.mM,
    new ColorRange( new Color( 222, 238, 255 ), new Color( 30, 144, 255 ) ), {
      tandem: tandem.createTandem( 'copperSulfate' )
    }
  ),

  POTASSIUM_PERMANGANATE: new BeersLawSolution(
    'potassiumPermanganate',
    potassiumPermanganateString,
    BLLSymbols.POTASSIUM_PERMANGANATE,
    MolarAbsorptivityData.POTASSIUM_PERMANGANATE,
    new RangeWithValue( 0, 0.000800, 0.000100 ),
    ConcentrationTransform.uM,
    new ColorRange( new Color( 255, 235, 255 ), new Color( 255, 0, 255 ) ), {
      tandem: tandem.createTandem( 'potassiumPermanganate' ),

      // has a special saturated color
      saturatedColor: new Color( 80, 0, 120 )
    }
  )
};

beersLawLab.register( 'BeersLawSolutionInstances', BeersLawSolutionInstances );

export default BeersLawSolutionInstances;