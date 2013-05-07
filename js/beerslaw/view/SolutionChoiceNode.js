// Copyright 2002-2013, University of Colorado

/**
 * Control for changing solution's concentration.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var SolutionComboBoxNode = require( "beerslaw/view/SolutionComboBoxNode" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {Array} solutions of type BeersLawSolution
   * @param {Property} currentSolution of type  BeersLawSolution
   * @constructor
   */
  function SolutionChoiceNode( solutions, currentSolution ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var labelNode = new Text( StringUtils.format( BLLStrings.pattern_0label, [BLLStrings.solution] ), { font: "20px Arial" } );
    var comboBox = new SolutionComboBoxNode( solutions, currentSolution );

    // rendering order
    thisNode.addChild( labelNode );
    thisNode.addChild( comboBox );

    // layout
    comboBox.left = labelNode.right + 5;
    comboBox.centerY = labelNode.centerY;
  }

  inherit( SolutionChoiceNode, Node );

  return SolutionChoiceNode;
} );