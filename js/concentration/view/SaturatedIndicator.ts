// Copyright 2013-2025, University of Colorado Boulder

/**
 * Indicator that the solution is saturated.
 * This consists of 'Saturated!' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';

export default class SaturatedIndicator extends BackgroundNode {

  public constructor( isSaturatedProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    const text = new Text( BeersLawLabStrings.saturatedStringProperty, {
      font: new PhetFont( 20 ),
      maxWidth: 400
    } );

    super( text, {
      isDisposable: false,
      visibleProperty: isSaturatedProperty,
      xMargin: 10,
      yMargin: 5,
      rectangleOptions: {
        fill: Color.grayColor( 240 ),
        opacity: 0.6,
        cornerRadius: 8
      },
      tandem: tandem
    } );

    this.visibleProperty.lazyLink( visible => {
      if ( visible ) {
        this.addAccessibleContextResponse( BeersLawLabStrings.a11y.solutionIsSaturatedStringProperty.value );
      }
    } );
  }
}

beersLawLab.register( 'SaturatedIndicator', SaturatedIndicator );