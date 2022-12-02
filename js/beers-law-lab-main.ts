// Copyright 2013-2022, University of Colorado Boulder

/**
 * Main entry point for the 'Beer's Law Lab' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import simLauncher from '../../joist/js/simLauncher.js';
import BeersLawScreen from './beerslaw/BeersLawScreen.js';
import BeersLawLabStrings from './BeersLawLabStrings.js';
import ConcentrationScreen from './concentration/ConcentrationScreen.js';
import Tandem from '../../tandem/js/Tandem.js';
import BLLSim from './common/view/BLLSim.js';

simLauncher.launch( () => {
  const screens = [
    new ConcentrationScreen( Tandem.ROOT.createTandem( 'concentrationScreen' ) ),
    new BeersLawScreen( Tandem.ROOT.createTandem( 'beersLawScreen' ) )
  ];
  const sim = new BLLSim( BeersLawLabStrings[ 'beers-law-lab' ].titleStringProperty, screens );
  sim.start();
} );