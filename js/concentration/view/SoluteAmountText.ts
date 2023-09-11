// Copyright 2016-2023, University of Colorado Boulder

/**
 * SoluteGramsNode displays the amount of solute, in grams. See https://github.com/phetsims/beers-law-lab/issues/148
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';

// constants
const DECIMAL_PLACES = 0;

type SelfOptions = EmptySelfOptions;

type SoluteGramsNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class SoluteAmountText extends Node {

  public constructor( soluteGramsProperty: TReadOnlyProperty<number>, providedOptions: SoluteGramsNodeOptions ) {

    const options = optionize<SoluteGramsNodeOptions, SelfOptions, NodeOptions>()( {
      visibleProperty: BLLPreferences.showSoluteAmountProperty
    }, providedOptions );

    const stringProperty = new DerivedStringProperty(
      [ BeersLawLabStrings.pattern[ '0soluteAmountStringProperty' ], soluteGramsProperty ],
      ( pattern, soluteGrams ) => StringUtils.format( pattern, Utils.toFixed( soluteGrams, DECIMAL_PLACES ) ), {
        tandem: options.tandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME )
      } );

    const text = new Text( stringProperty, {
      isDisposable: false,
      font: new PhetFont( 22 ),
      maxWidth: 200
    } );
    options.children = [ text ];

    super( options );
  }
}

beersLawLab.register( 'SoluteAmountText', SoluteAmountText );