// Copyright 2013-2021, University of Colorado Boulder

/**
 * ParticlesNode is the base class for drawing a system of  particles. It draws directly to canvas for performance.
 * It's use for drawing particles that fall out of the shaker, and for precipitate on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jonathan Olson
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import beersLawLab from '../../beersLawLab.js';

class ParticlesNode extends CanvasNode {

  /**
   * @param {PhetioGroup} particlesGroup
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} canvasBounds
   */
  constructor( particlesGroup, modelViewTransform, canvasBounds ) {
    assert && assert( particlesGroup instanceof PhetioGroup );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    super( {
      pickable: false,
      canvasBounds: canvasBounds
    } );

    // @public
    this.particlesGroup = particlesGroup;

    // @private
    this.modelViewTransform = modelViewTransform;

    // If particles are added or removed, then redraw.
    particlesGroup.elementCreatedEmitter.addListener( () => this.invalidatePaint() );
    particlesGroup.elementDisposedEmitter.addListener( () => this.invalidatePaint() );
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @override
   * @public
   */
  paintCanvas( context ) {

    const particles = this.particlesGroup.getArray();
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

      const position = this.modelViewTransform.modelToViewPosition( particle.positionProperty.value );
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
}

beersLawLab.register( 'ParticlesNode', ParticlesNode );
export default ParticlesNode;