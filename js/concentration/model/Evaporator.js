// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model element that determines the rate at which solvent is evaporated from the solution in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @param {number} maxEvaporationRate L/sec
   * @param {ConcentrationSolution} solution
   * @param {Tandem} tandem
   * @constructor
   */
  function Evaporator( maxEvaporationRate, solution, tandem ) {

    var self = this;

    this.maxEvaporationRate = maxEvaporationRate; // @public (read-only) L/sec

    // @public
    this.evaporationRateProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'evaporationRateProperty' ),
      units: 'liters/second'
    } ); // L/sec
    this.enabledProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'enabledProperty' )
    } );

    // disable when the volume gets to zero
    solution.volumeProperty.link( function( volume ) {
      self.enabledProperty.set( volume > 0 );
    } );

    // when disabled, set the rate to zero
    this.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        self.evaporationRateProperty.set( 0 );
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