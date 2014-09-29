// Copyright 2002-2013, University of Colorado Boulder

/**
 * Manages the solid solute particles as they travel between the shaker and their inevitable demise in the beaker.
 * Rendered directly to canvas for performance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jonathan Olson
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );

  /**
   * @param {ShakerParticles} shakerParticles
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function ShakerParticlesNode( shakerParticles, modelViewTransform, canvasBounds ) {

    var thisNode = this;

    thisNode.shakerParticles = shakerParticles;
    thisNode.modelViewTransform = modelViewTransform;

    // Initialize with a self-bounds of activeBounds
    CanvasNode.call( thisNode, { pickable: false, canvasBounds: canvasBounds } );

    // if during a step we change, then trigger a repaint
    shakerParticles.registerParticleChangedCallback( function() {
      thisNode.invalidatePaint();
    } );
  }

  return inherit( CanvasNode, ShakerParticlesNode, {

    /**
     * @override
     * @param {CanvasContextWrapper} wrapper
     */
    paintCanvas: function( wrapper ) {
      var context = wrapper.context;

      var particles = this.shakerParticles.particles;
      var halfViewSize;
      var numberOfParticles = particles.length;

      // Set and compute static properties that should be shared by all of the particles, and start the path.
      // Assumes that all particles are the same color and size.
      if ( numberOfParticles > 0 ) {
        wrapper.setFillStyle( particles[0].color );
        wrapper.setStrokeStyle( particles[0].color.darkerColor() );
        wrapper.setLineWidth( 1 );
        halfViewSize = this.modelViewTransform.modelToViewDeltaX( particles[0].size ) * Math.SQRT2 / 2;
        context.beginPath();
      }

      // draw into one big path
      for ( var i = 0; i < numberOfParticles; i++ ) {
        var particle = particles[i];

        var position = this.modelViewTransform.modelToViewPosition( particle.locationProperty.get() );
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
      if ( numberOfParticles > 0 ) {
        context.fill();
        context.stroke();
      }
    }
  } );
} );
