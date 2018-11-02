// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {Property.<Solute>} soluteProperty
   * @param {number} maxFlowRate
   * @param {boolean} visible
   * @param {Object} [tandem]
   * @constructor
   */
  function Dropper( location, dragBounds, soluteProperty, maxFlowRate, visible, options ) {

    var self = this;
    Movable.call( this, location, dragBounds, options );

    // @public
    this.soluteProperty = soluteProperty;
    this.visibleProperty = new BooleanProperty( visible );
    this.dispensingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'dispensingProperty' )
    } ); // true if the dropper is dispensing solution
    this.enabledProperty = new BooleanProperty( true );
    this.emptyProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'emptyProperty' )
    } );
    this.flowRateProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'flowRateProperty' ),
      units: 'liters/second'
    } ); // L/sec

    // Turn off the dropper when it's disabled.
    this.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        self.dispensingProperty.set( false );
      }
    } );

    // Toggle the flow rate when the dropper is turned on/off.
    this.dispensingProperty.link( function( dispensing ) {
      self.flowRateProperty.set( dispensing ? maxFlowRate : 0 );
    } );

    // When the dropper becomes empty, disable it.
    this.emptyProperty.link( function( empty ) {
      if ( empty ) {
        self.enabledProperty.set( false );
      }
    } );
  }

  beersLawLab.register( 'Dropper', Dropper );

  return inherit( Movable, Dropper, {

    // @public
    reset: function() {
      Movable.prototype.reset.call( this );
      this.visibleProperty.reset();
      this.dispensingProperty.reset();
      this.enabledProperty.reset();
      this.emptyProperty.reset();
      this.flowRateProperty.reset();
    }
  } );
} );