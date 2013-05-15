// Copyright 2002-2013, University of Colorado

/**
 * Ruler model, to take advantage of location reset.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var inherit = require( "PHET_CORE/inherit" );
  var Movable = require( "common/model/Movable" );

  /**
   * @param {Number} length cm, must be integer units
   * @param {Number} insets cm, the horizontal insets at the ends of the ruler
   * @param {Number} height cm
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @constructor
   */
  function Ruler( length, insets, height, location, dragBounds ) {

    assert && assert( length % 1 === 0 ); // length is an integer

    var thisRuler = this;
    Movable.call( thisRuler, location, dragBounds );

    this.length = length;
    this.insets = insets;
    this.height = height;
  }

  inherit( Ruler, Movable );

  return Ruler;
} );