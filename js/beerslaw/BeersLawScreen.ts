// Copyright 2013-2025, University of Colorado Boulder

/**
 * The 'Beer's Law' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import beersLawScreenIcon_jpg from '../../images/beersLawScreenIcon_jpg.js';
import beersLawLab from '../beersLawLab.js';
import BeersLawLabStrings from '../BeersLawLabStrings.js';
import BLLColors from '../common/BLLColors.js';
import BeersLawModel from './model/BeersLawModel.js';
import BeersLawScreenView from './view/BeersLawScreenView.js';
import BeersLawKeyboardHelpContent from './view/BeersLawKeyboardHelpContent.js';

export default class BeersLawScreen extends Screen<BeersLawModel, BeersLawScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {

      // ScreenOptions
      name: BeersLawLabStrings.screen.beersLawStringProperty,
      homeScreenIcon: createScreenIcon(),
      backgroundColorProperty: BLLColors.screenBackgroundColorProperty,
      screenButtonsHelpText: BeersLawLabStrings.a11y.beersLawScreen.screenButtonsHelpTextStringProperty,
      createKeyboardHelpNode: () => new BeersLawKeyboardHelpContent(),
      tandem: tandem
    };

    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
    const modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( new Vector2( 0, 0 ), 125 );

    super(
      () => new BeersLawModel( modelViewTransform, options.tandem.createTandem( 'model' ) ),
      model => new BeersLawScreenView( model, modelViewTransform, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( new Image( beersLawScreenIcon_jpg ), {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

beersLawLab.register( 'BeersLawScreen', BeersLawScreen );