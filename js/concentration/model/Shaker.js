// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a shaker, contains solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ShakerIO = require( 'BEERS_LAW_LAB/concentration/model/ShakerIO' );

  /**
   * @param {Vector2} position
   * @param {number} orientation in radians
   * @param {Bounds2} dragBounds
   * @param {Property.<Solute>} soluteProperty
   * @param {number} maxDispensingRate
   * @param {boolean} visible
   * @param {Object} [options]
   * @constructor
   */
  function Shaker( position, dragBounds, orientation, soluteProperty, maxDispensingRate, visible, options ) {

    options = merge( {
      phetioType: ShakerIO
    }, options );

    const self = this;

    Movable.call( this, position, dragBounds, options );

    // @public (read-only)
    this.orientation = orientation;
    this.maxDispensingRate = maxDispensingRate;

    // @public
    this.soluteProperty = soluteProperty;
    this.visibleProperty = new BooleanProperty( visible );
    this.emptyProperty = new BooleanProperty( false );
    this.dispensingRateProperty = new NumberProperty( 0 );

    // @public (phet-io)
    this.previousPosition = position;

    // set the dispensing rate to zero when the shaker becomes empty or invisible
    const observer = function() {
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
      this.previousPosition = this.positionProperty.get(); // to prevent shaker from dispensing solute when its position is reset
    },

    // @public Sets the dispensing rate if the shaker is moving.
    step: function() {
      if ( this.visibleProperty.get() && !this.emptyProperty.get() ) {
        if ( this.previousPosition.equals( this.positionProperty.get() ) ) {
          this.dispensingRateProperty.set( 0 ); // shaker is not moving, don't dispense anything
        }
        else {
          this.dispensingRateProperty.set( this.maxDispensingRate ); // max rate seems to work fine
        }
      }
      this.previousPosition = this.positionProperty.get();
    }
  } );
} );