// Copyright 2013-2022, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Rectangle, RichText, Text } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
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

    const labelTextTandem = options.tandem.createTandem( 'labelText' );

    const stringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.soluteStringProperty ],
      ( pattern: string, soluteString: string ) => StringUtils.format( pattern, soluteString ), {
        tandem: labelTextTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
        phetioValueType: StringIO
      }
    );

    // 'Solute' label
    options.labelNode = new Text( stringProperty, {
      font: new PhetFont( 22 ),
      maxWidth: 75,
      tandem: labelTextTandem
    } );

    // items
    const items = solutes.map( createItem );

    super( selectedSoluteProperty, items, soluteListParent, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
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