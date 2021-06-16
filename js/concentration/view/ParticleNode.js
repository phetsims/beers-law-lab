[object Promise]

/**
 * Base type for all particles.
 * Origin is at the center of the particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import beersLawLab from '../../beersLawLab.js';
import SoluteParticle from '../model/SoluteParticle.js';

class ParticleNode extends Rectangle {

  /**
   * @param {SoluteParticle} particle
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( particle, modelViewTransform ) {
    assert && assert( particle instanceof SoluteParticle );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    const viewSize = modelViewTransform.modelToViewDeltaX( particle.size );

    super( -viewSize / 2, -viewSize / 2, viewSize, viewSize, {
      fill: particle.color,
      stroke: particle.color.darkerColor(),
      lineWidth: 1
    } );

    this.particle = particle;
    this.rotation = particle.orientation;

    particle.positionProperty.link( () => {
      this.translation = modelViewTransform.modelToViewPosition( particle.positionProperty.value );
    } );
  }
}

beersLawLab.register( 'ParticleNode', ParticleNode );
export default ParticleNode;