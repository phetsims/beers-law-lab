// Copyright 2013-2020, University of Colorado Boulder

/**
 * PrecipitateNode displays precipitate at the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import beersLawLab from '../../beersLawLab.js';
import ParticlesNode from './ParticlesNode.js';

class PrecipitateNode extends ParticlesNode {

  /**
   * @param {Precipitate} precipitate
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} canvasBounds
   */
  constructor( precipitate, modelViewTransform, canvasBounds ) {
    super( precipitate.particlesGroup, modelViewTransform, canvasBounds );
  }
}

beersLawLab.register( 'PrecipitateNode', PrecipitateNode );
export default PrecipitateNode;