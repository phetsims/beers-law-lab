// Copyright 2013-2020, University of Colorado Boulder

/**
 * Ruler model, to take advantage of position reset.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import beersLawLab from '../../beersLawLab.js';
import Movable from '../../common/model/Movable.js';

class Ruler extends Movable {

  /**
   * @param {number} length cm
   * @param {number} insets cm, the horizontal insets at the ends of the ruler
   * @param {number} height cm
   * @param {Vector2} position
   * @param {Bounds2} dragBounds
   * @param {Tandem} tandem
   * @constructor
   */
  constructor( length, insets, height, position, dragBounds, tandem ) {

    super( position, dragBounds, tandem );

    // @public (read-only)
    this.length = length;
    this.insets = insets;
    this.height = height;
  }
}

beersLawLab.register( 'Ruler', Ruler );
export default Ruler;