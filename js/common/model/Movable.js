// Copyright 2002-2013, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * Constructor
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {object} [options]
   * @constructor
   */
  function Movable( location, dragBounds, options ) {
    options = _.extend( {

      // Must be filled in if using together
      locationComponentID: null
    }, options );
    this.locationProperty = new Property( location );
    this.dragBounds = dragBounds;

    if ( options.locationComponentID ) {
      together && together.addComponent( options.locationComponentID, this.locationProperty );
    }
  }

  return inherit( Object, Movable, {
    reset: function() {
      this.locationProperty.reset();
    }
  } );
} );
