// Copyright 2002-2013, University of Colorado

/**
 * Function for doing a linear mapping between ranges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function () {
  "use strict";

  /**
   * @param {Range} range1
   * @param {Range} range2
   * @constructor
   */
  function LinearFunction( range1, range2 ) {

    var thisFunction = this;

    // Maps from range1 to range2.
    thisFunction.evaluate = function ( value ) {
      var output = -range1.min + value;
      output = output * range2.getLength() / range1.getLength();
      output = range2.min + output;
      return output;
    };

    // Maps from range2 to range1.
    thisFunction.evaluateInverse = function ( value ) {
      return new LinearFunction( range2, range1 ).evaluate( value );
    };
  }

  return LinearFunction;

} );