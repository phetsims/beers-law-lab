// Copyright 2013-2021, University of Colorado Boulder

/**
 * Indicator that the solution is saturated.
 * This consists of 'Saturated!' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';

class SaturatedIndicator extends Node {

  /**
   * @param {Property.<boolean>} isSaturatedProperty
   */
  constructor( isSaturatedProperty ) {
    assert && assert( isSaturatedProperty instanceof Property );

    super();

    const label = new Text( beersLawLabStrings.saturated, { font: new PhetFont( 20 ), maxWidth: 400 } );

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
export default SaturatedIndicator;