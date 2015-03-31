// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a shaker, contains solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  var Property = require( 'AXON/Property' );

  /**
   * Constructor
   * @param {Vector2} location
   * @param {number} orientation in radians
   * @param {Bounds2} dragBounds
   * @param {Property.<Solute>} soluteProperty
   * @param {number} maxDispensingRate
   * @param {boolean} visible
   * @constructor
   */
  function Shaker( location, dragBounds, orientation, soluteProperty, maxDispensingRate, visible ) {

    var thisShaker = this;
    Movable.call( thisShaker, location, dragBounds, { locationComponentID: 'concentrationScreen.shaker.location' } );

    thisShaker.orientation = orientation;
    thisShaker.soluteProperty = soluteProperty;
    thisShaker.maxDispensingRate = maxDispensingRate;

    thisShaker.visibleProperty = new Property( visible );
    thisShaker.emptyProperty = new Property( false );
    thisShaker.dispensingRateProperty = new Property( 0 );
    thisShaker.previousLocation = location;

    // set the dispensing rate to zero when the shaker becomes empty or invisible
    var observer = function() {
      if ( thisShaker.emptyProperty.get() || !thisShaker.visibleProperty.get() ) {
        thisShaker.dispensingRateProperty.set( 0 );
      }
    };
    thisShaker.emptyProperty.link( observer );
    thisShaker.visibleProperty.link( observer );
  }

  return inherit( Movable, Shaker, {

    reset: function() {
      Movable.prototype.reset.call( this );
      this.visibleProperty.reset();
      this.emptyProperty.reset();
      this.dispensingRateProperty.reset();
      this.previousLocation = this.locationProperty.get(); // to prevent shaker from dispensing solute when its location is reset
    },

    // Sets the dispensing rate if the shaker is moving.
    step: function() {
      var thisShaker = this;
      if ( thisShaker.visibleProperty.get() && !thisShaker.emptyProperty.get() ) {
        if ( thisShaker.previousLocation.equals( thisShaker.locationProperty.get() ) ) {
          thisShaker.dispensingRateProperty.set( 0 ); // shaker is not moving, don't dispense anything
        }
        else {
          thisShaker.dispensingRateProperty.set( thisShaker.maxDispensingRate ); // max rate seems to work fine
        }
      }
      thisShaker.previousLocation = thisShaker.locationProperty.get();
    }
  } );
} );