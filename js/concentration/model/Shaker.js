// Copyright 2002-2013, University of Colorado

/**
 * Model of a shaker, contains solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "DOT/Vector2",
    "PHETCOMMON/model/property/Property",
    "PHETCOMMON/util/Inheritance",
    "common/model/Movable"
  ],
  function ( Vector2, Property, Inheritance, Movable ) {
    "use strict";

    /**
     * Constructor
     * @param {Vector2} location
     * @param {Number} orientation in radians
     * @param {Rectangle} dragBounds
     * @param {Property<Solute>} soluteProperty
     * @param {Number} maxDispensingRate
     * @constructor
     */
    function Shaker( location, dragBounds, orientation, soluteProperty, maxDispensingRate ) {

      Movable.call( this, location, dragBounds ); // constructor stealing

      var shaker = this;

      shaker.orientation = orientation;
      shaker.soluteProperty = soluteProperty;
      shaker.maxDispensingRate = maxDispensingRate;

      shaker.visibleProperty = new Property( true );
      shaker.emptyProperty = new Property( false );
      shaker.dispensingRateProperty = new Property( 0 );
      shaker.previousLocation = location;

      // set the dispensing rate to zero when the shaker becomes empty or invisible
      var observer = function () {
        if ( shaker.emptyProperty.get() || !shaker.visibleProperty.get() ) {
          shaker.dispensingRateProperty.set( 0 );
        }
      };
      shaker.emptyProperty.addObserver( observer );
      shaker.visibleProperty.addObserver( observer );

      // reset
      shaker.reset = function () {
        Inheritance.callSuper( Movable, "reset", this );
        shaker.dispensingRateProperty.reset();
        shaker.previousLocation = this.locationProperty.get(); // to prevent shaker from dispensing solute when its location is reset
      }
    }

    Inheritance.inheritPrototype( Shaker, Movable );

    // Sets the dispensing rate if the shaker is moving.
    Shaker.prototype.step = function () {
      var shaker = this;
      if ( shaker.visibleProperty.get() && !shaker.emptyProperty.get() ) {
        if ( shaker.previousLocation.equals( shaker.locationProperty.get() ) ) {
          shaker.dispensingRateProperty.set( 0 ); // shaker is not moving, don't dispense anything
        }
        else {
          shaker.dispensingRateProperty.set( shaker.maxDispensingRate ); // this seems to work fine
        }
      }
      shaker.previousLocation = shaker.locationProperty.get();
    }

    return Shaker;
  } );