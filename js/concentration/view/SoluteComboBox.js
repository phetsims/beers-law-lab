// Copyright 2013-2020, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';

class SoluteComboBox extends ComboBox {

  /**
   * @param {Solute[]} solutes
   * @param {Property.<Solute>} selectedSoluteProperty
   * @param {Node} soluteListParent
   * @param {Object} [options]
   */
  constructor( solutes, selectedSoluteProperty, soluteListParent, options ) {

    options = merge( {
      listPosition: 'below',
      xMargin: 12,
      yMargin: 12,
      highlightFill: 'rgb( 218, 255, 255 )',
      cornerRadius: 8,
      tandem: Tandem.REQUIRED
    }, options );

    // 'Solute' label
    assert && assert( !options.labelNode, 'SoluteComboBox sets labelNode' );
    options.labelNode = new Text( StringUtils.format( beersLawLabStrings.pattern[ '0label' ], beersLawLabStrings.solute ),
      { font: new PhetFont( 22 ) } );

    // items
    const items = solutes.map( createItem );

    super( items, selectedSoluteProperty, soluteListParent, options );
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
    tandemName: solute.tandemName + 'Item' // Item suffix is required by ComboBoxItem
  } );
}

beersLawLab.register( 'SoluteComboBox', SoluteComboBox );
export default SoluteComboBox;