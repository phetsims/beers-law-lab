// Copyright 2013-2018, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {Object} [options]
   * @constructor
   */
  function Movable( location, dragBounds, options ) {

    options = _.extend( {
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
