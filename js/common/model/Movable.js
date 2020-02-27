// Copyright 2013-2020, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const merge = require( 'PHET_CORE/merge' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class Movable {

    /**
     * @param {Vector2} position
     * @param {Bounds2} dragBounds
     * @param {Object} [options]
     */
    constructor( position, dragBounds, options ) {

      options = merge( {
        tandem: Tandem.REQUIRED
      }, options );

      // @public
      this.positionProperty = new Vector2Property( position, {
        tandem: options.tandem.createTandem( 'positionProperty' )
      } );

      this.dragBounds = dragBounds; // @public (read-only)
    }

    // @public
    reset() {
      this.positionProperty.reset();
    }
  }

  return beersLawLab.register( 'Movable', Movable );
} );
