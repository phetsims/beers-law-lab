// Copyright 2002-2013, University of Colorado

/**
 * Model of a shaker, contains solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var callSuper = require( "PHET_CORE/callSuper" );
  var inherit = require( "PHET_CORE/inherit" );
  var Movable = require( "common/model/Movable" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Vector2 = require( "DOT/Vector2" );

  /**
   * Constructor
   * @param {Vector2} location
   * @param {Number} orientation in radians
   * @param {Bounds2} dragBounds
   * @param {Property<Solute>} solute
   * @param {Number} maxDispensingRate
   * @param {Boolean} visible
   * @constructor
   */
  function Shaker( location, dragBounds, orientation, solute, maxDispensingRate, visible ) {

    var thisShaker = this;
    Movable.call( thisShaker, location, dragBounds );

    thisShaker.orientation = orientation;
    thisShaker.solute = solute;
    thisShaker.maxDispensingRate = maxDispensingRate;

    thisShaker.visible = new Property( visible );
    thisShaker.empty = new Property( false );
    thisShaker.dispensingRate = new Property( 0 );
    thisShaker.previousLocation = location;

    // set the dispensing rate to zero when the shaker becomes empty or invisible
    var observer = function() {
      if ( thisShaker.empty.get() || !thisShaker.visible.get() ) {
        thisShaker.dispensingRate.set( 0 );
      }
    };
    thisShaker.empty.link( observer );
    thisShaker.visible.link( observer );

    thisShaker.reset = function() {
      callSuper( Movable, "reset", thisShaker );
      thisShaker.visible.reset();
      thisShaker.empty.reset();
      thisShaker.dispensingRate.reset();
      thisShaker.previousLocation = this.location.get(); // to prevent shaker from dispensing solute when its location is reset
    };
  }

  inherit( Shaker, Movable );

  // Sets the dispensing rate if the shaker is moving.
  Shaker.prototype.step = function() {
    var thisShaker = this;
    if ( thisShaker.visible.get() && !thisShaker.empty.get() ) {
      if ( thisShaker.previousLocation.equals( thisShaker.location.get() ) ) {
        thisShaker.dispensingRate.set( 0 ); // shaker is not moving, don't dispense anything
      }
      else {
        thisShaker.dispensingRate.set( thisShaker.maxDispensingRate ); // max rate seems to work fine
      }
    }
    thisShaker.previousLocation = thisShaker.location.get();
  };

  return Shaker;
} );