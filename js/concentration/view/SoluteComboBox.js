// Copyright 2013-2017, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );
  const soluteString = require( 'string!BEERS_LAW_LAB/solute' );

  class SoluteComboBox extends ComboBox {
    /**
     * @param {Solute[]} solutes
     * @param {Property.<Solute>} selectedSoluteProperty
     * @param {Node} soluteListParent
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( solutes, selectedSoluteProperty, soluteListParent, tandem ) {

      // 'Solute' label
      const labelNode = new Text( StringUtils.format( pattern0LabelString, soluteString ),
        { font: new PhetFont( 22 ) } );

      // items
      const items = solutes.map( createItem );

      super( items, selectedSoluteProperty, soluteListParent, {
        labelNode: labelNode,
        listPosition: 'below',
        xMargin: 12,
        yMargin: 12,
        highlightFill: 'rgb( 218, 255, 255 )',
        cornerRadius: 8,
        tandem: tandem
      } );
    }
  }

  beersLawLab.register( 'SoluteComboBox', SoluteComboBox );

  /**
   * Creates an item for the combo box.
   * @param {Solute} solute
   * @returns {ComboBoxItem}
   */
  const createItem = function( solute ) {

    const colorNode = new Rectangle( 0, 0, 20, 20, {
      fill: solute.colorScheme.maxColor,
      stroke: solute.colorScheme.maxColor.darkerColor()
    } );

    const textNode = new Text( solute.name, {
      font: new PhetFont( 20 )
    } );

    const hBox = new HBox( {
      spacing: 5,
      children: [ colorNode, textNode ]
    } );

    return new ComboBoxItem( hBox, solute, {
      tandemName: solute.tandemName
    } );
  };

  return SoluteComboBox;
} );