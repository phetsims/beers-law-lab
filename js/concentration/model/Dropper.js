// Copyright 2002-2013, University of Colorado

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Movable = require( "common/model/Movable" );

  /**
   * @param {Vector2} location
   * @param {Rectangle} dragBounds
   * @param {Property<Solute>} solute
   * @param {Number} maxFlowRate
   * @constructor
   */
  function Dropper( location, dragBounds, solute, maxFlowRate ) {

    Movable.call( this, location, dragBounds );

    var dropper = this;

    dropper.solute = solute;
    dropper.visible = new Property( true );
    dropper.on = new Property( false ); // true if the dropper is dispensing solution
    dropper.enabled = new Property( true );
    dropper.empty = new Property( false );
    dropper.flowRate = new Property( 0 ); // L/sec

    // Turn off the dropper when it's disabled.
    dropper.enabled.addObserver( function ( enabled ) {
      if ( !enabled ) {
        dropper.on.set( false );
      }
    } );

    // Toggle the flow rate when the dropper is turned on/off.
    dropper.on.addObserver( function ( on ) {
      dropper.flowRate.set( on ? maxFlowRate : 0 );
    } );

    // When the dropper becomes empty, disable it.
    dropper.empty.addObserver( function ( empty ) {
      if ( empty ) {
        dropper.enabled.set( false );
      }
    } );
  }

  Inheritance.inheritPrototype( Dropper, Movable );

  return Dropper;
} );