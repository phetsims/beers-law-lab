// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  var Property = require( 'AXON/Property' );
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {Property.<Solute>} soluteProperty
   * @param {number} maxFlowRate
   * @param {boolean} visible
   * @param {Tandem} tandem
   * @constructor
   */
  function Dropper( location, dragBounds, soluteProperty, maxFlowRate, visible, tandem ) {

    var thisDropper = this;
    Movable.call( thisDropper, location, dragBounds, tandem );

    // @public
    thisDropper.soluteProperty = soluteProperty;
    thisDropper.visibleProperty = new Property( visible );
    thisDropper.dispensingProperty = new Property( false, {
      tandem: tandem.createTandem( 'dispensingProperty' ),
      type: TBoolean
    } ); // true if the dropper is dispensing solution
    thisDropper.enabledProperty = new Property( true );
    thisDropper.emptyProperty = new Property( false, {
      tandem: tandem.createTandem( 'emptyProperty' ),
      type: TBoolean
    } );
    thisDropper.flowRateProperty = new Property( 0, {
      tandem: tandem.createTandem( 'flowRateProperty' ),
      type: TNumber && TNumber( 'liters/second' )
    } ); // L/sec

    // Turn off the dropper when it's disabled.
    thisDropper.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        thisDropper.dispensingProperty.set( false );
      }
    } );

    // Toggle the flow rate when the dropper is turned on/off.
    thisDropper.dispensingProperty.link( function( dispensing ) {
      thisDropper.flowRateProperty.set( dispensing ? maxFlowRate : 0 );
    } );

    // When the dropper becomes empty, disable it.
    thisDropper.emptyProperty.link( function( empty ) {
      if ( empty ) {
        thisDropper.enabledProperty.set( false );
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