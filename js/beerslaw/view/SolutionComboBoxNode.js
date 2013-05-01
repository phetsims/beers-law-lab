// Copyright 2013, University of Colorado

/**
 * Combo box for selecting solutions.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Array} solutions of type BeersLawSolution
   * @param {Property} selectedSolution of type BeersLawSolution
   * @constructor
   */
  function SolutionComboBoxNode( solutions, selectedSolution ) {

    var thisNode = this;
    Node.call( thisNode );

    // TODO placeholder
    thisNode.addChild( new Rectangle( 0, 0, 300, 30, { stroke: 'black' } ) );
  }

  inherit( SolutionComboBoxNode, Node );

  return SolutionComboBoxNode;
} );