// Copyright 2016-2025, University of Colorado Boulder

/**
 * SoluteGramsNode displays the amount of solute, in grams. See https://github.com/phetsims/beers-law-lab/issues/148
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import BLLConstants from '../../common/BLLConstants.js';

type SelfOptions = EmptySelfOptions;

type SoluteGramsNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class SoluteAmountText extends Node {

  public constructor( soluteGramsProperty: TReadOnlyProperty<number>, providedOptions: SoluteGramsNodeOptions ) {

    const options = optionize<SoluteGramsNodeOptions, SelfOptions, NodeOptions>()( {
      visibleProperty: BLLPreferences.showSoluteAmountProperty,
      accessibleParagraph: createAccessibleParagraph( soluteGramsProperty )
    }, providedOptions );

    const stringProperty = new DerivedStringProperty(
      [ BeersLawLabStrings.pattern[ '0soluteAmountStringProperty' ], soluteGramsProperty ],
      ( pattern, soluteGrams ) => StringUtils.format( pattern, toFixed( soluteGrams, BLLConstants.DECIMAL_PLACES_SOLUTE_AMOUNT ) ), {
        tandem: options.tandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME )
      } );

    const text = new Text( stringProperty, {
      isDisposable: false,
      font: new PhetFont( 22 ),
      maxWidth: 225
    } );

    options.children = [ text ];

    super( options );
  }
}

/**
 * Creates the accessible paragraph for this Node.
 */
function createAccessibleParagraph( soluteGramsProperty: TReadOnlyProperty<number> ): TReadOnlyProperty<string> {
  return new DerivedStringProperty( [
      BeersLawLabStrings.a11y.soluteAmountText.accessibleParagraphStringProperty,
      soluteGramsProperty,
      BeersLawLabStrings.a11y.unitsDescription.gramsStringProperty
    ],
    ( pattern, soluteGrams, gramsString ) => StringUtils.fillIn( pattern, {
      value: toFixed( soluteGrams, BLLConstants.DECIMAL_PLACES_SOLUTE_AMOUNT ),
      units: gramsString
    } ) );
}

beersLawLab.register( 'SoluteAmountText', SoluteAmountText );