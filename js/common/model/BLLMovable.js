// Copyright 2013-2020, University of Colorado Boulder

/**
 * BLLMovable is a movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';

class BLLMovable extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      position: Vector2.ZERO,
      dragBounds: Bounds2.EVERYTHING,
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @public
    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    // @public (read-only)
    this.dragBounds = options.dragBounds;
  }

  // @public
  reset() {
    this.positionProperty.reset();
  }
}

beersLawLab.register( 'BLLMovable', BLLMovable );
export default BLLMovable;