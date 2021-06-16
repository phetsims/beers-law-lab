[object Promise]

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import beersLawLab from '../beersLawLab.js';
import BLLConstants from './BLLConstants.js';

const BLLQueryParameters = QueryStringMachine.getAll( {

  // Whether the solute amount (in grams) is visible on the Concentration screen
  // For external use, see https://github.com/phetsims/beers-law-lab/issues/148
  showSoluteAmount: {
    type: 'flag',
    public: true
  },

  // Units on the concentration meter
  // For external use, see https://github.com/phetsims/beers-law-lab/issues/149
  concentrationMeterUnits: {
    type: 'string',
    validValues: [ 'molesPerLiter', 'percent' ],
    defaultValue: 'molesPerLiter',
    public: true
  },

  // Units for beaker ticks
  // For external use, see https://github.com/phetsims/beers-law-lab/issues/150
  beakerUnits: {
    type: 'string',
    validValues: [ 'liters', 'milliliters' ],
    defaultValue: 'liters',
    public: true
  },

  // Snap interval for the cuvette in centimeters, or 0 for no snap
  // For external use, see https://github.com/phetsims/phet-io/issues/568
  cuvetteSnapInterval: {
    type: 'number',
    defaultValue: BLLConstants.DEFAULT_CUVETTE_SNAP_INTERVAL,
    isValidValue: value => ( value >= 0 ),
    public: true
  }
} );

beersLawLab.register( 'BLLQueryParameters', BLLQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.beersLawLab.BLLQueryParameters' );

export default BLLQueryParameters;