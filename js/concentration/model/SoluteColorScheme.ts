// Copyright 2013-2022, University of Colorado Boulder

/**
 * Color scheme for relating concentration to color.
 * The scheme also defines the concentration range for the solute, where maxConcentration
 * is synonymous with 'saturated'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Color } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';

export default class SoluteColorScheme {

  public constructor(
    public readonly minConcentration: number, // mol/L
    public readonly minColor: Color,
    public readonly midConcentration: number, // mol/L
    public readonly midColor: Color,
    public readonly maxConcentration: number, // mol/L (saturation point)
    public readonly maxColor: Color
  ) {}

  /**
   * Converts a concentration value (in mol/L) to a Color, using a linear interpolation of RGB colors.
   */
  public concentrationToColor( concentration: number ): Color {
    if ( concentration >= this.maxConcentration ) {
      return this.maxColor;
    }
    else if ( concentration <= this.minConcentration ) {
      return this.minColor;
    }
    else if ( concentration <= this.midConcentration ) {
      return Color.interpolateRGBA( this.minColor, this.midColor,
        ( concentration - this.minConcentration ) / ( this.midConcentration - this.minConcentration ) );
    }
    else {
      return Color.interpolateRGBA( this.midColor, this.maxColor,
        ( concentration - this.midConcentration ) / ( this.maxConcentration - this.midConcentration ) );
    }
  }
}

beersLawLab.register( 'SoluteColorScheme', SoluteColorScheme );