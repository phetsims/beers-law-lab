// Copyright 2013-2015, University of Colorado Boulder

/**
 * Combo box for selecting solutions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ComboBox = require( 'SUN/ComboBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // phet-io modules
  var TSolution = require( 'ifphetio!PHET_IO/simulations/beers-law-lab/TSolution' );

  // strings
  var pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );
  var solutionString = require( 'string!BEERS_LAW_LAB/solution' );

  /**
   * @param {BeersLawSolution[]} solutions
   * @param {Property.<BeersLawSolution>} selectedSolutionProperty
   * @param {Node} soluteListParent
   * @param {Tandem} tandem
   * @constructor
   */
  function SolutionComboBox( solutions, selectedSolutionProperty, soluteListParent, tandem ) {

    // 'Solution' label
    var label = new Text( StringUtils.format( pattern0LabelString, solutionString ), { font: new PhetFont( 20 ) } );

    // items
    var items = [];
    for ( var i = 0; i < solutions.length; i++ ) {
      var solution = solutions[ i ];
      items[ i ] = createItem( solution, tandem );
    }

    ComboBox.call( this, items, selectedSolutionProperty, soluteListParent, {
      labelNode: label,
      listPosition: 'above',
      itemYMargin: 12,
      itemHighlightFill: 'rgb(218,255,255)',
      tandem: tandem,
      phetioValueType: TSolution
    } );
  }

  beersLawLab.register( 'SolutionComboBox', SolutionComboBox );

  /**
   * Creates a combo box item.
   * @private
   * @param {Solution} solution
   * @param {Tandem} tandem
   * @returns {{node: *, value: *}}
   */
  var createItem = function( solution, tandem ) {

    // node
    var node = new Node();
    var colorSquare = new Rectangle( 0, 0, 20, 20, {
      fill: solution.saturatedColor,
      stroke: solution.saturatedColor.darkerColor()
    } );
    var solutionName = new SubSupText( solution.getDisplayName(), { font: new PhetFont( 20 ) } );
    node.addChild( colorSquare );
    node.addChild( solutionName );
    solutionName.left = colorSquare.right + 5;
    solutionName.centerY = colorSquare.centerY;

    return ComboBox.createItem( node, solution, { tandem: tandem } );
  };

  return inherit( ComboBox, SolutionComboBox );
} );