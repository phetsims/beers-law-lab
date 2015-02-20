// Copyright 2002-2013, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TonePlayer = require( 'BEERS_LAW_LAB/concentration/view/TonePlayer' );

  // strings
  var pattern_0label = require( 'string!BEERS_LAW_LAB/pattern.0label' );
  var soluteString = require( 'string!BEERS_LAW_LAB/solute' );

  // constants
  var MAJOR_SCALE_NOTES = [ 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25 ];

  /**
   * @param {Solute[]} solutes
   * @param {Property.<Solute>} selectedSolute
   * @param {Node} soluteListParent
   * @constructor
   */
  function SoluteComboBox( solutes, selectedSolute, soluteListParent ) {

    // 'Solute' label
    var labelNode = new Text( StringUtils.format( pattern_0label, soluteString ),
      { font: new PhetFont( 22 ) } );

    // items
    var items = [];
    for ( var i = 0; i < solutes.length; i++ ) {
      var solute = solutes[ i ];
      items[ i ] = createItem( solute );
    }

    ComboBox.call( this, items, selectedSolute, soluteListParent, {
      labelNode: labelNode,
      listPosition: 'below',
      itemYMargin: 12,
      itemHighlightFill: 'rgb(218,255,255)'
    } );

    var tonePlayer = new TonePlayer();
    selectedSolute.lazyLink( function( solute ) {
      var indexOfSolute = -1;
      for ( var i = 0; i < items.length; i++ ) {
        if ( solute.name === items[ i ].value.name ) {
          indexOfSolute = i;
          break;
        }
      }

      if ( indexOfSolute >= 0 ) {
        tonePlayer.play( MAJOR_SCALE_NOTES[ indexOfSolute ] );
      }
    } );
  }

  /**
   * Creates an item for the combo box.
   * @param solute
   * @returns {*|{node: *, value: *}}
   */
  var createItem = function( solute ) {
    var node = new Node();
    var colorNode = new Rectangle( 0, 0, 20, 20, { fill: solute.colorScheme.maxColor, stroke: solute.colorScheme.maxColor.darkerColor() } );
    var textNode = new Text( solute.name, { font: new PhetFont( 20 ) } );
    node.addChild( colorNode );
    node.addChild( textNode );
    textNode.left = colorNode.right + 5;
    textNode.centerY = colorNode.centerY;
    return ComboBox.createItem( node, solute );
  };

  return inherit( ComboBox, SoluteComboBox );
} );