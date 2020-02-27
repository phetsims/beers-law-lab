// Copyright 2013-2020, University of Colorado Boulder

/**
 * Base type for all particles.
 * Origin is at the center of the particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import beersLawLab from '../../beersLawLab.js';

class ParticleNode extends Rectangle {

  /**
   * @param {SoluteParticle} particle
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( particle, modelViewTransform ) {

    const viewSize = modelViewTransform.modelToViewDeltaX( particle.size );

    super( -viewSize / 2, -viewSize / 2, viewSize, viewSize, {
      fill: particle.color,
      stroke: particle.color.darkerColor(),
      lineWidth: 1
    } );

    this.particle = particle;
    this.rotation = particle.orientation;

    particle.positionProperty.link( () => {
      this.translation = modelViewTransform.modelToViewPosition( particle.positionProperty.get() );
    } );
  }
}

beersLawLab.register( 'ParticleNode', ParticleNode );
export default ParticleNode;