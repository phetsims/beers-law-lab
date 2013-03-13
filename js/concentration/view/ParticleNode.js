// Copyright 2002-2013, University of Colorado

/**
 * Base type for all particles.
 * Origin is at the center of the particle.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define(
  [
    "PHETCOMMON/util/Inheritance",
    "KITE/Shape",
    "SCENERY/nodes/Path"
  ],
  function ( Inheritance, Shape, Path ) {
    "use strict";

    /**
     * @param {SoluteParticle} particle
     * @constructor
     */
    function ParticleNode( particle ) {

      var thisNode = this;

      Path.call(
        this,
        {
          shape: Shape.rect( -particle.size / 2, -particle.size / 2, particle.size, particle.size ),
          fill: particle.color.toCSS(),
          stroke: particle.color.darker().toCSS(),
          lineWidth: 1
        } );

      thisNode.particle = particle;
      thisNode.rotation = particle.orientation;

      particle.location.addObserver( function () {
        thisNode.translation = particle.location.get();
      } );
    }

    Inheritance.inheritPrototype( ParticleNode, Path );

    return ParticleNode;
  }
);