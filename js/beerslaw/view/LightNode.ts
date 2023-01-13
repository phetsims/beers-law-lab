// Copyright 2013-2023, University of Colorado Boulder

/**
 * Visual representation of the light in the Beer's Law screen.
 * Origin is at the right center, where the light comes out of the 'housing'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LaserPointerNode, { LaserPointerNodeOptions } from '../../../../scenery-phet/js/LaserPointerNode.js';
import beersLawLab from '../../beersLawLab.js';
import Light from '../model/Light.js';

type SelfOptions = EmptySelfOptions;

type LightNodeOptions = SelfOptions & PickRequired<LaserPointerNodeOptions, 'tandem'>;

export default class LightNode extends LaserPointerNode {

  public constructor( light: Light, modelViewTransform: ModelViewTransform2, providedOptions: LightNodeOptions ) {

    const options = optionize<LightNodeOptions, SelfOptions, LaserPointerNodeOptions>()( {

      // LaserPointerNodeOptions
      bodySize: new Dimension2( 126, 78 ),
      nozzleSize: new Dimension2( 16, 65 ),
      buttonRadius: 26,
      buttonTouchAreaDilation: 25,
      translation: modelViewTransform.modelToViewPosition( light.position ),
      phetioVisiblePropertyInstrumented: false // see https://github.com/phetsims/beers-law-lab/issues/310
    }, providedOptions );

    super( light.isOnProperty, options );

    this.addLinkedElement( light, {
      tandem: options.tandem.createTandem( 'light' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'LightNode', LightNode );