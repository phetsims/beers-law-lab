// Copyright 2002-2013, University of Colorado

/**
 * A drag handler for something that is movable and constrained to some (optional) bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );

  /**
   * @param {Movable} movable
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function MovableDragHandler( movable, mvt ) {

    var startOffset; // where the drag started, relative to the movable's origin, in global view coordinates
    var dragBounds = movable.dragBounds ? null : mvt.modelToViewBounds( movable.dragBounds ); // drag bounds in global view coordinates

    SimpleDragHandler.call( this, {

      // note where the drag started
      start: function( event ) {
        var location = mvt.modelToViewPosition( movable.location.get() );
        startOffset = event.pointer.point.minus( location );
      },

      // change the location, adjust for starting offset, constrain to drag bounds
      drag: function( event ) {
        var location = event.pointer.point.minus( startOffset );
        if ( !dragBounds || dragBounds.containsPoint( location ) ) {
           movable.location.set( mvt.viewToModelPosition( location ) );
        }
      },

      translate: function( options ) {
        // override default behavior, do nothing
      }
    } );
  }

  inherit( MovableDragHandler, SimpleDragHandler );

  return MovableDragHandler;
} );
