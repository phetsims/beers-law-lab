// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the "Beer's Law Lab" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require(
  [
    "JOIST/Sim",
    "concentration/ConcentrationTab",
    "beerslaw/BeersLawTab",
    "SCENERY/util/Util",
    "common/BLLStrings"
  ],
  function ( Sim, ConcentrationTab, BeersLawTab, Util, BLLStrings ) {
    "use strict";
    console.log( Util.testAssert() ); // determine whether assertions are enabled in scenery
    new Sim( BLLStrings.beersLawLab, [ new ConcentrationTab(), new BeersLawTab() ], { showHomeScreen: false, tabIndex: 1 } ).start();
  } );
