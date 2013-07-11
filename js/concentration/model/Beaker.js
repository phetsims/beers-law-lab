// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  'use strict';

  /**
   * Constructor
   * @param {Vector2} location bottom center
   * @param {Dimension2} size
   * @param {Number} volume in liters (L)
   * @constructor
   */
  function Beaker( location, size, volume ) {
    this.location = location;
    this.size = size;
    this.volume = volume;
  }

  Beaker.prototype = {

    reset: function() {
      // currently nothing to reset
    },

    // Gets the x-coordinate of the left wall.
    getLeft: function() {
      return this.location.x - ( this.size.width / 2 );
    },

    // Gets the x-coordinate of the right wall.
    getRight: function() {
      return this.location.x + ( this.size.width / 2 );
    }
  };

  return Beaker;
} );