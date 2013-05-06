// Copyright 2013, University of Colorado

/**
 * Combo box for selecting solutions.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var ComboBoxNode = require( "common/view/ComboBoxNode" );
  var HTMLText = require( "SCENERY/nodes/HTMLText" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * An item in the combo box.
   * @param solution
   * @constructor
   */
  function ItemNode( solution ) {
    var thisNode = this;
    Node.call( thisNode );
    var colorNode = new Rectangle( 0, 0, 20, 20, { fill: solution.saturatedColor.toCSS(), stroke: solution.saturatedColor.darker().toCSS() } );
    var textNode = new HTMLText( solution.getDisplayName(), { font: "20px Arial" } );
    thisNode.addChild( colorNode );
    thisNode.addChild( textNode );
    textNode.left = colorNode.right + 5;
    textNode.centerY = colorNode.centerY;
    //TODO is this an acceptable way to do associate item with its model element?
    thisNode.solution = solution;
  }

  inherit( ItemNode, Node );

  /**
   * @param {Array} solutions of type BeersLawSolution
   * @param {Property} selectedSolution of type BeersLawSolution
   * @constructor
   */
  function SolutionComboBoxNode( solutions, selectedSolution ) {

    var thisNode = this;

    var defaultItem;
    var items = new Array();
    for ( var i = 0; i < solutions.length; i++ ) {
      var solution = solutions[i];
      items[i] = new ItemNode( solution );
      if ( solution === selectedSolution.get() ) {
        defaultItem = items[i];
      }
    }

    assert && assert ( !_.isUndefined( defaultItem ) );
    var selectedItem = new Property( defaultItem );

    ComboBoxNode.call( thisNode, items, selectedItem, { listPosition: "above" } );

    // update model when combo box selection changes
    selectedItem.addObserver( function( item ) {
        selectedSolution.set( item.solution );
    });

    // change selected item when selected solution changes
    selectedSolution.addObserver( function ( solution ) {
      if ( solution !== selectedItem.get().solution ) {
        var item = null;
        for ( var i = 0; i < items.length; i++ ) {
          if ( items[i].solution === solution ) {
            item = items[i];
          }
        }
        assert && assert( item != null );
        selectedItem.set( item );
      }
    } );
  }

  inherit( SolutionComboBoxNode, ComboBoxNode );

  return SolutionComboBoxNode;
} );