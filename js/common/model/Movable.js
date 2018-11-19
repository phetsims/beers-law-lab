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
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Vector2IO = require( 'DOT/Vector2IO' );

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
    this.locationProperty = new Property( location, {
      tandem: options.tandem.createTandem( 'locationProperty' ),
      phetioType: PropertyIO( Vector2IO )
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
