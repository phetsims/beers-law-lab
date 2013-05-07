// Copyright 2002-2013, University of Colorado

/**
 * RGBA color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var StringUtils = require( "common/util/StringUtils" );

  /**
   * Constructor.
   * @param r red color component, 0-255
   * @param g green color component, 0-255
   * @param b blue color component, 0-255
   * @param a alpha color component, 0-1, optional (defaults to 1)
   * @constructor
   */
  function Color( r, g, b, a ) {
    //TODO validate args
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a || 1;
  }

  Color.prototype.toString = function() {
    return "Color[r:" + this.r + " g:" + this.g + " b:" + this.b + " a:" + this.a + ")";
  };

  // Gets a CSS-compatible color string.
  Color.prototype.toCSS = function() {
    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  };

  /**
   * Interpolates between 2 colors in RGBA space. When distance is 0, color1
   * is returned. When distance is 1, color2 is returned. Other values of
   * distance return a color somewhere between color1 and color2. Each color
   * component is interpolated separately.
   *
   * @param {Color} color1
   * @param {Color} color2
   * @param {Number} distance distance between color1 and color2, 0 <= distance <= 1
   */
  Color.interpolateRBGA = function( color1, color2, distance ) {
    //TODO validate distance
    var r = Math.round( Color.interpolate( color1.r, color2.r, distance ) );
    var g = Math.round( Color.interpolate( color1.g, color2.g, distance ) );
    var b = Math.round( Color.interpolate( color1.b, color2.b, distance ) );
    var a = Color.interpolate( color1.a, color2.a, distance );
    return new Color( r, g, b, a );
  };

  /*
   * Interpolates between 2 numbers.
   * @param {Number} number1
   * @param {Number} number2
   * @param {Number} distance distance between number1 and number2, 0 <= distance <= 1
   * @return value, such that number1 <= value <= number2
   */
  Color.interpolate = function( number1, number2, distance ) {
    //TODO validate distance
    return number1 + ( distance * ( number2 - number1 ) );
  };

  Color.prototype.darker = function( color ) {
    var FACTOR = 0.7;
    return new Color( Math.max( Math.round( this.r * FACTOR ), 0 ),
                      Math.max( Math.round( this.g * FACTOR ), 0 ),
                      Math.max( Math.round( this.b * FACTOR ), 0 ),
                      this.a );
  };

  Color.prototype.brighter = function( color ) {
    var FACTOR = 0.7;
    return new Color( Math.min( Math.round( this.r / FACTOR ), 255 ),
                      Math.min( Math.round( this.g / FACTOR ), 255 ),
                      Math.min( Math.round( this.b / FACTOR ), 255 ),
                      this.a );
  };

  Color.withAlpha = function( color, alpha ) {
    return new Color( color.r, color.g, color.b, alpha );
  };

  // Common opaque colors
  Color.BLACK = new Color( 0, 0, 0 );
  Color.BLUE = new Color( 0, 0, 255 );
  Color.CYAN = new Color( 0, 255, 255 );
  Color.DARK_GRAY = new Color( 64, 64, 64 );
  Color.GRAY = new Color( 128, 128, 128 );
  Color.GREEN = new Color( 0, 255, 0 );
  Color.LIGHT_GRAY = new Color( 192, 192, 192 );
  Color.MAGENTA = new Color( 255, 0, 255 );
  Color.ORANGE = new Color( 255, 200, 0 );
  Color.PINK = new Color( 255, 175, 175 );
  Color.RED = new Color( 255, 0, 0 );
  Color.WHITE = new Color( 255, 255, 255 );
  Color.YELLOW = new Color( 255, 255, 0 );

  return Color;
} );
