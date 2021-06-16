[object Promise]

/**
 * Beaker is the model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import beersLawLab from '../../beersLawLab.js';

class Beaker {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      position: Vector2.ZERO,
      size: new Dimension2( 600, 300 ),
      volume: 1
    }, options );

    // @public (read-only)
    this.position = options.position;
    this.size = options.size;
    this.volume = options.volume;
  }

  // @public @returns {number} Gets the x-coordinate of the left wall.
  getLeft() {
    return this.position.x - ( this.size.width / 2 );
  }

  // @public @returns {number} Gets the x-coordinate of the right wall.
  getRight() {
    return this.position.x + ( this.size.width / 2 );
  }
}

beersLawLab.register( 'Beaker', Beaker );
export default Beaker;