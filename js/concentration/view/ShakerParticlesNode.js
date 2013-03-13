// Copyright 2002-2013, University of Colorado

/**
 * Manages the solid solute particles as they travel between the shaker and their inevitable demise in the beaker.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Node = require( "SCENERY/nodes/Node" );
  var ParticleNode = require( "concentration/view/ParticleNode" );

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
} );