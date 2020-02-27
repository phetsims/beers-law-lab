// Copyright 2013-2020, University of Colorado Boulder

/**
 * Range for a color, with interpolation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Color from '../../../../scenery/js/util/Color.js';
import beersLawLab from '../../beersLawLab.js';

class ColorRange {

  /**
   * @param {Color} min
   * @param {Color} max
   */
  constructor( min, max ) {

    // @public (read-only)
    this.min = min;
    this.max = max;
  }

  /**
   * Performs a linear interpolation between min and max colors in RGBA colorspace.
   *
   * @param {number} distance 0-1 (0=min, 1=max)
   * @returns {Color}
   * @public
   */
  interpolateLinear( distance ) {
    assert && assert( distance >= 0 && distance <= 1 );
    return Color.interpolateRGBA( this.min, this.max, distance );
  }
}

beersLawLab.register( 'ColorRange', ColorRange );
export default ColorRange;