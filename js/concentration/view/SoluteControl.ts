// Copyright 2013-2023, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, HBoxOptions, Node, Rectangle, RichText, Text } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Solute from '../../common/model/Solute.js';

type SelfOptions = {
  comboBoxOptions?: WithRequired<ComboBoxOptions, 'tandem'>;
};

type SoluteComboBoxOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class SoluteControl extends HBox {

  public constructor( selectedSoluteProperty: Property<Solute>, solutes: Solute[], soluteListParent: Node,
                      providedOptions: SoluteComboBoxOptions ) {

    const options = optionize<SoluteComboBoxOptions, SelfOptions, HBoxOptions>()( {
      spacing: 10,

      comboBoxOptions: {
        // ComboBoxOptions
        listPosition: 'below',
        xMargin: 12,
        yMargin: 12,
        highlightFill: 'rgb( 218, 255, 255 )',
        cornerRadius: 8,
        tandem: Tandem.REQUIRED
      }
    }, providedOptions );

    const labelTextTandem = options.comboBoxOptions.tandem.createTandem( 'labelText' );

    const stringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.soluteStringProperty ],
      ( pattern, soluteString ) => StringUtils.format( pattern, soluteString ), {
        tandem: labelTextTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
        phetioValueType: StringIO
      }
    );

    // items
    const items = solutes.map( createItem );

    options.children = [
      new Text( stringProperty, {
        font: new PhetFont( 22 ),
        maxWidth: 75,
        tandem: labelTextTandem
      } ),
      new ComboBox( selectedSoluteProperty, items, soluteListParent, options.comboBoxOptions )
    ];

    super( options );
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
    // No PhET-iO instrumentation is desired.
  } );

  const hBox = new HBox( {
    spacing: 5,
    children: [ colorNode, textNode ]
  } );

  return {
    value: solute,
    createNode: () => hBox,
    tandemName: `${solute.tandemName}${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  };
}

beersLawLab.register( 'SoluteControl', SoluteControl );