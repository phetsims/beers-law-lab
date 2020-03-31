// Copyright 2013-2020, University of Colorado Boulder

/**
 * The 'Beer's Law' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import Screen from '../../../joist/js/Screen.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../scenery/js/nodes/Image.js';
import screenIcon from '../../images/BeersLaw-screen-icon_jpg.js';
import beersLawLabStrings from '../beersLawLabStrings.js';
import beersLawLab from '../beersLawLab.js';
import BeersLawModel from './model/BeersLawModel.js';
import BeersLawScreenView from './view/BeersLawScreenView.js';

const screenBeersLawString = beersLawLabStrings.screen.beersLaw;

// image

class BeersLawScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
    const modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( new Vector2( 0, 0 ), 125 );

    const options = {
      name: screenBeersLawString,
      homeScreenIcon: new Image( screenIcon ),
      tandem: tandem
    };

    super(
      () => new BeersLawModel( modelViewTransform, tandem.createTandem( 'model' ) ),
      model => new BeersLawScreenView( model, modelViewTransform, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

beersLawLab.register( 'BeersLawScreen', BeersLawScreen );
export default BeersLawScreen;