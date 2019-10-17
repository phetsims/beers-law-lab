// Copyright 2013-2019, University of Colorado Boulder

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
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {Object} [options]
   * @constructor
   */
  function Movable( location, dragBounds, options ) {

    options = merge( {
      tandem: Tandem.required
    }, options );

    // @public
    this.locationProperty = new Vector2Property( location, {
      tandem: options.tandem.createTandem( 'locationProperty' )
    } );

    this.dragBounds = dragBounds; // @public (read-only)
  }

  beersLawLab.register( 'Movable', Movable );

  return inherit( Object, Movable, {

    // @public
    reset: function() {
      this.locationProperty.reset();
    }
  } );
} );
