// Copyright 2016-2023, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import beersLawLab from '../beersLawLab.js';
import BLLConstants from './BLLConstants.js';

export const BeakerUnitsValues = [ 'liters', 'milliliters' ] as const;
export type BeakerUnits = ( typeof BeakerUnitsValues )[number];

export const ConcentrationMeterUnitsValues = [ 'molesPerLiter', 'percent' ] as const;
export type ConcentrationMeterUnits = ( typeof ConcentrationMeterUnitsValues )[number];

const BLLQueryParameters = QueryStringMachine.getAll( {

  // Whether the volume of the solution (in L) is visible at the surface of the solution in the beaker.
  // For external use, see https://github.com/phetsims/beers-law-lab/issues/161
  showSolutionVolume: {
    type: 'flag',
    public: true
  },

  // Whether the solute amount (in grams) dissolved in solution is visible on the Concentration screen
  // For external use, see https://github.com/phetsims/beers-law-lab/issues/148
  showSoluteAmount: {
    type: 'flag',
    public: true
  },

  // Units for beaker ticks
  // For external use, see https://github.com/phetsims/beers-law-lab/issues/150
  beakerUnits: {
    type: 'string',
    validValues: BeakerUnitsValues,
    defaultValue: 'liters',
    public: true
  },

  // Units on the concentration meter
  // For external use, see https://github.com/phetsims/beers-law-lab/issues/149
  concentrationMeterUnits: {
    type: 'string',
    validValues: ConcentrationMeterUnitsValues,
    defaultValue: 'molesPerLiter',
    public: true
  },

  // Snap interval for the cuvette in centimeters, or 0 for no snap
  // For external use, see https://github.com/phetsims/phet-io/issues/568
  cuvetteSnapInterval: {
    type: 'number',
    defaultValue: 0.1, // cm
    isValidValue: value => BLLConstants.CUVETTE_SNAP_INTERVAL_RANGE.contains( value ),
    public: true
  }
} );

beersLawLab.register( 'BLLQueryParameters', BLLQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.beersLawLab.BLLQueryParameters' );

export default BLLQueryParameters;