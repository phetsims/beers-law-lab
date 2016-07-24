// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model element that determines the rate at which solvent is evaporated from the solution in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  /**
   * @param {number} maxEvaporationRate L/sec
   * @param {ConcentrationSolution} solution
   * @param {Tandem} tandem
   * @constructor
   */
  function Evaporator( maxEvaporationRate, solution, tandem ) {

    var thisEvaporator = this;

    thisEvaporator.maxEvaporationRate = maxEvaporationRate; // @public (read-only) L/sec

    // @public
    thisEvaporator.evaporationRateProperty = new Property( 0, {
      tandem: tandem.createTandem( 'evaporationRateProperty' ),
      type: TNumber && TNumber( 'liters/second' )
    } ); // L/sec
    thisEvaporator.enabledProperty = new Property( true, {
      tandem: tandem.createTandem( 'enabledProperty' ),
      type: TBoolean
    } );

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

  beersLawLab.register( 'Evaporator', Evaporator );

  return inherit( Object, Evaporator, {

    // @public
    reset: function() {
      this.evaporationRateProperty.reset();
      this.enabledProperty.reset();
    }
  } );
} );