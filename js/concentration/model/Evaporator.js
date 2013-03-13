// Copyright 2002-2013, University of Colorado

/**
 * Model element that determines the rate at which solvent is evaporated from the solution in the beaker.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define(
  [
    "PHETCOMMON/model/property/Property"
  ],
  function ( Property ) {
    "use strict";

    function Evaporator( maxEvaporationRate, solution ) {

      var evaporator = this;

      evaporator.maxEvaporationRate = maxEvaporationRate; // L/sec
      evaporator.evaporationRate = new Property( 0 ); // L/sec
      evaporator.enabled = new Property( true );

      // disable when the volume gets to zero
      solution.volume.addObserver( function ( volume ) {
        evaporator.enabled.set( volume > 0 );
      } );

      // when disabled, set the rate to zero
      evaporator.enabled.addObserver( function ( enabled ) {
        if ( !enabled ) {
          evaporator.evaporationRate.set( 0 );
        }
      } );
    }

    Evaporator.prototype.reset = function () {
      this.evaporationRate.reset();
      this.enabled.reset();
    };

    return Evaporator;
  }
);