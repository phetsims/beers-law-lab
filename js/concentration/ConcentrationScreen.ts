// Copyright 2013-2022, University of Colorado Boulder

/**
 * The 'Concentration' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import concentrationScreenIcon_jpg from '../../images/concentrationScreenIcon_jpg.js';
import beersLawLab from '../beersLawLab.js';
import BeersLawLabStrings from '../BeersLawLabStrings.js';
import ConcentrationModel from './model/ConcentrationModel.js';
import ConcentrationScreenView from './view/ConcentrationScreenView.js';

export default class ConcentrationScreen extends Screen<ConcentrationModel, ConcentrationScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {

      // ScreenOptions
      name: BeersLawLabStrings.screen.concentrationStringProperty,
      homeScreenIcon: createScreenIcon(),
      tandem: tandem
    };

    const modelViewTransform = ModelViewTransform2.createIdentity();

    super(
      () => new ConcentrationModel( options.tandem.createTandem( 'model' ) ),
      model => new ConcentrationScreenView( model, modelViewTransform, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( new Image( concentrationScreenIcon_jpg ), {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

beersLawLab.register( 'ConcentrationScreen', ConcentrationScreen );