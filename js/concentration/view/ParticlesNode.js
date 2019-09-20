// Copyright 2013-2019, University of Colorado Boulder

/**
 * Draws particles directly to canvas for performance.
 * Used for drawing particles that fall out of the shaker, and for precipitate on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jonathan Olson
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Particles} particles a collection of particle
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function ParticlesNode( particles, modelViewTransform, canvasBounds ) {

    const self = this;

    this.particles = particles;  // @public
    this.modelViewTransform = modelViewTransform; // @public

    CanvasNode.call( this, { pickable: false, canvasBounds: canvasBounds } );

    particles.addChangedListener( function() {
      self.invalidatePaint();
    } );
  }

  beersLawLab.register( 'ParticlesNode', ParticlesNode );

  return inherit( CanvasNode, ParticlesNode, {

    /**
     * @param {CanvasRenderingContext2D} context
     * @override
     * @public
     */
    paintCanvas: function( context ) {

      const particles = this.particles.particles;
      let halfViewSize;
      const numberOfParticles = particles.length;

      // Set and compute static properties that should be shared by all of the particles, and start the path.
      // Assumes that all particles are the same color and size.
      if ( numberOfParticles > 0 ) {
        context.fillStyle = particles[ 0 ].color.getCanvasStyle();
        context.strokeStyle = particles[ 0 ].color.darkerColor().getCanvasStyle();
        context.lineWidth = 1;
        halfViewSize = this.modelViewTransform.modelToViewDeltaX( particles[ 0 ].size ) * Math.SQRT2 / 2;
        context.beginPath();
      }

      // draw into one big path
      for ( let i = 0; i < numberOfParticles; i++ ) {
        const particle = particles[ i ];

        const position = this.modelViewTransform.modelToViewPosition( particle.locationProperty.get() );
        const x = position.x;
        const y = position.y;
        const cos = Math.cos( particle.orientation ) * halfViewSize;
        const sin = Math.sin( particle.orientation ) * halfViewSize;
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
