// Copyright 2002-2013, University of Colorado

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var BLLStrings = require( "common/BLLStrings" );
  var ComboBoxItem = require( "common/view/ComboBoxItem" );
  var ComboBox = require( "common/view/ComboBox" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var StringUtils = require( "common/util/StringUtils" );
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
  function SoluteComboBox( solutes, selectedSolute ) {

    // "Solute" label
    var labelNode = new Text( StringUtils.format( BLLStrings.pattern_0label, [ BLLStrings.solute ] ), { font: "22px Arial" } );

    // items
    var items = [];
    for ( var i = 0; i < solutes.length; i++ ) {
      var solute = solutes[i];
      items[i] = new Item( solute );
    }

    ComboBox.call( this, items, selectedSolute,
                   { labelNode: labelNode,
                     listPosition: "below",
                     itemHighlightFill: "rgb(218,255,255)" } );
  }

  inherit( SoluteComboBox, ComboBox );

  return SoluteComboBox;
} );