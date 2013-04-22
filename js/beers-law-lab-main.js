// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the "Beer's Law Lab" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require(
  [
    "JOIST/Sim",
    "concentration/ConcentrationModule",
    "beerslaw/BeersLawModule",
    "i18n!../nls/beers-law-lab-strings"
  ],
  function ( Sim, ConcentrationModule, BeersLawModule, strings ) {
    "use strict";
    new Sim( strings.beersLawLab, [ new ConcentrationModule( strings ), new BeersLawModule( strings ) ] ).start();;
  } );
