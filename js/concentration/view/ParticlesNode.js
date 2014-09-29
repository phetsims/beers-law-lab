// Copyright 2002-20144, University of Colorado Boulder

/**
 * Draws particles directly to canvas for performance.
 * Used for drawing particles that fall out of the shaker, and for precipitate on the bottom of the beaker.
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
   * @param { particles: [Particle], registerChangedCallback: {function} } modelElement model element that has particles
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function ParticlesNode( modelElement, modelViewTransform, canvasBounds ) {

    var thisNode = this;

    thisNode.modelElement = modelElement;
    thisNode.modelViewTransform = modelViewTransform;

    CanvasNode.call( thisNode, { pickable: false, canvasBounds: canvasBounds } );

    modelElement.registerChangedCallback( function() {
      thisNode.invalidatePaint();
    } );
  }

  return inherit( CanvasNode, ParticlesNode, {

    /**
     * @override
     * @param {CanvasContextWrapper} wrapper
     */
    paintCanvas: function( wrapper ) {

      var context = wrapper.context;

      var particles = this.modelElement.particles;
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
