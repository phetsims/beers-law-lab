// Copyright 2013, University of Colorado

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var ComboBoxNode = require( "common/view/ComboBoxNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {Array} solutes (of type Solute)
   * @param {Property} selectedSolute (of type Solute)
   * @constructor
   */
  function SoluteComboBoxNode( solutes, selectedSolute ) {

    var thisNode = this;

    var defaultItem;
    var items = new Array();
    for ( var i = 0; i < solutes.length; i++ ) {
      var solute = solutes[i];
      items[i] = new Text( solute.name, { font: "20px Arial" } );
      items[i].solute = solute; //TODO is this an acceptable way to do associate item with its model element?
      if ( solute === selectedSolute.get() ) {
        defaultItem = items[i];
      }
    }

    assert && assert( !_.isUndefined( defaultItem ) );
    var selectedItem = new Property( defaultItem );

    ComboBoxNode.call( thisNode, items, selectedItem, { listPosition: "below" } );

    // update model when combo box selection changes
    selectedItem.addObserver( function ( item ) {
      selectedSolute.set( item.solute );
    } );

    // change selected item when selected solute changes
    selectedSolute.addObserver( function ( solute ) {
      if ( solute !== selectedItem.get().solute ) {
        var item = null;
        for ( var i = 0; i < items.length; i++ ) {
          if ( items[i].solute === solute ) {
            item = items[i];
          }
        }
        assert && assert( item != null );
        selectedItem.set( item );
      }
    } );
  }

  inherit( SoluteComboBoxNode, ComboBoxNode );

  return SoluteComboBoxNode;
} );