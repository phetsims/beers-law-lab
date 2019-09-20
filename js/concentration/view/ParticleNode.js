// Copyright 2013-2019, University of Colorado Boulder

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
  const inherit = require( 'PHET_CORE/inherit' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {SoluteParticle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ParticleNode( particle, modelViewTransform ) {

    const self = this;

    const viewSize = modelViewTransform.modelToViewDeltaX( particle.size );
    Rectangle.call( this, -viewSize / 2, -viewSize / 2, viewSize, viewSize, {
      fill: particle.color,
      stroke: particle.color.darkerColor(),
      lineWidth: 1
    } );

    this.particle = particle; // @private
    this.rotation = particle.orientation;

    particle.locationProperty.link( function() {
      self.translation = modelViewTransform.modelToViewPosition( particle.locationProperty.get() );
    } );
  }

  beersLawLab.register( 'ParticleNode', ParticleNode );

  return inherit( Rectangle, ParticleNode );
} );