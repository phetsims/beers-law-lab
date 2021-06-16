[object Promise]

/**
 * Main entry point for the 'Beer's Law Lab' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import BeersLawScreen from './beerslaw/BeersLawScreen.js';
import beersLawLabStrings from './beersLawLabStrings.js';
import BLLConstants from './common/BLLConstants.js';
import ConcentrationScreen from './concentration/ConcentrationScreen.js';

simLauncher.launch( () => {
  const screens = [
    new ConcentrationScreen( { tandem: BLLConstants.CONCENTRATION_SCREEN_TANDEM } ),
    new BeersLawScreen( { tandem: BLLConstants.BEERS_LAW_SCREEN_TANDEM } )
  ];
  const sim = new Sim( beersLawLabStrings[ 'beers-law-lab' ].title, screens, {
    credits: BLLConstants.CREDITS
  } );
  sim.start();
} );