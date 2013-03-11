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
    "use strict";

    var model = new ConcentrationModel();
    var view = new ConcentrationView( model, Strings );
    var performanceMonitor = new PerformanceMonitor();

    // polyfill for requestAnimationFrame
    window.animate = (function () {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             function ( callback ) {
               window.setTimeout( callback, 1000 / 60 );
             };
    })();

    // Animation loop
    (function animationLoop() {
      window.animate( animationLoop );
      performanceMonitor.begin();
      model.step();
      view.step();
      performanceMonitor.end();
    })();
  } );
