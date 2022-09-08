// Copyright 2013-2022, University of Colorado Boulder

/**
 * Indicator that the solution is saturated.
 * This consists of 'Saturated!' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';

export default class SaturatedIndicator extends Node {

  public constructor( isSaturatedProperty: TReadOnlyProperty<boolean> ) {

    super();

    const label = new Text( BeersLawLabStrings.saturated, { font: new PhetFont( 20 ), maxWidth: 400 } );

    // translucent light-gray background, so this shows up on all solution colors
    const background = new Rectangle( 0, 0, 1.2 * label.width, 1.2 * label.height, 8, 8,
      { fill: 'rgba( 240, 240, 240, 0.6 )' } );

    // rendering order
    this.addChild( background );
    this.addChild( label );

    // layout
    label.centerX = background.centerX;
    label.centerY = background.centerY;

    // make this node visible when the solution is saturated
    isSaturatedProperty.link( saturated => {
      this.setVisible( saturated );
    } );
  }
}

beersLawLab.register( 'SaturatedIndicator', SaturatedIndicator );