// Copyright 2002-2013, University of Colorado

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var ConcentrationControlNode = require( "beerslaw/view/ConcentrationControlNode" );
  var ControlPanelNode = require( "common/view/ControlPanelNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var SolutionComboBoxNode = require( "beerslaw/view/SolutionComboBoxNode" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {Array} solutions of type BeersLawSolution
   * @param {Property} currentSolution of type  BeersLawSolution
   * @constructor
   */
  function SolutionControlsNode( solutions, currentSolution ) {

    var thisNode = this;

    // nodes
    var labelNode = new Text( StringUtils.format( BLLStrings.pattern_0label, [BLLStrings.solution] ), { font: "20px Arial" } );
    var comboBox = new SolutionComboBoxNode( solutions, currentSolution );
    var concentrationControlNode = new ConcentrationControlNode( currentSolution );
    var contentNode = new Node();

    // rendering order
    contentNode.addChild( labelNode );
    contentNode.addChild( concentrationControlNode );
    contentNode.addChild( comboBox ); //TODO combo box on top!

    // layout
    comboBox.left = labelNode.right + 10;
    comboBox.centerY = labelNode.centerY;
    concentrationControlNode.left = labelNode.left;
    concentrationControlNode.top = comboBox.bottom + 20;

    ControlPanelNode.call( thisNode, contentNode, 20, 20 );
  }

  inherit( SolutionControlsNode, ControlPanelNode );

  return SolutionControlsNode;
} );