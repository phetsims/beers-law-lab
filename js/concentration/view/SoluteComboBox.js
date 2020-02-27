// Copyright 2013-2020, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import beersLawLabStrings from '../../beers-law-lab-strings.js';
import beersLawLab from '../../beersLawLab.js';

const pattern0LabelString = beersLawLabStrings.pattern[ '0label' ];
const soluteString = beersLawLabStrings.solute;

class SoluteComboBox extends ComboBox {

  /**
   * @param {Solute[]} solutes
   * @param {Property.<Solute>} selectedSoluteProperty
   * @param {Node} soluteListParent
   * @param {Tandem} tandem
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

/**
 * Creates an item for the combo box.
 * @param {Solute} solute
 * @returns {ComboBoxItem}
 */
function createItem( solute ) {

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
}

beersLawLab.register( 'SoluteComboBox', SoluteComboBox );
export default SoluteComboBox;