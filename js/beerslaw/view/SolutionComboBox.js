// Copyright 2002-2013, University of Colorado

/**
 * Combo box for selecting solutions.
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
  var HTMLText = require( "SCENERY/nodes/HTMLText" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * An item in the combo box.
   * @param {BeersLawSolution} solution
   * @constructor
   */
  function Item( solution ) {

    // node
    var node = new Node();
    var colorSquare = new Rectangle( 0, 0, 20, 20, { fill: solution.saturatedColor.toCSS(), stroke: solution.saturatedColor.darkerColor().toCSS() } );
    var solutionName = new HTMLText( solution.getDisplayName(), { font: "20px Arial" } );
    node.addChild( colorSquare );
    node.addChild( solutionName );
    solutionName.left = colorSquare.right + 5;
    solutionName.centerY = colorSquare.centerY;

    ComboBoxItem.call( this, node, solution );
  }

  inherit( Item, ComboBoxItem );

  /**
   * @param {Array<BeersLawSolution>} solutions
   * @param {Property<BeersLawSolution>} selectedSolution
   * @constructor
   */
  function SolutionComboBox( solutions, selectedSolution ) {

    // "Solution" label
    var label = new Text( StringUtils.format( BLLStrings.pattern_0label, [BLLStrings.solution] ), { font: "20px Arial" } );

    // items
    var items = [];
    for ( var i = 0; i < solutions.length; i++ ) {
      var solution = solutions[i];
      items[i] = new Item( solution );
    }

    ComboBox.call( this, items, selectedSolution,
                       { labelNode: label,
                         listPosition: "above",
                         itemHighlightFill: "rgb(218,255,255)" } );
  }

  inherit( SolutionComboBox, ComboBox );

  return SolutionComboBox;
} );