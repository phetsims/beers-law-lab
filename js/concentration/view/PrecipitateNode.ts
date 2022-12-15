// Copyright 2020-2022, University of Colorado Boulder

/**
 * PrecipitateNode displays precipitate at the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import beersLawLab from '../../beersLawLab.js';
import PrecipitateParticles from '../model/PrecipitateParticles.js';
import ParticlesNode from './ParticlesNode.js';

export default class PrecipitateNode extends ParticlesNode {

  public constructor( precipitate: PrecipitateParticles, modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2 ) {
    super( precipitate, modelViewTransform, canvasBounds );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'PrecipitateNode', PrecipitateNode );