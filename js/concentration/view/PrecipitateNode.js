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

  // modules
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ParticleNode = require( 'BEERS_LAW_LAB/concentration/view/ParticleNode' );

  /**
   * @param {Precipitate} precipitate
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function PrecipitateNode( precipitate, modelViewTransform, canvasBounds ) {

    var thisNode = this;

    this.precipitate = precipitate;
    this.modelViewTransform = modelViewTransform;

    CanvasNode.call( thisNode, { pickable: false, canvasBounds: canvasBounds } );

    var particlesParent = new Node();
    thisNode.addChild( particlesParent );

    // trigger a repaint when the precipitate changes
    precipitate.registerChangedCallback( function( precipitate ) {
      thisNode.invalidatePaint();
    } );
  }

  return inherit( CanvasNode, PrecipitateNode, {

    /**
     * @override
     * @param {CanvasContextWrapper} wrapper
     */
    paintCanvas: function( wrapper ) {
      var context = wrapper.context;

      var particles = this.precipitate.particles;
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
