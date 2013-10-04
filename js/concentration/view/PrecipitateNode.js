// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of the precipitate that forms on the bottom of the beaker when the solution is saturated.
 * Manages the creation and deletion of precipitate particle nodes.
 * Origin is at bottom center of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ParticleNode = require( 'BEERS_LAW_LAB/concentration/view/ParticleNode' );

  /**
   * @param {Precipitate} precipitate
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function PrecipitateNode( precipitate, mvt ) {

    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    var particlesParent = new Node();
    thisNode.addChild( particlesParent );

    /**
     * NOTE: To optimize performance, this algorithm assumes that Precipitate
     * adds/removes particles from the end of its 'particles' array. See #48.
     */
    precipitate.registerChangedCallback( function( precipitate ) {
      var numberOfParticles = precipitate.particles.length;
      var numberOfNodes = particlesParent.getChildrenCount();
      if ( numberOfParticles === numberOfNodes ) {
        return;
      }
      else if ( numberOfParticles === 0 ) {
        particlesParent.removeAllChildren();
      }
      else if ( numberOfParticles > numberOfNodes ) {
        // add nodes
        var index = particlesParent.getChildrenCount();
        while ( index < numberOfParticles ) {
          particlesParent.addChild( new ParticleNode( precipitate.particles[index], mvt ) );
          index++;
        }
      }
      else {
        // remove nodes
        while ( particlesParent.getChildrenCount() > numberOfParticles ) {
          particlesParent.removeChildAt( particlesParent.getChildrenCount() - 1 );
        }
      }
    } );
  }

  return inherit( Node, PrecipitateNode );
} );
