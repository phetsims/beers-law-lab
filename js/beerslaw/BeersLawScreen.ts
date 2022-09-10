// Copyright 2013-2022, University of Colorado Boulder

/**
 * The 'Beer's Law' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image } from '../../../scenery/js/imports.js';
import beersLawScreenIcon_jpg from '../../images/beersLawScreenIcon_jpg.js';
import beersLawLab from '../beersLawLab.js';
import BeersLawLabStrings from '../BeersLawLabStrings.js';
import BeersLawModel from './model/BeersLawModel.js';
import BeersLawScreenView from './view/BeersLawScreenView.js';

type SelfOptions = EmptySelfOptions;

type BeersLawScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class BeersLawScreen extends Screen {

  public constructor( providedOptions: BeersLawScreenOptions ) {

    const options = optionize<BeersLawScreenOptions, SelfOptions, ScreenOptions>()( {

      // ScreenOptions
      name: BeersLawLabStrings.screen.beersLaw,
      homeScreenIcon: createScreenIcon()
    }, providedOptions );

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

function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( new Image( beersLawScreenIcon_jpg ), {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

beersLawLab.register( 'BeersLawScreen', BeersLawScreen );