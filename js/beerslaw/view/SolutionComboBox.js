// Copyright 2002-2013, University of Colorado Boulder

/**
 * Combo box for selecting solutions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'beers-law-lab' );
  var BLLStrings = require( 'common/BLLStrings' );
  var ComboBox = require( 'SUN/ComboBox' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Array<BeersLawSolution>} solutions
   * @param {Property<BeersLawSolution>} selectedSolution
   * @param {Node} soluteListParent
   * @constructor
   */
  function SolutionComboBox( solutions, selectedSolution, soluteListParent ) {

    // 'Solution' label
    var label = new Text( StringUtils.format( BLLStrings.pattern_0label, BLLStrings.solution ), { font: new PhetFont( 20 ) } );

    // items
    var items = [];
    for ( var i = 0; i < solutions.length; i++ ) {
      var solution = solutions[i];
      items[i] = createItem( solution );
    }

    ComboBox.call( this, items, selectedSolution,
      { labelNode: label,
        listPosition: 'above',
        itemYMargin: 12,
        itemHighlightFill: 'rgb(218,255,255)',
        listParent: soluteListParent } );
  }

  inherit( ComboBox, SolutionComboBox );

  /**
   * Creates a combo box item.
   * @param {Solution} solution
   * @returns {{node: *, value: *}}
   * @private
   */
  var createItem = function( solution ) {

    // node
    var node = new Node();
    var colorSquare = new Rectangle( 0, 0, 20, 20,
      { fill: solution.saturatedColor, stroke: solution.saturatedColor.darkerColor() } );
    var solutionName = new HTMLText( solution.getDisplayName(), { font: new PhetFont( 20 ) } );
    node.addChild( colorSquare );
    node.addChild( solutionName );
    solutionName.left = colorSquare.right + 5;
    solutionName.centerY = colorSquare.centerY;

    return ComboBox.createItem( node, solution );
  };

  return SolutionComboBox;
} );