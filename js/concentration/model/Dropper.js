// Copyright 2002-2013, University of Colorado

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var callSuper = require( "PHET_CORE/callSuper" );
  var inherit = require( "PHET_CORE/inherit" );
  var Movable = require( "common/model/Movable" );
  var Property = require( "PHETCOMMON/model/property/Property" );

  /**
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {Property} solute (type Solute)
   * @param {Number} maxFlowRate
   * @param {Boolean} visible
   * @constructor
   */
  function Dropper( location, dragBounds, solute, maxFlowRate, visible ) {

    var thisDropper = this;
    Movable.call( thisDropper, location, dragBounds );

    thisDropper.solute = solute;
    thisDropper.visible = new Property( visible );
    thisDropper.on = new Property( false ); // true if the dropper is dispensing solution
    thisDropper.enabled = new Property( true );
    thisDropper.empty = new Property( false );
    thisDropper.flowRate = new Property( 0 ); // L/sec

    // Turn off the dropper when it's disabled.
    thisDropper.enabled.addObserver( function ( enabled ) {
      if ( !enabled ) {
        thisDropper.on.set( false );
      }
    } );

    // Toggle the flow rate when the dropper is turned on/off.
    thisDropper.on.addObserver( function ( on ) {
      thisDropper.flowRate.set( on ? maxFlowRate : 0 );
    } );

    // When the dropper becomes empty, disable it.
    thisDropper.empty.addObserver( function ( empty ) {
      if ( empty ) {
        thisDropper.enabled.set( false );
      }
    } );

    thisDropper.reset = function () {
      callSuper( Movable, "reset", thisDropper );
      thisDropper.visible.reset();
      thisDropper.on.reset();
      thisDropper.enabled.reset();
      thisDropper.empty.reset();
      thisDropper.flowRate.reset();
    };
  }

  inherit( Dropper, Movable );

  return Dropper;
} );