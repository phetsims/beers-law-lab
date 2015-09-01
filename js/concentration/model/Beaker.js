// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Constructor
   * @param {Vector2} location bottom center
   * @param {Dimension2} size
   * @param {number} volume in liters (L)
   * @constructor
   */
  function Beaker( location, size, volume ) {

    // @public (read-only)
    this.location = location;
    this.size = size;
    this.volume = volume;
  }

  return inherit( Object, Beaker, {

    // @public
    reset: function() {
      // currently nothing to reset
    },

    // @public Gets the x-coordinate of the left wall.
    getLeft: function() {
      return this.location.x - ( this.size.width / 2 );
    },

    // @public Gets the x-coordinate of the right wall.
    getRight: function() {
      return this.location.x + ( this.size.width / 2 );
    }
  } );
} );