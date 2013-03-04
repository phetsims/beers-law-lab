// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the "Concentration" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require(
  [
    "PHETCOMMON/util/Logger",
    "concentration/model/ConcentrationModel",
    "concentration/view/ConcentrationView",
    "i18n!../nls/beers-law-lab-strings"
  ],
  function ( Logger, ConcentrationModel, ConcentrationView, Strings ) {

    Logger.enabled = true;

    // Model --------------------------------------------------------------------

    var model = new ConcentrationModel();

    // View --------------------------------------------------------------------

    var view = new ConcentrationView( model, Strings );

    // Animation loop ----------------------------------------------------------

    //TODO what is the prototypical animation loop for Scenery?
//    Easel.Ticker.addListener( model );
//    Easel.Ticker.addListener( stage );
//    Easel.Ticker.setFPS( 60 );
//    Easel.Touch.enable( stage, false, false );
  } );
