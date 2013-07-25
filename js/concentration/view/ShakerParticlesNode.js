// Copyright 2002-2013, University of Colorado Boulder

/**
 * Manages the solid solute particles as they travel between the shaker and their inevitable demise in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {ShakerParticles} shakerParticles
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ShakerParticlesNode( shakerParticles, layoutBounds, left, right, mvt ) {

    var thisNode = this;
    
    this.shakerParticles = shakerParticles;
    this.mvt = mvt;
    
    // Find an approximate minimum bounding box for our particles (smaller for speed), assumes that the MVT doesn't rotate
    var activeBounds = new Bounds2( mvt.modelToViewPosition( new Vector2( left, 0 ) ).x, layoutBounds.minY,
                                    mvt.modelToViewPosition( new Vector2( right, 0 ) ).x, layoutBounds.maxY );
    
    // Initialize with a self-bounds of activeBounds
    CanvasNode.call( thisNode, { pickable: false, canvasBounds: activeBounds } );
    
    // if during a step we change, then trigger a repaint
    shakerParticles.registerParticleChangedCallback( function() {
      thisNode.invalidatePaint();
    } );
  }

  inherit( CanvasNode, ShakerParticlesNode, {
    paintCanvas: function( wrapper ) {
      var context = wrapper.context;
      
      var particles = this.shakerParticles.particles;
      var halfViewSize;
      var length = particles.length;
      
      // set and compute static properties that should be shared by all of the particles, and start the path
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

  return ShakerParticlesNode;
} );
