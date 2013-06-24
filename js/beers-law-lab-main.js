// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the "Beer's Law Lab" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require( [ "JOIST/SimLauncher", "JOIST/Sim", "concentration/ConcentrationTab", "beerslaw/BeersLawTab", "common/BLLStrings", "common/BLLImages" ],
  function( SimLauncher, Sim, ConcentrationTab, BeersLawTab, BLLStrings, BLLImages ) {
    "use strict";

    //TODO i18n?
    var simOptions = {
      credits: "PhET Development Team -\n" +
               "Lead Design: Julia Chamberlain\n" +
               "Software Development: Chris Malley\n" +
               "Design Team: Kelly Lancaster, Emily B. Moore, Ariel Paul, Kathy Perkins"
    };

    if ( window.phetcommon.getQueryParameter( "dev" ) ) {
      simOptions = _.extend( { showHomeScreen: false, tabIndex: 1 }, simOptions );
    }

    SimLauncher.launch( BLLImages, function() {
      var sim = new Sim( BLLStrings.beersLawLab, [ new ConcentrationTab(), new BeersLawTab() ], simOptions );
      sim.start();
    } );
  } );
