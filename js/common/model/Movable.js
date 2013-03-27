// Copyright 2002-2013, University of Colorado

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Property = require( "PHETCOMMON/model/property/Property" );

  /**
   * Constructor
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @constructor
   */
  function Movable( location, dragBounds ) {
    this.location = new Property( location );
    this.dragBounds = dragBounds;
  }

  Movable.prototype.reset = function () {
    this.location.reset();
  };

  return Movable;
} );
