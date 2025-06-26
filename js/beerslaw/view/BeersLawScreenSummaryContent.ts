// Copyright 2025, University of Colorado Boulder

/**
 * BeersLawScreenSummaryContent is the description screen summary for the "Beer's Law" screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BeersLawModel from '../model/BeersLawModel.js';

export default class BeersLawScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: BeersLawModel ) {
    super( {
      playAreaContent: BeersLawLabStrings.a11y.beersLawScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: BeersLawLabStrings.a11y.beersLawScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: BeersLawLabStrings.a11y.beersLawScreen.screenSummary.currentDetailsStringProperty,
      interactionHintContent: BeersLawLabStrings.a11y.beersLawScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

beersLawLab.register( 'BeersLawScreenSummaryContent', BeersLawScreenSummaryContent );