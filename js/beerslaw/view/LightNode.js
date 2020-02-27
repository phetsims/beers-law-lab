// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of the light in the Beer's Law screen.
 * Origin is at the right center, where the light comes out of the 'housing'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import LaserPointerNode from '../../../../scenery-phet/js/LaserPointerNode.js';
import beersLawLab from '../../beersLawLab.js';

class LightNode extends LaserPointerNode {

  /**
   * @param {Light} light
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( light, modelViewTransform, tandem ) {

    super( light.onProperty, {
      bodySize: new Dimension2( 126, 78 ),
      nozzleSize: new Dimension2( 16, 65 ),
      buttonRadius: 26,
      buttonTouchAreaDilation: 25,
      translation: modelViewTransform.modelToViewPosition( light.position ),
      tandem: tandem
    } );
  }
}

beersLawLab.register( 'LightNode', LightNode );
export default LightNode;