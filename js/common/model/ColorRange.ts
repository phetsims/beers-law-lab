// Copyright 2013-2022, University of Colorado Boulder

/**
 * ColorRange is the range for a color, with linear interpolation in RGBA colorspace.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Color } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';

export default class ColorRange {

  public readonly min: Color;
  public readonly max: Color;

  public constructor( min: Color, max: Color ) {
    this.min = min;
    this.max = max;
  }

  /**
   * Performs a linear interpolation between min and max colors in RGBA colorspace.
   */
  public interpolateLinear( distance: number ): Color {
    assert && assert( isFinite( distance ) && distance >= 0 && distance <= 1, `invalid distance: ${distance}` );

    return Color.interpolateRGBA( this.min, this.max, distance );
  }
}

beersLawLab.register( 'ColorRange', ColorRange );