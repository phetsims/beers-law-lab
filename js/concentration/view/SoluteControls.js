// Copyright 2002-2013, University of Colorado Boulder

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
  var SoluteComboBox = require( "concentration/view/SoluteComboBox" );
  var SoluteFormNode = require( "concentration/view/SoluteFormNode" );

  /**
   * @param {Array<Solute>} solutes
   * @param {Property<Solute>} currentSolute
   * @param {Shaker} shaker
   * @param {Dropper} dropper
   * @param {Node} soluteListParent
   * @constructor
   */
  function SoluteControlsNode( solutes, currentSolute, shaker, dropper, soluteListParent ) {

    var thisNode = this;

    // solute combo box
    var soluteComboBox = new SoluteComboBox( solutes, currentSolute, soluteListParent );

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

  inherit( PanelNode, SoluteControlsNode );

  return SoluteControlsNode;
} );