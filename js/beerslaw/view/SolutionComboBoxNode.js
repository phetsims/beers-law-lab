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

    // TODO placeholder
//    thisNode.addChild( new Rectangle( 0, 0, 300, 30, { stroke: 'black' } ) );

    var items = new Array();
    items[0] = new Text( "zero", { font: "24px Arial" } );
    items[1] = new Text( "one", { font: "24px Arial" } );
    items[2] = new Text( "two", { font: "24px Arial" } );
    var selectedItem = new Property( items[0] );
    var comboBoxNode = new ComboBoxNode( items, selectedItem, { buttonFill: "yellow", listPosition: "below" } );
    thisNode.addChild( comboBoxNode );
  }

  inherit( SolutionComboBoxNode, Node );

  return SolutionComboBoxNode;
} );