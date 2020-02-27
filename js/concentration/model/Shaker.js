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
  const merge = require( 'PHET_CORE/merge' );
  const Movable = require( 'BEERS_LAW_LAB/common/model/Movable' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ShakerIO = require( 'BEERS_LAW_LAB/concentration/model/ShakerIO' );

  class Shaker extends Movable {

    /**
     * @param {Vector2} position
     * @param {number} orientation in radians
     * @param {Bounds2} dragBounds
     * @param {Property.<Solute>} soluteProperty
     * @param {number} maxDispensingRate
     * @param {boolean} visible
     * @param {Object} [options]
     */
    constructor( position, dragBounds, orientation, soluteProperty, maxDispensingRate, visible, options ) {

      options = merge( {
        phetioType: ShakerIO
      }, options );

      super( position, dragBounds, options );

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
      const observer = () => {
        if ( this.emptyProperty.get() || !this.visibleProperty.get() ) {
          this.dispensingRateProperty.set( 0 );
        }
      };
      this.emptyProperty.link( observer );
      this.visibleProperty.link( observer );
    }

    // @public @override
    reset() {
      super.reset();
      this.visibleProperty.reset();
      this.emptyProperty.reset();
      this.dispensingRateProperty.reset();
      this.previousPosition = this.positionProperty.get(); // to prevent shaker from dispensing solute when its position is reset
    }

    // @public Sets the dispensing rate if the shaker is moving.
    step() {
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
  }

  return beersLawLab.register( 'Shaker', Shaker );
} );