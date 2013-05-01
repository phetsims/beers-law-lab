// Copyright 2013, University of Colorado

/**
 * Combo box for selecting solutions.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var ComboBoxNode = require( "common/view/ComboBoxNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Property = require( "PHETCOMMON/model/property/Property" );//TODO delete me?
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Text = require( "SCENERY/nodes/Text" );  //TODO delete me?

  /**
   * @param {Array} solutions of type BeersLawSolution
   * @param {Property} selectedSolution of type BeersLawSolution
   * @constructor
   */
  function SolutionComboBoxNode( solutions, selectedSolution ) {

    var thisNode = this;
    Node.call( thisNode );

    var defaultItem;
    var items = new Array();
    for ( var i = 0; i < solutions.length; i++ ) {
      var solution = solutions[i];
      items[i] = new Text( solution.name, { font: "20px Arial" } );
      items[i].solution = solution; //TODO is this an acceptable way to do associate item with its model element?
      if ( solution === selectedSolution.get() ) {
        defaultItem = items[i];
      }
    }
    //TODO assert && assert ( !_.isUndefined( defaultItem ) );

    var selectedItem = new Property( defaultItem );
    var comboBoxNode = new ComboBoxNode( items, selectedItem, { listPosition: "above" } );
    thisNode.addChild( comboBoxNode );

    // update model when combo box selection changes
    selectedItem.addObserver( function( item ) {
        selectedSolution.set( item.solution );
    });
  }

  inherit( SolutionComboBoxNode, Node );

  return SolutionComboBoxNode;
} );