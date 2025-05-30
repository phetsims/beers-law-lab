// Copyright 2013-2025, University of Colorado Boulder

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
import BeersLawLabStrings from '../../BeersLawLabStrings.js';

type SelfOptions = EmptySelfOptions;

type LightNodeOptions = SelfOptions & PickRequired<LaserPointerNodeOptions, 'tandem'>;

export default class LightNode extends LaserPointerNode {

  public constructor( light: Light, modelViewTransform: ModelViewTransform2, providedOptions: LightNodeOptions ) {

    const options = optionize<LightNodeOptions, SelfOptions, LaserPointerNodeOptions>()( {

      // LaserPointerNodeOptions
      isDisposable: false,
      bodySize: new Dimension2( 126, 78 ),
      nozzleSize: new Dimension2( 16, 65 ),
      buttonOptions: {
        radius: 26,
        touchAreaDilation: 25,
        accessibleName: BeersLawLabStrings.a11y.lightToggleButton.accessibleNameStringProperty
      },
      translation: modelViewTransform.modelToViewPosition( light.position ),
      phetioVisiblePropertyInstrumented: false // see https://github.com/phetsims/beers-law-lab/issues/310
    }, providedOptions );

    super( light.isOnProperty, options );

    this.addLinkedElement( light );
  }
}

beersLawLab.register( 'LightNode', LightNode );