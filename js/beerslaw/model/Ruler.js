// Copyright 2002-2013, University of Colorado

/**
 * Ruler model, to take advantage of location reset.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Movable = require( "common/model/Movable" );

  /**
   * @param length  // cm, must be integer units
   * @param insets  // cm, the horizontal insets at the ends of the ruler
   * @param height  // cm
   * @param location
   * @param dragBounds
   * @constructor
   */
  function Ruler( length, insets, height, location, dragBounds ) {

    var thisRuler = this;
    Movable.call( thisRuler, location, dragBounds );

    this.length = length;
    this.insets = insets;
    this.height = height;
  }

  inherit( Ruler, Movable );

  return Ruler;
} );