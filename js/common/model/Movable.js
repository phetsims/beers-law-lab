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
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @param {Vector2} position
   * @param {Bounds2} dragBounds
   * @param {Object} [options]
   * @constructor
   */
  function Movable( position, dragBounds, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.positionProperty = new Vector2Property( position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.dragBounds = dragBounds; // @public (read-only)
  }

  beersLawLab.register( 'Movable', Movable );

  return inherit( Object, Movable, {

    // @public
    reset: function() {
      this.positionProperty.reset();
    }
  } );
} );
