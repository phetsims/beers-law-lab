// Copyright 2013-2025, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Solute from '../../common/model/Solute.js';
import BLLColors from '../../common/BLLColors.js';

type SelfOptions = {
  comboBoxOptions?: WithRequired<ComboBoxOptions, 'tandem'>;
};

type SoluteComboBoxOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class SoluteControl extends HBox {

  public constructor( selectedSoluteProperty: Property<Solute>,
                      solutes: Solute[],
                      soluteListParent: Node,
                      providedOptions: SoluteComboBoxOptions ) {

    const options = optionize<SoluteComboBoxOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      comboBoxOptions: {
        listPosition: 'below',
        xMargin: 12,
        yMargin: 12,
        highlightFill: BLLColors.comboBoxHighlightColorProperty,
        cornerRadius: 8,
        accessibleName: BeersLawLabStrings.soluteStringProperty,
        tandem: Tandem.REQUIRED
      },

      // HBoxOptions
      isDisposable: false,
      spacing: 10
    }, providedOptions );

    const labelStringProperty = new DerivedStringProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.soluteStringProperty ],
      ( pattern, soluteString ) => StringUtils.format( pattern, soluteString ), {
        tandem: options.comboBoxOptions.tandem.createTandem( 'labelStringProperty' )
      }
    );

    // items
    const items = solutes.map( createItem );

    const comboBox = new ComboBox( selectedSoluteProperty, items, soluteListParent, options.comboBoxOptions );

    const labelText = new Text( labelStringProperty, {
      font: new PhetFont( 22 ),
      maxWidth: 75,
      visibleProperty: comboBox.visibleProperty
    } );

    options.children = [ labelText, comboBox ];

    super( options );
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
    tandemName: `${solute.tandemName}Item`
  };
}

beersLawLab.register( 'SoluteControl', SoluteControl );