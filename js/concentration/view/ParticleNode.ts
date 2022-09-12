// Copyright 2013-2021, University of Colorado Boulder

/**
 * ParticleNode is the base class for drawing a particle.
 * Origin is at the center of the particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import SoluteParticle from '../model/SoluteParticle.js';

export default class ParticleNode extends Rectangle {

  public readonly particle: SoluteParticle;

  public constructor( particle: SoluteParticle, modelViewTransform: ModelViewTransform2 ) {

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