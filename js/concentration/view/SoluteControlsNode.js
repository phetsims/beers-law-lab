// Copyright 2002-2013, University of Colorado

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var PanelNode = require( "SUN/PanelNode" );
  var SoluteComboBoxNode = require( "concentration/view/SoluteComboBoxNode" );
  var SoluteFormNode = require( "concentration/view/SoluteFormNode" );

  /**
   * @param {Array} solutes (of type Solute)
   * @param {Property} currentSolute (of type Solute)
   * @param {Shaker} shaker
   * @param {Dropper} dropper
   * @constructor
   */
  function SoluteControlsNode( solutes, currentSolute, shaker, dropper ) {

    var thisNode = this;

    // solute combo box
    var soluteComboBox = new SoluteComboBoxNode( solutes, currentSolute );

    // radio buttons for solid vs solution
    var soluteFormNode = new SoluteFormNode( shaker, dropper );

    var contentNode = new Node();
    contentNode.addChild( soluteFormNode );
    contentNode.addChild( soluteComboBox ); // add last, so that dropdown is on top

    // layout
    soluteFormNode.left = soluteComboBox.left;
    soluteFormNode.top = soluteComboBox.bottom + 20;

    PanelNode.call( thisNode, contentNode,
                    { xMargin: 20, yMargin: 20, fill: "#F0F0F0", stroke: "gray", lineWidth: 1 } );
  }

  inherit( SoluteControlsNode, PanelNode );

  return SoluteControlsNode;
} );