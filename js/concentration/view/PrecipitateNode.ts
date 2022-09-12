// Copyright 2020-2021, University of Colorado Boulder

/**
 * PrecipitateNode displays precipitate at the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import beersLawLab from '../../beersLawLab.js';
import Precipitate from '../model/Precipitate.js';
import ParticlesNode from './ParticlesNode.js';

export default class PrecipitateNode extends ParticlesNode {

  public constructor( precipitate: Precipitate, modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2 ) {
    super( precipitate.particleGroup, modelViewTransform, canvasBounds );
  }
}

beersLawLab.register( 'PrecipitateNode', PrecipitateNode );