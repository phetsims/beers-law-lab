// Copyright 2002-2013, University of Colorado

/**
 * A drag handler for something that is movable and constrained to some bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Vector2 = require( "DOT/Vector2" );

  /**
   * @param {Movable} movable
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function MovableDragHandler( movable, mvt ) {

    var startOffset; // where the drag started, relative to the movable's origin, in global view coordinates
    var dragBounds = mvt.modelToViewBounds( movable.dragBounds ); // drag bounds in global view coordinates

    SimpleDragHandler.call( this, {

      // note where the drag started
      start: function( event ) {
        var originGlobal = mvt.modelToViewPosition( movable.location.get() );
        startOffset = event.pointer.point.minus( originGlobal );
      },

      // adjust for starting offset, and constrain to drag bounds
      drag: function( event ) {
        var location = event.pointer.point.minus( startOffset );
        if ( dragBounds.containsPoint( location ) ) {
           movable.location.set( mvt.viewToModelPosition( location ) );
        }
      },

      translate: function( options ) {
        // override default behavior, do nothing
      }
    } );
  }

  inherit( MovableDragHandler, SimpleDragHandler );

  /**
   * Constrains a point to some bounds.
   * @param {Vector2} point
   * @param {Bounds2} bounds
   */
  MovableDragHandler.prototype.constrainBounds = function( point, bounds ) {
    if ( _.isUndefined( bounds ) || bounds.containsCoordinates( point.x, point.y ) ) {
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
