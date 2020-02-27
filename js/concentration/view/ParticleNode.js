// Copyright 2013-2020, University of Colorado Boulder

/**
 * Base type for all particles.
 * Origin is at the center of the particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

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

  return beersLawLab.register( 'ParticleNode', ParticleNode );
} );