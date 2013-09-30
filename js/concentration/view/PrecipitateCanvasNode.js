// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of the precipitate that forms on the bottom of the beaker when the solution is saturated.
 * Manages the creation and deletion of precipitate particle nodes.
 * Origin is at bottom center of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Precipitate} precipitate
   * @param {ModelViewTransform2} mvt
   * @param {Beaker} beaker
   * @constructor
   */
  function PrecipitateNode( precipitate, mvt, beaker ) {

    var thisNode = this;

    thisNode.precipitate = precipitate;
    thisNode.mvt = mvt;

    // Bottom 1/5 of the beaker (smaller for speed)
    var modelBounds = new Bounds2( beaker.getLeft(), beaker.location.y - (0.2 * beaker.size.height), beaker.getRight(), beaker.location.y );
    var viewBounds = mvt.modelToViewBounds( modelBounds );

    // Initialize with a self-bounds of activeBounds
    CanvasNode.call( thisNode, { pickable: false, canvasBounds: viewBounds } );

    // if during a step we change, then trigger a repaint
    precipitate.registerChangedCallback( function() {
      thisNode.invalidatePaint();
    } );
  }

  return inherit( CanvasNode, PrecipitateNode, {

    // @param {CanvasContextWrapper} wrapper
    paintCanvas: function( wrapper ) {
      var context = wrapper.context;

      var particles = this.precipitate.particles;
      var halfViewSize;
      var length = particles.length;

      // Set and compute static properties that should be shared by all of the particles, and start the path.
      // Assumes that all particles are the same color and size.
      if ( length ) {
        wrapper.setFillStyle( particles[0].color );
        wrapper.setStrokeStyle( particles[0].color.darkerColor() );
        wrapper.setLineWidth( 1 );
        halfViewSize = this.mvt.modelToViewDeltaX( particles[0].size ) * Math.SQRT2 / 2;
        context.beginPath();
      }

      // draw into one big path
      for ( var i = 0; i < length; i++ ) {
        var particle = particles[i];

        var position = this.mvt.modelToViewPosition( particle.location.get() );
        var x = position.x;
        var y = position.y;
        var cos = Math.cos( particle.orientation ) * halfViewSize;
        var sin = Math.sin( particle.orientation ) * halfViewSize;
        context.moveTo( x + cos, y + sin );
        context.lineTo( x - sin, y + cos );
        context.lineTo( x - cos, y - sin );
        context.lineTo( x + sin, y - cos );
        context.closePath();
      }

      // fill and stroke the entire path
      if ( length ) {
        context.fill();
        context.stroke();
      }
    }
  } );
} );
