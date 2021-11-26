// Copyright 2013-2021, University of Colorado Boulder

/**
 * The 'Concentration' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import concentrationScreenIcon_jpg from '../../images/concentrationScreenIcon_jpg.js';
import beersLawLab from '../beersLawLab.js';
import beersLawLabStrings from '../beersLawLabStrings.js';
import ConcentrationModel from './model/ConcentrationModel.js';
import ConcentrationScreenView from './view/ConcentrationScreenView.js';

class ConcentrationScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      name: beersLawLabStrings.screen.concentration,
      homeScreenIcon: createScreenIcon(),
      tandem: Tandem.REQUIRED
    }, options );

    const modelViewTransform = ModelViewTransform2.createIdentity();

    super(
      () => new ConcentrationModel( {
        tandem: options.tandem.createTandem( 'model' )
      } ),
      model => new ConcentrationScreenView( model, modelViewTransform, {
        tandem: options.tandem.createTandem( 'view' )
      } ),
      options
    );
  }
}

function createScreenIcon() {
  return new ScreenIcon( new Image( concentrationScreenIcon_jpg ), {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

beersLawLab.register( 'ConcentrationScreen', ConcentrationScreen );
export default ConcentrationScreen;