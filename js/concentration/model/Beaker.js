// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import beersLawLab from '../../beersLawLab.js';

class Beaker {

  /**
   * @param {Vector2} position bottom center
   * @param {Dimension2} size
   * @param {number} volume in liters (L)
   */
  constructor( position, size, volume ) {

    // @public (read-only)
    this.position = position;
    this.size = size;
    this.volume = volume;
  }

  // @public
  reset() {
    // currently nothing to reset
  }

  // @public Gets the x-coordinate of the left wall.
  getLeft() {
    return this.position.x - ( this.size.width / 2 );
  }

  // @public Gets the x-coordinate of the right wall.
  getRight() {
    return this.position.x + ( this.size.width / 2 );
  }
}

beersLawLab.register( 'Beaker', Beaker );
export default Beaker;