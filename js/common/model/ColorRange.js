// Copyright 2013-2021, University of Colorado Boulder

/**
 * ColorRange is the range for a color, with linear interpolation in RGBA colorspace.
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
    assert && assert( min instanceof Color );
    assert && assert( max instanceof Color );

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
    assert && assert( typeof distance === 'number' );
    assert && assert( distance >= 0 && distance <= 1 );

    return Color.interpolateRGBA( this.min, this.max, distance );
  }
}

beersLawLab.register( 'ColorRange', ColorRange );
export default ColorRange;