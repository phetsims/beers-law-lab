// Copyright 2013, University of Colorado

/**
 * Control for changing solution's concentration.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Property} currentSolution of type  BeersLawSolution
   * @constructor
   */
  function ConcentrationControlNode( currentSolution ) {

    var thisNode = this;
    Node.call( thisNode );

    // TODO placeholder
    thisNode.addChild( new Rectangle( 0, 0, 400, 10, { stroke: 'black' } ) );
  }

  inherit( ConcentrationControlNode, Node );

  return ConcentrationControlNode;
} );