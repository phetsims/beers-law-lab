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
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';

export default class BeersLawScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: BeersLawModel ) {

    const currentDetailsStringProperty = new DerivedStringProperty( [
      model.light.isOnProperty,
      model.light.wavelengthProperty,
      model.solutionProperty,
      model.solutionInCuvette.concentrationProperty,
      //TODO https://github.com/phetsims/beers-law-lab/issues/358 Need solution units
      model.detector.probe.positionProperty //TODO https://github.com/phetsims/beers-law-lab/issues/358 Need
    ], () => 'TODO' );

    super( {
      playAreaContent: BeersLawLabStrings.a11y.beersLawScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: BeersLawLabStrings.a11y.beersLawScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: BeersLawLabStrings.a11y.beersLawScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

beersLawLab.register( 'BeersLawScreenSummaryContent', BeersLawScreenSummaryContent );