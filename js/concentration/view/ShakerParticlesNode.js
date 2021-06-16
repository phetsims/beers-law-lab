// Copyright 2020-2021, University of Colorado Boulder

import beersLawLab from '../../beersLawLab.js';
import ParticlesNode from './ParticlesNode.js';

/**
 * ShakerParticlesNode displays particles that come out of the shaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
class ShakerParticlesNode extends ParticlesNode {

  /**
   * @param {ShakerParticles} shakerParticles
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} canvasBounds
   */
  constructor( shakerParticles, modelViewTransform, canvasBounds ) {

    super( shakerParticles.particlesGroup, modelViewTransform, canvasBounds );

    // If particles move, then redraw.
    shakerParticles.particlesMovedEmitter.addListener( this.invalidatePaint.bind( this ) );
  }
}

beersLawLab.register( 'ShakerParticlesNode', ShakerParticlesNode );
export default ShakerParticlesNode;