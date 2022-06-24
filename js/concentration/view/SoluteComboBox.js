// Copyright 2013-2022, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import { RichText } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import Solute from '../../common/model/Solute.js';

class SoluteComboBox extends ComboBox {

  /**
   * @param {Property.<Solute>} selectedSoluteProperty
   * @param {Solute[]} solutes
   * @param {Node} soluteListParent
   * @param {Object} [options]
   */
  constructor( selectedSoluteProperty, solutes, soluteListParent, options ) {
    assert && assert( Array.isArray( solutes ) );
    assert && assert( _.every( solutes, solute => solute instanceof Solute ) );
    assert && assert( selectedSoluteProperty instanceof Property );
    assert && assert( soluteListParent instanceof Node );

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
    options.labelNode = new Text( StringUtils.format( beersLawLabStrings.pattern[ '0label' ], beersLawLabStrings.solute ), {
      font: new PhetFont( 22 ),
      maxWidth: 75,
      tandem: options.tandem.createTandem( 'labelNode' )
    } );

    // items
    const items = solutes.map( createItem );

    super( selectedSoluteProperty, items, soluteListParent, options );
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

  const textNode = new RichText( solute.nameProperty.value, {
    textProperty: solute.nameProperty, // nameProperty may be changed via PhET-iO
    font: new PhetFont( 20 ),
    maxWidth: 230 // determined empirically, so that English strings are not scaled down
  } );

  const hBox = new HBox( {
    spacing: 5,
    children: [ colorNode, textNode ]
  } );

  return new ComboBoxItem( hBox, solute, {
    tandemName: `${solute.tandemName}Item` // Item suffix is required by ComboBoxItem
  } );
}

beersLawLab.register( 'SoluteComboBox', SoluteComboBox );
export default SoluteComboBox;