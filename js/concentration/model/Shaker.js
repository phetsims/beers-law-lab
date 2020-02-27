// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a shaker, contains solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import beersLawLab from '../../beersLawLab.js';
import Movable from '../../common/model/Movable.js';
import ShakerIO from './ShakerIO.js';

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

beersLawLab.register( 'Shaker', Shaker );
export default Shaker;