// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model element that determines the rate at which solvent is evaporated from the solution in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {number} maxEvaporationRate L/sec
   * @param {ConcentrationSolution} solution
   * @constructor
   */
  function Evaporator( maxEvaporationRate, solution ) {

    var thisEvaporator = this;

    thisEvaporator.maxEvaporationRate = maxEvaporationRate; // L/sec
    thisEvaporator.evaporationRateProperty = new Property( 0, { togetherID: 'concentrationScreen.evaporationRate' } ); // L/sec
    thisEvaporator.enabledProperty = new Property( true, { togetherID: 'concentrationScreen.evaporationEnabled' } );

    // disable when the volume gets to zero
    solution.volumeProperty.link( function( volume ) {
      thisEvaporator.enabledProperty.set( volume > 0 );
    } );

    // when disabled, set the rate to zero
    thisEvaporator.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        thisEvaporator.evaporationRateProperty.set( 0 );
      }
    } );
  }

  return inherit( Object, Evaporator, {
    reset: function() {
      this.evaporationRateProperty.reset();
      this.enabledProperty.reset();
    }
  } );
} );