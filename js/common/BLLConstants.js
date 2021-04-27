// Copyright 2014-2020, University of Colorado Boulder

/**
 * Constants that are global to this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import Tandem from '../../../tandem/js/Tandem.js';
import beersLawLab from '../beersLawLab.js';

// constants used to compute other constants
const BEAKER_VOLUME = 1;// L

const BLLConstants = {
  SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) },
  RADIO_BUTTON_RADIUS: 11,
  SOLUTE_AMOUNT_RANGE: new RangeWithValue( 0, 7, 0 ), // moles
  SOLUTION_VOLUME_RANGE: new RangeWithValue( 0, BEAKER_VOLUME, 0.5 ), // liters
  BEAKER_VOLUME: BEAKER_VOLUME,
  DEFAULT_CUVETTE_SNAP_INTERVAL: 0.1, // cm
  CONCENTRATION_SCREEN_TANDEM: Tandem.ROOT.createTandem( 'concentrationScreen' ),
  BEERS_LAW_SCREEN_TANDEM: Tandem.ROOT.createTandem( 'beersLawScreen' ),
  CREDITS: {
    leadDesign: 'Julia Chamberlain',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
    team: 'Kelly Lancaster, Emily B. Moore, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Bryce Griebenow, Elise Morgan, Oliver Orejola, Benjamin Roberts, Bryan Yoelin',
    thanks: 'Conversion of this simulation to HTML5 was funded by the Royal Society of Chemistry.'
  }
};

beersLawLab.register( 'BLLConstants', BLLConstants );
export default BLLConstants;