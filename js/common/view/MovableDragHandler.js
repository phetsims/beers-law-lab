// Copyright 2002-2013, University of Colorado

/**
 * A drag handler for something that is movable and constrained to some bounds.
 * All values herein are in the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "PHETCOMMON/math/Point2D",
    "PHETCOMMON/util/Inheritance",
    "SCENERY/input/SimpleDragHandler"
  ],
  function ( Point2D, Inheritance, SimpleDragHandler ) {

    function MovableDragHandler( movable, mvt ) {
      var dragHandler = this;
      SimpleDragHandler.call( this, {
        translate: function ( options ) {
          var pModel = mvt.viewToModel( new Point2D( options.position.x, options.position.y ) );
          var pModelConstrained = dragHandler.constrainBounds( pModel, movable.dragBounds );
          movable.locationProperty.set( pModelConstrained );
        }
      } );
    }

    Inheritance.inheritPrototype( MovableDragHandler, SimpleDragHandler );

    //XXX this functionality will be absorbed into scenery
    /**
     * Constrains a point to some bounds.
     * @param {Point2D} point
     * @param {Rectangle} bounds
     */
    MovableDragHandler.prototype.constrainBounds = function ( point, bounds ) {
      if ( bounds === undefined || bounds.contains( point.x, point.y ) ) {
        return point;
      }
      else {
        var xConstrained = Math.max( Math.min( point.x, bounds.getMaxX() ), bounds.x );
        var yConstrained = Math.max( Math.min( point.y, bounds.getMaxY() ), bounds.y );
        return new Point2D( xConstrained, yConstrained );
      }
    };

    return MovableDragHandler;
  } );
