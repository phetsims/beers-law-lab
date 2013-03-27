// Copyright 2002-2013, University of Colorado

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var ControlPanelNode = require( "common/view/ControlPanelNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var SoluteDropdownNode = require( "concentration/view/SoluteDropdownNode" );
  var SoluteFormNode = require( "concentration/view/SoluteFormNode" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {Array} solutes (of type Solute)
   * @param {Property} currentSolute (of type Solute)
   * @param {Shaker} shaker
   * @param {Dropper} dropper
   * @param strings
   * @constructor
   */
  function SoluteControlsNode( solutes, currentSolute, shaker, dropper, strings ) {

    var thisNode = this;

    // "Solute" label
    var text = StringUtils.format( strings.pattern_0label, [ strings.solute ] );
    var soluteLabel = new Text( text, { font: "22px Arial" });

    // solute dropdown
    var soluteDropdown = new SoluteDropdownNode( solutes, currentSolute );

    // radio buttons for solid vs solution
    var soluteFormNode = new SoluteFormNode( shaker, dropper, strings );

    var contentNode = new Node();
    contentNode.addChild( soluteLabel );
    contentNode.addChild( soluteFormNode );
    contentNode.addChild( soluteDropdown ); // add last, so that dropdown is on top

    // layout
    soluteDropdown.left = soluteLabel.right + 10;
    soluteDropdown.centerY = soluteLabel.centerY;
    soluteFormNode.left = soluteLabel.left;
    soluteFormNode.top = Math.max( soluteLabel.bottom, soluteDropdown.bottom ) + 20;

    // Use SVG renderer so that this node doesn't block events to other DOM elements in the scene.
    ControlPanelNode.call( thisNode, contentNode, 20, 20, { renderer: "svg" } );
  }

  inherit( SoluteControlsNode, ControlPanelNode );

  return SoluteControlsNode;
} );