// Copyright 2013-2023, University of Colorado Boulder

/**
 * Indicator that the solution is saturated.
 * This consists of 'Saturated!' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import { Color, Text } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class SaturatedIndicator extends BackgroundNode {

  public constructor( isSaturatedProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    const text = new Text( BeersLawLabStrings.saturatedStringProperty, {
      font: new PhetFont( 20 ),
      maxWidth: 400,
      tandem: tandem.createTandem( 'text' )
    } );

    super( text, {
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
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'SaturatedIndicator', SaturatedIndicator );