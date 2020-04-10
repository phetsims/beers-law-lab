// Copyright 2013-2020, University of Colorado Boulder

/**
 * The 'Concentration' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../scenery/js/nodes/Image.js';
import screenIcon from '../../images/Concentration-screen-icon_jpg.js';
import beersLawLab from '../beersLawLab.js';
import beersLawLabStrings from '../beersLawLabStrings.js';
import ConcentrationModel from './model/ConcentrationModel.js';
import ConcentrationScreenView from './view/ConcentrationScreenView.js';

const screenConcentrationString = beersLawLabStrings.screen.concentration;


class ConcentrationScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const modelViewTransform = ModelViewTransform2.createIdentity();

    const options = {
      name: screenConcentrationString,
      homeScreenIcon: new ScreenIcon( new Image( screenIcon ) ),
      tandem: tandem
    };

    super(
      () => new ConcentrationModel( { tandem: tandem.createTandem( 'model' ) } ),
      model => new ConcentrationScreenView( model, modelViewTransform, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

beersLawLab.register( 'ConcentrationScreen', ConcentrationScreen );
export default ConcentrationScreen;