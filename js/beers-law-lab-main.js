// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the "Beer's Law Lab" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require(
  [
    "JOIST/Sim",
    "PHETCOMMON/util/ImagesLoader",
    "concentration/ConcentrationTab",
    "beerslaw/BeersLawTab",
    "SCENERY/util/Util",
    "common/BLLStrings",
    "common/BLLImages"
  ],
  function ( Sim, ImagesLoader, ConcentrationTab, BeersLawTab, Util, BLLStrings, BLLImages ) {
    "use strict";

    new ImagesLoader( function ( loader ) {

      BLLImages.getImage = loader.getImage;

      new Sim( BLLStrings.beersLawLab,
               [ new ConcentrationTab(), new BeersLawTab() ],
               { showHomeScreen: false, tabIndex: 1 } )
        .start();
    } );
  } );
