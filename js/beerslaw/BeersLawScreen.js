// Copyright 2013-2021, University of Colorado Boulder

/**
 * The 'Beer's Law' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import screenIcon from '../../images/BeersLaw-screen-icon_jpg.js';
import beersLawLab from '../beersLawLab.js';
import beersLawLabStrings from '../beersLawLabStrings.js';
import BeersLawModel from './model/BeersLawModel.js';
import BeersLawScreenView from './view/BeersLawScreenView.js';

class BeersLawScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      name: beersLawLabStrings.screen.beersLaw,
      homeScreenIcon: createScreenIcon(),
      tandem: Tandem.REQUIRED
    }, options );

    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
    const modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( new Vector2( 0, 0 ), 125 );

    super(
      () => new BeersLawModel( modelViewTransform, {
        tandem: options.tandem.createTandem( 'model' )
      } ),
      model => new BeersLawScreenView( model, modelViewTransform, {
        tandem: options.tandem.createTandem( 'view' )
      } ),
      options
    );
  }
}

function createScreenIcon() {
  return new ScreenIcon( new Image( screenIcon ), {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

beersLawLab.register( 'BeersLawScreen', BeersLawScreen );
export default BeersLawScreen;