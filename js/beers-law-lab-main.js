// Copyright 2013-2020, University of Colorado Boulder

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

const simOptions = {
  credits: {
    leadDesign: 'Julia Chamberlain',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
    team: 'Kelly Lancaster, Emily B. Moore, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Bryce Griebenow, Elise Morgan, Oliver Orejola, Benjamin Roberts, Bryan Yoelin',
    thanks: 'Conversion of this simulation to HTML5 was funded by the Royal Society of Chemistry.'
  }
};

simLauncher.launch( () => {
  const sim = new Sim( beersLawLabStrings[ 'beers-law-lab' ].title, [
    new ConcentrationScreen( BLLConstants.CONCENTRATION_SCREEN_TANDEM ),
    new BeersLawScreen( BLLConstants.BEERS_LAW_SCREEN_TANDEM )
  ], simOptions );
  sim.start();
} );