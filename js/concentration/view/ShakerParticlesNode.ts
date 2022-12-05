// Copyright 2020-2022, University of Colorado Boulder

/**
 * ShakerParticlesNode displays particles that come out of the shaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import beersLawLab from '../../beersLawLab.js';
import ShakerParticles from '../model/ShakerParticles.js';
import ParticlesNode from './ParticlesNode.js';

export default class ShakerParticlesNode extends ParticlesNode {

  public constructor( shakerParticles: ShakerParticles, modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2 ) {

    super( shakerParticles, modelViewTransform, canvasBounds );

    // If particles move, then redraw.
    shakerParticles.particlesMovedEmitter.addListener( this.invalidatePaint.bind( this ) );
  }
}

beersLawLab.register( 'ShakerParticlesNode', ShakerParticlesNode );