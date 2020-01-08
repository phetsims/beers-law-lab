// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Vector2} position bottom center
   * @param {Dimension2} size
   * @param {number} volume in liters (L)
   * @constructor
   */
  function Beaker( position, size, volume ) {

    // @public (read-only)
    this.position = position;
    this.size = size;
    this.volume = volume;
  }

  beersLawLab.register( 'Beaker', Beaker );

  return inherit( Object, Beaker, {

    // @public
    reset: function() {
      // currently nothing to reset
    },

    // @public Gets the x-coordinate of the left wall.
    getLeft: function() {
      return this.position.x - ( this.size.width / 2 );
    },

    // @public Gets the x-coordinate of the right wall.
    getRight: function() {
      return this.position.x + ( this.size.width / 2 );
    }
  } );
} );