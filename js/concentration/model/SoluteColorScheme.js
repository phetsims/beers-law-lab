// Copyright 2013-2017, University of Colorado Boulder

/**
 * Color scheme for relating concentration to color.
 * The scheme also defines the concentration range for the solute, where maxConcentration
 * is synonymous with 'saturated'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} minConcentration - mol/L
   * @param {Color} minColor
   * @param {number} midConcentration - mol/L
   * @param {Color} midColor
   * @param {number} maxConcentration - mol/L (saturation point)
   * @param {Color} maxColor
   * @constructor
   */
  function SoluteColorScheme( minConcentration, minColor, midConcentration, midColor, maxConcentration, maxColor ) {
    this.minColor = minColor;
    this.midColor = midColor;
    this.maxColor = maxColor;
    this.minConcentration = minConcentration;
    this.midConcentration = midConcentration;
    this.maxConcentration = maxConcentration;
  }

  beersLawLab.register( 'SoluteColorScheme', SoluteColorScheme );

  return inherit( Object, SoluteColorScheme, {

    /**
     * Converts a concentration value to a Color, using a linear interpolation of RGB colors.
     * @param {number} concentration - mol/L
     * @returns {Color} color
     */
    concentrationToColor: function( concentration ) {
      if ( concentration >= this.maxConcentration ) {
        return this.maxColor;
      }
      else if ( concentration <= this.minConcentration ) {
        return this.minColor;
      }
      else if ( concentration <= this.midConcentration ) {
        return Color.interpolateRGBA( this.minColor, this.midColor, ( concentration - this.minConcentration ) / ( this.midConcentration - this.minConcentration ) );
      }
      else {
        return Color.interpolateRGBA( this.midColor, this.maxColor, ( concentration - this.midConcentration ) / ( this.maxConcentration - this.midConcentration ) );
      }
    }
  } );
} );
