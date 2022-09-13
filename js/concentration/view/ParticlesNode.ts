// Copyright 2013-2022, University of Colorado Boulder

/**
 * ParticlesNode is the base class for drawing a system of particles. It draws directly to canvas for performance.
 * It's use for drawing particles that fall out of the shaker, and for precipitate on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jonathan Olson
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { CanvasNode } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import PrecipitateParticleGroup from '../model/PrecipitateParticleGroup.js';
import ShakerParticleGroup from '../model/ShakerParticleGroup.js';

export default class ParticlesNode extends CanvasNode {

  public readonly particleGroup: PrecipitateParticleGroup | ShakerParticleGroup;
  private readonly modelViewTransform: ModelViewTransform2;

  public constructor( particleGroup: PrecipitateParticleGroup | ShakerParticleGroup,
                      modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2 ) {

    super( {
      pickable: false,
      canvasBounds: canvasBounds
    } );

    this.particleGroup = particleGroup;

    this.modelViewTransform = modelViewTransform;

    // If particles are added or removed, then redraw.
    particleGroup.elementCreatedEmitter.addListener( () => this.invalidatePaint() );
    particleGroup.elementDisposedEmitter.addListener( () => this.invalidatePaint() );
  }

  public paintCanvas( context: CanvasRenderingContext2D ): void {

    const particles = this.particleGroup.getArray();
    const numberOfParticles = particles.length;

    // Set and compute static properties that should be shared by all the particles, and start the path.
    // Assumes that all particles are the same color and size.
    if ( numberOfParticles > 0 ) {

      const halfViewSize = this.modelViewTransform.modelToViewDeltaX( particles[ 0 ].size ) * Math.SQRT2 / 2;

      context.fillStyle = particles[ 0 ].color.getCanvasStyle();
      context.strokeStyle = particles[ 0 ].color.darkerColor().getCanvasStyle();
      context.lineWidth = 1;

      context.beginPath();

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
      context.fill();
      context.stroke();
    }
  }
}

beersLawLab.register( 'ParticlesNode', ParticlesNode );