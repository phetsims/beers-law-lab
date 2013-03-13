// Copyright 2002-2013, University of Colorado

/**
 * Manages the solid solute particles as they travel between the shaker and their inevitable demise in the beaker.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define(
  [
    "PHETCOMMON/util/Inheritance",
    "SCENERY/nodes/Node",
    "concentration/view/ParticleNode"
  ],
  function ( Inheritance, Node, ParticleNode ) {

    /**
     * @param {ShakerParticles} shakerParticles
     * @constructor
     */
    function ShakerParticlesNode( shakerParticles ) {

      var thisNode = this;

      Node.call( thisNode );

      shakerParticles.registerParticleAddedCallback( function ( particle ) {
        thisNode.addChild( new ParticleNode( particle ) );
      } );

      shakerParticles.registerParticleRemovedCallback( function ( particle ) {
        //TODO this is inefficient, keep a map of particles to nodes?
        var children = thisNode.getChildren();
        for ( var i = 0; i < children.length; i++ ) {
          if ( children[i].particle == particle ) {
            thisNode.removeChild( children[i] );
            break;
          }
        }
      } );
    }

    Inheritance.inheritPrototype( ShakerParticlesNode, Node );

    return ShakerParticlesNode;
  }
);