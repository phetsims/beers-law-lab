// Copyright 2002-2013, University of Colorado

/**
 * A drag handler for something that is movable and constrained to some bounds.
 * All values herein are in the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Vector2 = require( "DOT/Vector2" );

  function MovableDragHandler( movable, mvt ) {
    var thisHandler = this;
    SimpleDragHandler.call( this, {
      translate: function ( options ) {
        var pModel = mvt.viewToModel( new Vector2( options.position.x, options.position.y ) );
        var pModelConstrained = thisHandler.constrainBounds( pModel, movable.dragBounds );
        movable.location.set( pModelConstrained );
      }
    } );
  }

  inherit( MovableDragHandler, SimpleDragHandler );

  //XXX this functionality will be absorbed into scenery
  /**
   * Constrains a point to some bounds.
   * @param {Vector2} point
   * @param {Bounds2} bounds
   */
  MovableDragHandler.prototype.constrainBounds = function ( point, bounds ) {
    if ( bounds === undefined || bounds.containsCoordinates( point.x, point.y ) ) {
      return point;
    }
    else {
      var xConstrained = Math.max( Math.min( point.x, bounds.getMaxX() ), bounds.x );
      var yConstrained = Math.max( Math.min( point.y, bounds.getMaxY() ), bounds.y );
      return new Vector2( xConstrained, yConstrained );
    }
  };

  return MovableDragHandler;
} );
