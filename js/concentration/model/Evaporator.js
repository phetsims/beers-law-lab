// Copyright 2002-2013, University of Colorado

/**
 * Model element that determines the rate at which solvent is evaporated from the solution in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Property = require( "PHETCOMMON/model/property/Property" );

  /**
   * @param {Number} maxEvaporationRate L/sec
   * @param {ConcentrationSolution} solution
   * @constructor
   */
  function Evaporator( maxEvaporationRate, solution ) {

    var thisEvaporator = this;

    thisEvaporator.maxEvaporationRate = maxEvaporationRate; // L/sec
    thisEvaporator.evaporationRate = new Property( 0 ); // L/sec
    thisEvaporator.enabled = new Property( true );

    // disable when the volume gets to zero
    solution.volume.addObserver( function( volume ) {
      thisEvaporator.enabled.set( volume > 0 );
    } );

    // when disabled, set the rate to zero
    thisEvaporator.enabled.addObserver( function( enabled ) {
      if ( !enabled ) {
        thisEvaporator.evaporationRate.set( 0 );
      }
    } );
  }

  Evaporator.prototype.reset = function() {
    this.evaporationRate.reset();
    this.enabled.reset();
  };

  return Evaporator;
} );