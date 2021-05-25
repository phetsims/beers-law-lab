// Copyright 2013-2021, University of Colorado Boulder

/**
 * Visual representation of the light in the Beer's Law screen.
 * Origin is at the right center, where the light comes out of the 'housing'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LaserPointerNode from '../../../../scenery-phet/js/LaserPointerNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import Light from '../model/Light.js';

class LightNode extends LaserPointerNode {

  /**
   * @param {Light} light
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( light, modelViewTransform, options ) {
    assert && assert( light instanceof Light );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      bodySize: new Dimension2( 126, 78 ),
      nozzleSize: new Dimension2( 16, 65 ),
      buttonRadius: 26,
      buttonTouchAreaDilation: 25,
      translation: modelViewTransform.modelToViewPosition( light.position ),
      tandem: Tandem.REQUIRED
    }, options );

    super( light.isOnProperty, options );

    this.addLinkedElement( light, {
      tandem: options.tandem.createTandem( 'light' )
    } );
  }
}

beersLawLab.register( 'LightNode', LightNode );
export default LightNode;