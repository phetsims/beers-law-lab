// Copyright 2013-2020, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';

class BLLMovable {

  /**
   * @param {Vector2} position
   * @param {Bounds2} dragBounds
   * @param {Object} [options]
   */
  constructor( position, dragBounds, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.positionProperty = new Vector2Property( position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    // @public (read-only)
    this.dragBounds = dragBounds;
  }

  // @public
  reset() {
    this.positionProperty.reset();
  }
}

beersLawLab.register( 'BLLMovable', BLLMovable );
export default BLLMovable;