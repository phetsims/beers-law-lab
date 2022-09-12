// Copyright 2013-2022, University of Colorado Boulder

/**
 * The 'Concentration' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image } from '../../../scenery/js/imports.js';
import concentrationScreenIcon_jpg from '../../images/concentrationScreenIcon_jpg.js';
import beersLawLab from '../beersLawLab.js';
import BeersLawLabStrings from '../BeersLawLabStrings.js';
import ConcentrationModel from './model/ConcentrationModel.js';
import ConcentrationScreenView from './view/ConcentrationScreenView.js';

type SelfOptions = EmptySelfOptions;

type ConcentrationScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class ConcentrationScreen extends Screen {

  public constructor( providedOptions: ConcentrationScreenOptions ) {

    const options = optionize<ConcentrationScreenOptions, SelfOptions, ScreenOptions>()( {

      // ScreenOptions
      name: BeersLawLabStrings.screen.concentrationStringProperty,
      homeScreenIcon: createScreenIcon()
    }, providedOptions );

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

function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( new Image( concentrationScreenIcon_jpg ), {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

beersLawLab.register( 'ConcentrationScreen', ConcentrationScreen );