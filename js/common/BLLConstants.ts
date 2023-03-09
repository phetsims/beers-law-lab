// Copyright 2014-2023, University of Colorado Boulder

/**
 * Constants that are global to this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import Range from '../../../dot/js/Range.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import beersLawLab from '../beersLawLab.js';

// constants used to compute other constants
const BEAKER_VOLUME = 1; // L

const BLLConstants = {
  LAYOUT_BOUNDS: new Bounds2( 0, 0, 1100, 700 ),
  RADIO_BUTTON_RADIUS: 11,
  SOLUTE_AMOUNT_RANGE: new RangeWithValue( 0, 7, 0 ), // moles
  SOLUTION_VOLUME_RANGE: new RangeWithValue( 0, BEAKER_VOLUME, 0.5 ), // L
  CUVETTE_WIDTH_RANGE: new RangeWithValue( 0.5, 2.0, 1.0 ), // cm
  CUVETTE_SNAP_INTERVAL_RANGE: new Range( 0, 0.5 ), // cm - Careful! This depends on CUVETTE_WIDTH_RANGE
  BEAKER_VOLUME: BEAKER_VOLUME,
  CREDITS: {
    leadDesign: 'Julia Chamberlain',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
    team: 'Kelly Lancaster, Emily B. Moore, Ariel Paul, Kathy Perkins, Amy Rouinfar',
    qualityAssurance: 'Steele Dalton, Jaron Droder, Bryce Griebenow, Clifford Hardin, Emily Miller, Elise Morgan, ' +
                      'Liam Mulhall, Oliver Orejola, Benjamin Roberts, Nancy Salpepi, Kathryn Woessner, Bryan Yoelin',
    thanks: 'Conversion of this simulation to HTML5 was funded by the Royal Society of Chemistry.'
  },
  SOLUTION_LINE_WIDTH: 1
};

beersLawLab.register( 'BLLConstants', BLLConstants );
export default BLLConstants;