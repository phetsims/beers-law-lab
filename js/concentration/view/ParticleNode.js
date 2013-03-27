// Copyright 2002-2013, University of Colorado

/**
 * Base type for all particles.
 * Origin is at the center of the particle.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Shape = require( "KITE/Shape" );
  var Path = require( "SCENERY/nodes/Path" );

  /**
   * @param {SoluteParticle} particle
   * @param {ModelViewTransform2D} mvt
   * @constructor
   */
  function ParticleNode( particle, mvt ) {

    var thisNode = this;

    var viewSize = mvt.modelToView( particle.size );
    Path.call( thisNode, {
      shape: Shape.rect( -viewSize / 2, -viewSize / 2, viewSize, viewSize ),
      fill: particle.color.toCSS(),
      stroke: particle.color.darker().toCSS(),
      lineWidth: 1
    } );

    thisNode.particle = particle;
    thisNode.rotation = particle.orientation;

    particle.location.addObserver( function () {
      thisNode.translation = mvt.modelToView( particle.location.get() );
    } );
  }

  inherit( ParticleNode, Path );

  return ParticleNode;
} );