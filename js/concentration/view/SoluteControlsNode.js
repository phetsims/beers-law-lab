// Copyright 2002-2013, University of Colorado

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Node = require( "SCENERY/nodes/Node" );
  var Text = require( "SCENERY/nodes/Text" );
  var ControlPanelNode = require( "common/view/ControlPanelNode" );
  var StringUtils = require( "common/util/StringUtils" );
  var SoluteFormNode = require( "concentration/view/SoluteFormNode" );

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

    // radio buttons for solid vs solution
    var soluteFormNode = new SoluteFormNode( shaker, dropper, strings );

    var contentNode = new Node();
    contentNode.addChild( soluteLabel );
    contentNode.addChild( soluteFormNode );

    // layout
    soluteFormNode.left = soluteLabel.left;
    soluteFormNode.top = soluteLabel.bottom + 20;

    ControlPanelNode.call( thisNode, contentNode, 20, 20 );
  }

  Inheritance.inheritPrototype( SoluteControlsNode, ControlPanelNode );

  return SoluteControlsNode;
} );