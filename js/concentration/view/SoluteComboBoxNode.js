// Copyright 2002-2013, University of Colorado

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var ComboBoxItem = require( "common/view/ComboBoxItem" );
  var ComboBoxNode = require( "common/view/ComboBoxNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * An item in the combo box.
   * @param solute
   * @constructor
   */
  function Item( solute ) {

    // node
    var node = new Node();
    var colorNode = new Rectangle( 0, 0, 20, 20, { fill: solute.colorScheme.maxColor.toCSS(), stroke: solute.colorScheme.maxColor.darker().toCSS() } );
    var textNode = new Text( solute.name, { font: "20px Arial" } );
    node.addChild( colorNode );
    node.addChild( textNode );
    textNode.left = colorNode.right + 5;
    textNode.centerY = colorNode.centerY;

    ComboBoxItem.call( this, node, solute );
  }

  inherit( Item, ComboBoxItem );

  /**
   * @param {Array} solutes (of type Solute)
   * @param {Property} selectedSolute (of type Solute)
   * @constructor
   */
  function SoluteComboBoxNode( solutes, selectedSolute ) {

    var items = new Array();
    for ( var i = 0; i < solutes.length; i++ ) {
      var solute = solutes[i];
      items[i] = new Item( solute );
    }

    ComboBoxNode.call( this, items, selectedSolute, { listPosition: "below" } );
  }

  inherit( SoluteComboBoxNode, ComboBoxNode );

  return SoluteComboBoxNode;
} );