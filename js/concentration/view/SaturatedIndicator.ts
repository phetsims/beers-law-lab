// Copyright 2013-2022, University of Colorado Boulder

/**
 * Indicator that the solution is saturated.
 * This consists of 'Saturated!' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';

export default class SaturatedIndicator extends Node {

  public constructor( isSaturatedProperty: TReadOnlyProperty<boolean> ) {

    super();

    const labelText = new Text( BeersLawLabStrings.saturatedStringProperty, {
      font: new PhetFont( 20 ),
      maxWidth: 400
    } );

    // translucent light-gray background, so this shows up on all solution colors.
    const backgroundNode = new BackgroundNode( labelText, {
      xMargin: 10,
      yMargin: 5,
      rectangleOptions: {
        fill: 'rgba( 240, 240, 240, 0.6 )',
        opacity: 1,
        cornerRadius: 8
      }
    } );

    // rendering order
    this.children = [ backgroundNode ];

    // make this node visible when the solution is saturated
    isSaturatedProperty.link( saturated => {
      this.setVisible( saturated );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'SaturatedIndicator', SaturatedIndicator );