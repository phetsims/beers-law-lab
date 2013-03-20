// Copyright 2002-2013, University of Colorado

/**
 * Model of a shaker, contains solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Vector2 = require( "DOT/Vector2" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Movable = require( "common/model/Movable" );

  /**
   * Constructor
   * @param {Vector2} location
   * @param {Number} orientation in radians
   * @param {Rectangle} dragBounds
   * @param {Property} solute (type Solute)
   * @param {Number} maxDispensingRate
   * @constructor
   */
  function Shaker( location, dragBounds, orientation, solute, maxDispensingRate ) {

    Movable.call( this, location, dragBounds ); // constructor stealing

    var shaker = this;

    shaker.orientation = orientation;
    shaker.solute = solute;
    shaker.maxDispensingRate = maxDispensingRate;

    shaker.visible = new Property( true );
    shaker.empty = new Property( false );
    shaker.dispensingRate = new Property( 0 );
    shaker.previousLocation = location;

    // set the dispensing rate to zero when the shaker becomes empty or invisible
    var observer = function () {
      if ( shaker.empty.get() || !shaker.visible.get() ) {
        shaker.dispensingRate.set( 0 );
      }
    };
    shaker.empty.addObserver( observer );
    shaker.visible.addObserver( observer );

    // reset
    shaker.reset = function () {
      Inheritance.callSuper( Movable, "reset", this );
      shaker.dispensingRate.reset();
      shaker.previousLocation = this.location.get(); // to prevent shaker from dispensing solute when its location is reset
    }
  }

  Inheritance.inheritPrototype( Shaker, Movable );

  // Sets the dispensing rate if the shaker is moving.
  Shaker.prototype.step = function () {
    var shaker = this;
    if ( shaker.visible.get() && !shaker.empty.get() ) {
      if ( shaker.previousLocation.equals( shaker.location.get() ) ) {
        shaker.dispensingRate.set( 0 ); // shaker is not moving, don't dispense anything
      }
      else {
        shaker.dispensingRate.set( shaker.maxDispensingRate ); // max rate seems to work fine
      }
    }
    shaker.previousLocation = shaker.location.get();
  };

  return Shaker;
} );