// Copyright 2002-2013, University of Colorado

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var ConcentrationControlNode = require( "beerslaw/view/ConcentrationControlNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var PanelNode = require( "SUN/PanelNode" );
  var SolutionComboBox = require( "beerslaw/view/SolutionComboBox" );

  /**
   * @param {Array} solutions of type BeersLawSolution
   * @param {Property} currentSolution of type  BeersLawSolution
   * @constructor
   */
  function SolutionControlsNode( solutions, currentSolution ) {

    var thisNode = this;

    // nodes
    var comboBox = new SolutionComboBox( solutions, currentSolution );
    var concentrationControlNode = new ConcentrationControlNode( currentSolution );
    var contentNode = new Node();

    // rendering order
    contentNode.addChild( concentrationControlNode );
    contentNode.addChild( comboBox ); //TODO combo box on top!

    // layout
    concentrationControlNode.left = comboBox.left;
    concentrationControlNode.top = comboBox.bottom + 20;

    PanelNode.call( thisNode, contentNode,
                    { xMargin: 20, yMargin: 20, fill: "#F0F0F0", stroke: "gray", lineWidth: 1 } );
  }

  inherit( SolutionControlsNode, PanelNode );

  return SolutionControlsNode;
} );