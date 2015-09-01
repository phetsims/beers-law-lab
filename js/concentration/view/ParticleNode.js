// Copyright 2002-2013, University of Colorado Boulder

/**
 * Base type for all particles.
 * Origin is at the center of the particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {SoluteParticle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ParticleNode( particle, modelViewTransform ) {

    var thisNode = this;

    var viewSize = modelViewTransform.modelToViewDeltaX( particle.size );
    Rectangle.call( thisNode, -viewSize / 2, -viewSize / 2, viewSize, viewSize, {
      fill: particle.color,
      stroke: particle.color.darkerColor(),
      lineWidth: 1
    } );

    thisNode.particle = particle; // @private
    thisNode.rotation = particle.orientation;

    particle.locationProperty.link( function() {
      thisNode.translation = modelViewTransform.modelToViewPosition( particle.locationProperty.get() );
    } );
  }

  return inherit( Rectangle, ParticleNode );
} );