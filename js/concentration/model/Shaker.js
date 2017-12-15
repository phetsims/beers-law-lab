// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model of a shaker, contains solute in solid form.
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

  // phet-io modules
  var ShakerIO = require( 'BEERS_LAW_LAB/concentration/model/ShakerIO' );

  /**
   * @param {Vector2} location
   * @param {number} orientation in radians
   * @param {Bounds2} dragBounds
   * @param {Property.<Solute>} soluteProperty
   * @param {number} maxDispensingRate
   * @param {boolean} visible
   * @param {Object} [options]
   * @constructor
   */
  function Shaker( location, dragBounds, orientation, soluteProperty, maxDispensingRate, visible, options ) {

    options = _.extend( {
      phetioType: ShakerIO
    }, options );

    var self = this;

    Movable.call( this, location, dragBounds, options );

    // @public (read-only)
    this.orientation = orientation;
    this.maxDispensingRate = maxDispensingRate;

    // @public
    this.soluteProperty = soluteProperty;
    this.visibleProperty = new Property( visible );
    this.emptyProperty = new Property( false );
    this.dispensingRateProperty = new Property( 0 );

    // @public (phet-io)
    this.previousLocation = location;

    // set the dispensing rate to zero when the shaker becomes empty or invisible
    var observer = function() {
      if ( self.emptyProperty.get() || !self.visibleProperty.get() ) {
        self.dispensingRateProperty.set( 0 );
      }
    };
    this.emptyProperty.link( observer );
    this.visibleProperty.link( observer );
  }

  beersLawLab.register( 'Shaker', Shaker );

  return inherit( Movable, Shaker, {

    // @public
    reset: function() {
      Movable.prototype.reset.call( this );
      this.visibleProperty.reset();
      this.emptyProperty.reset();
      this.dispensingRateProperty.reset();
      this.previousLocation = this.locationProperty.get(); // to prevent shaker from dispensing solute when its location is reset
    },

    // @public Sets the dispensing rate if the shaker is moving.
    step: function() {
      if ( this.visibleProperty.get() && !this.emptyProperty.get() ) {
        if ( this.previousLocation.equals( this.locationProperty.get() ) ) {
          this.dispensingRateProperty.set( 0 ); // shaker is not moving, don't dispense anything
        }
        else {
          this.dispensingRateProperty.set( this.maxDispensingRate ); // max rate seems to work fine
        }
      }
      this.previousLocation = this.locationProperty.get();
    }
  } );
} );