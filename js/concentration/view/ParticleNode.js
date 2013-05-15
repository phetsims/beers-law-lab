// Copyright 2002-2013, University of Colorado

/**
 * Base type for all particles.
 * Origin is at the center of the particle.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {SoluteParticle} particle
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ParticleNode( particle, mvt ) {

    var thisNode = this;

    var viewSize = mvt.modelToViewDeltaX( particle.size );
    Rectangle.call( thisNode, -viewSize / 2, -viewSize / 2, viewSize, viewSize, {
      fill: particle.color.toCSS(),
      stroke: particle.color.darkerColor().toCSS(),
      lineWidth: 1
    } );

    thisNode.particle = particle;
    thisNode.rotation = particle.orientation;

    particle.location.addObserver( function() {
      thisNode.translation = mvt.modelToViewPosition( particle.location.get() );
    } );
  }

  inherit( ParticleNode, Rectangle );

  return ParticleNode;
} );