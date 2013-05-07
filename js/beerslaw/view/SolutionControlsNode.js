// Copyright 2002-2013, University of Colorado

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var ConcentrationControlNode = require( "beerslaw/view/ConcentrationControlNode" );
  var ControlPanelNode = require( "common/view/ControlPanelNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var SolutionComboBoxNode = require( "beerslaw/view/SolutionComboBoxNode" );

  /**
   * @param {Array} solutions of type BeersLawSolution
   * @param {Property} currentSolution of type  BeersLawSolution
   * @constructor
   */
  function SolutionControlsNode( solutions, currentSolution ) {

    var thisNode = this;

    // nodes
    var comboBox = new SolutionComboBoxNode( solutions, currentSolution );
    var concentrationControlNode = new ConcentrationControlNode( currentSolution );
    var contentNode = new Node();

    // rendering order
    contentNode.addChild( concentrationControlNode );
    contentNode.addChild( comboBox ); //TODO combo box on top!

    // layout
    concentrationControlNode.left = comboBox.left;
    concentrationControlNode.top = comboBox.bottom + 20;

    ControlPanelNode.call( thisNode, contentNode, 20, 20 );
  }

  inherit( SolutionControlsNode, ControlPanelNode );

  return SolutionControlsNode;
} );