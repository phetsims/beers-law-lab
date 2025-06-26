// Copyright 2025, University of Colorado Boulder

/**
 * ConcentrationScreenSummaryContent is the description screen summary for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import ConcentrationModel from '../model/ConcentrationModel.js';

export default class ConcentrationScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: ConcentrationModel ) {
    super( {
      playAreaContent: BeersLawLabStrings.a11y.concentrationScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: BeersLawLabStrings.a11y.concentrationScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetailsStringProperty,
      interactionHintContent: BeersLawLabStrings.a11y.concentrationScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

beersLawLab.register( 'ConcentrationScreenSummaryContent', ConcentrationScreenSummaryContent );