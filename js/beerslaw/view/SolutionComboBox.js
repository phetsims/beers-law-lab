// Copyright 2013-2018, University of Colorado Boulder

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
  var ComboBoxItem = require( 'SUN/ComboBoxItem' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );
  var solutionString = require( 'string!BEERS_LAW_LAB/solution' );

  /**
   * @param {BeersLawSolution[]} solutions
   * @param {Property.<BeersLawSolution>} selectedSolutionProperty
   * @param {Node} solutionListParent
   * @param {Tandem} tandem
   * @constructor
   */
  function SolutionComboBox( solutions, selectedSolutionProperty, solutionListParent, tandem ) {

    // 'Solution' label
    var label = new Text( StringUtils.format( pattern0LabelString, solutionString ), { font: new PhetFont( 20 ) } );

    // items
    var items = [];
    for ( var i = 0; i < solutions.length; i++ ) {
      var solution = solutions[ i ];
      items[ i ] = createItem( solution, tandem );
    }

    ComboBox.call( this, items, selectedSolutionProperty, solutionListParent, {
      labelNode: label,
      listPosition: 'above',
      xMargin: 12,
      yMargin: 12,
      highlightFill: 'rgb( 218, 255, 255 )',
      cornerRadius: 8,
      tandem: tandem
    } );
  }

  beersLawLab.register( 'SolutionComboBox', SolutionComboBox );

  /**
   * Creates a combo box item.
   * @private
   * @param {BeersLawSolution} solution
   * @param {Tandem} tandem
   * @returns {ComboBoxItem}
   */
  var createItem = function( solution, tandem ) {

    // node
    var node = new Node();
    var colorSquare = new Rectangle( 0, 0, 20, 20, {
      fill: solution.saturatedColor,
      stroke: solution.saturatedColor.darkerColor()
    } );
    var solutionName = new RichText( solution.getDisplayName(), {
      font: new PhetFont( 20 ),
      tandem: tandem.createTandem( solution.tandemName + 'Text' )
    } );
    node.addChild( colorSquare );
    node.addChild( solutionName );
    solutionName.left = colorSquare.right + 5;
    solutionName.centerY = colorSquare.centerY;

    return new ComboBoxItem( node, solution, { tandemName: solution.tandemName } );
  };

  return inherit( ComboBox, SolutionComboBox );
} );