// Copyright 2002-2013, University of Colorado Boulder

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var ConcentrationControl = require( "beerslaw/view/ConcentrationControl" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var PanelNode = require( "SUN/PanelNode" );
  var SolutionComboBox = require( "beerslaw/view/SolutionComboBox" );

  /**
   * @param {Array<BeersLawSolution>} solutions
   * @param {Property<BeersLawSolution>} currentSolution
   * @param {Node} solutionListParent
   * @constructor
   */
  function SolutionControls( solutions, currentSolution, solutionListParent ) {

    // nodes
    var comboBox = new SolutionComboBox( solutions, currentSolution, solutionListParent );
    var concentrationControl = new ConcentrationControl( currentSolution );
    var contentNode = new Node();

    // rendering order
    contentNode.addChild( concentrationControl );
    contentNode.addChild( comboBox );

    // layout
    concentrationControl.left = comboBox.left;
    concentrationControl.top = comboBox.bottom + 20;

    PanelNode.call( this, contentNode,
      { xMargin: 20, yMargin: 20, fill: "#F0F0F0", stroke: "gray", lineWidth: 1, resize: false } );
  }

  inherit( PanelNode, SolutionControls );

  return SolutionControls;
} );