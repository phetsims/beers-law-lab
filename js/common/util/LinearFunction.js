// Copyright 2002-2013, University of Colorado

/**
 * Function for doing a linear mapping between two domains ('a' and 'b').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Util = require( "DOT/Util" );

  /**
   * @param {Number} a1
   * @param {Number} b1
   * @param {Number} a2
   * @param {Number} b2
   * @param {Boolean} clamp clamp the result to the provided ranges
   * @constructor
   */
  function LinearFunction( a1, b1, a2, b2, clamp ) {

    clamp = _.isUndefined( clamp ) ? false : clamp;

    var thisFunction = this;

    // Maps from a to b.
    thisFunction.evaluate = function( a3 ) {
      var b3 = Util.linear( a1, b1, a2, b2, a3 );
      if ( clamp ) {
        var max = Math.max( b1, b2 );
        var min = Math.min( b1, b2 );
        b3 = Util.clamp( b3, min, max );
      }
      return b3;
    };

    // Maps from b to a.
    thisFunction.inverse = function( b3 ) {
      return new LinearFunction( b1, a1, b2, a2, clamp ).evaluate( b3 );
    };
  }

  return LinearFunction;

} );