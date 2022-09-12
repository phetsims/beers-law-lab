// Copyright 2016-2022, University of Colorado Boulder

/**
 * Displays the amount of solute, in grams.  See beers-law-lab#148
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, TextOptions } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';

// constants
const DECIMAL_PLACES = 0;

type SelfOptions = EmptySelfOptions;

type SoluteGramsNodeOptions = SelfOptions & PickOptional<TextOptions, 'visible'>;

export default class SoluteGramsNode extends Text {

  public constructor( soluteGramsProperty: TReadOnlyProperty<number>, providedOptions: SoluteGramsNodeOptions ) {

    const options = optionize<SoluteGramsNodeOptions, SelfOptions, TextOptions>()( {
      font: new PhetFont( 22 ),
      maxWidth: 200
    }, providedOptions );

    const stringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0soluteAmountStringProperty' ], soluteGramsProperty ],
      ( pattern, soluteGrams ) => StringUtils.format( pattern, Utils.toFixed( soluteGrams, DECIMAL_PLACES ) )
    );

    super( stringProperty, options );
  }
}

beersLawLab.register( 'SoluteGramsNode', SoluteGramsNode );