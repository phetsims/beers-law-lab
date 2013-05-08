// Copyright 2002-2013, University of Colorado

/**
 * Visual representation of the precipitate that forms on the bottom of the beaker when the solution is saturated.
 * Manages the creation and deletion of precipitate particle nodes.
 * Origin is at bottom center of the beaker.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var ParticleNode = require( "concentration/view/ParticleNode" );

  /**
   * @param {Precipitate} precipitate
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function PrecipitateNode( precipitate, beaker, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.translation = beaker.location;

    precipitate.registerParticleAddedCallback( function( particle ) {
      thisNode.addChild( new ParticleNode( particle, mvt ) );
    } );

    precipitate.registerParticleRemovedCallback( function( particle ) {
      //TODO this is inefficient, keep a map of particles to nodes?
      var children = thisNode.getChildren();
      for ( var i = 0; i < children.length; i++ ) {
        if ( children[i].particle === particle ) {
          thisNode.removeChild( children[i] );
          break;
        }
      }
    } );
  }

  inherit( PrecipitateNode, Node );

  return PrecipitateNode;
} );