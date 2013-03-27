// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the "Beer's Law Lab" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require(
  [
    "concentration/model/ConcentrationModel",
    "concentration/view/ConcentrationView",
    "PHETCOMMON/view/PerformanceMonitor",
    "i18n!../nls/beers-law-lab-strings"
  ],
  function ( ConcentrationModel, ConcentrationView, PerformanceMonitor, Strings ) {
    "use strict";

    // Concentration tab
    var model = new ConcentrationModel();
    var view = new ConcentrationView( model, Strings );

    //TODO Beer's Law tab

    var performanceMonitor = new PerformanceMonitor( 500, 10 );

    // polyfill for requestAnimationFrame
    window.requestAnimationFrame = window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.oRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   function ( callback ) {
                                     window.setTimeout( callback, 1000 / 60 );
                                   };

    // Animation loop
    var deltaSeconds = 0.04; // similar to Java sim. TODO: compute this
    (function animationLoop() {
      window.requestAnimationFrame( animationLoop );
      performanceMonitor.begin();
      model.step( deltaSeconds );
      view.step( deltaSeconds );
      performanceMonitor.end();
    })();
  } );
