// Copyright 2013-2015, University of Colorado Boulder

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
   * @param {Tandem} tandem
   * @constructor
   */
  function Movable( location, dragBounds, tandem ) {
    this.locationProperty = new Property( location, { tandem: tandem } ); // @public
    this.dragBounds = dragBounds; // @public (read-only)
  }

  return inherit( Object, Movable, {

    // @public
    reset: function() {
      this.locationProperty.reset();
    }
  } );
} );
