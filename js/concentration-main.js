// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the "Concentration" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require(
  [
    "PHETCOMMON/view/PerformanceMonitor",
    "concentration/model/ConcentrationModel",
    "concentration/view/ConcentrationView",
    "i18n!../nls/beers-law-lab-strings"
  ],
  function ( PerformanceMonitor, ConcentrationModel, ConcentrationView, Strings ) {

    var model = new ConcentrationModel();
    var view = new ConcentrationView( model, Strings );
    var performanceMonitor = new PerformanceMonitor();

    // Animation loop
    (function animationLoop() {
      performanceMonitor.begin();
      requestAnimationFrame( animationLoop );
      model.step();
      view.step();
      performanceMonitor.end();
    })();
  } );
