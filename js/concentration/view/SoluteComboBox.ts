// Copyright 2013-2022, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Rectangle, RichText, Text } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Solute from '../../common/model/Solute.js';

type SelfOptions = EmptySelfOptions;

type SoluteComboBoxOptions = SelfOptions & PickRequired<ComboBoxOptions, 'tandem'>;

export default class SoluteComboBox extends ComboBox<Solute> {

  public constructor( selectedSoluteProperty: Property<Solute>, solutes: Solute[], soluteListParent: Node,
                      providedOptions: SoluteComboBoxOptions ) {

    const options = optionize<SoluteComboBoxOptions, SelfOptions, ComboBoxOptions>()( {

      // ComboBoxOptions
      listPosition: 'below',
      xMargin: 12,
      yMargin: 12,
      highlightFill: 'rgb( 218, 255, 255 )',
      cornerRadius: 8
    }, providedOptions );

    // 'Solute' label
    options.labelNode = new Text( StringUtils.format( BeersLawLabStrings.pattern[ '0label' ], BeersLawLabStrings.solute ), {
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
 */
function createItem( solute: Solute ): ComboBoxItem<Solute> {

  const colorNode = new Rectangle( 0, 0, 20, 20, {
    fill: solute.colorScheme.maxColor,
    stroke: solute.colorScheme.maxColor.darkerColor()
  } );

  const textNode = new RichText( solute.nameProperty, {
    font: new PhetFont( 20 ),
    maxWidth: 230 // determined empirically, so that English strings are not scaled down
  } );

  const hBox = new HBox( {
    spacing: 5,
    children: [ colorNode, textNode ]
  } );

  return {
    value: solute,
    node: hBox,
    tandemName: `${solute.tandemName}${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  };
}

beersLawLab.register( 'SoluteComboBox', SoluteComboBox );