// Copyright 2025, University of Colorado Boulder

/**
 * ConcentrationScreenSummaryContent is the description screen summary for the 'Concentration' screen.
 * See https://github.com/phetsims/beers-law-lab/issues/358.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import ConcentrationModel from '../model/ConcentrationModel.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BLLConstants from '../../common/BLLConstants.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { ConcentrationProbeNode } from './ConcentrationProbeNode.js';
import BLLDescriptionUtils from '../../common/BLLDescriptionUtils.js';

export default class ConcentrationScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: ConcentrationModel, concentrationProbeNode: ConcentrationProbeNode ) {

    // Solute name, including support for dynamic locale.
    const soluteNameProperty = DerivedProperty.deriveAny(
      [ model.soluteProperty, ...model.getSoluteNameProperties() ],
      () => model.soluteProperty.value.nameProperty.value );

    // Concentration value with the correct number of decimal places, including trailing zeros.
    const concentrationValueStringProperty = new DerivedProperty( [
        BLLPreferences.concentrationMeterUnitsProperty,
        model.solution.concentrationProperty,
        model.solution.percentConcentrationProperty
      ],
      ( concentrationMeterUnits, concentration, percentConcentration ) =>
        ( concentrationMeterUnits === 'molesPerLiter' ) ?
        toFixed( concentration, BLLConstants.DECIMAL_PLACES_CONCENTRATION_MOLES_PER_LITER ) :
        toFixed( percentConcentration, BLLConstants.DECIMAL_PLACES_CONCENTRATION_PERCENT )
    );

    // Concentration units, with singular vs plural matched to the concentration value, and support for dynamic locale.
    const concentrationUnitsDescriptionProperty = new DerivedStringProperty( [
        model.solution.concentrationProperty,

        // Properties used by BLLDescriptionUtils.getConcentrationUnits
        BLLPreferences.concentrationMeterUnitsProperty,
        BeersLawLabStrings.a11y.unitsDescription.molePerLiterStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.molesPerLiterStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.percentSingularStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.percentPluralStringProperty
      ],
      concentration => BLLDescriptionUtils.getConcentrationUnits( concentration ) );

    // Sentence that describes whether the solution is saturated.
    const saturatedSentenceProperty = new DerivedProperty( [
      model.solution.isSaturatedProperty,
      BeersLawLabStrings.a11y.solutionIsSaturatedStringProperty,
      BeersLawLabStrings.a11y.solutionIsNotSaturatedStringProperty
    ], ( isSaturated, solutionIsSaturatedString, solutionIsNotSaturatedString ) =>
      isSaturated ? solutionIsSaturatedString : solutionIsNotSaturatedString );

    // Localized strings that are used directly in the derivation of currentDetailsStringProperty.
    const currentDetailsStringProperties = [
      BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetails.beakerEmptyStringProperty,
      BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetails.onlyParticlesStringProperty,
      BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetails.onlyWaterStringProperty,
      BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetails.solutionConcentrationMeasuredStringProperty,
      BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetails.solutionConcentrationNotMeasuredStringProperty
    ];

    const currentDetailsStringProperty = DerivedStringProperty.deriveAny( [
      ...currentDetailsStringProperties,
      model.solution.volumeProperty,
      model.solution.concentrationProperty,
      model.solution.precipitateMolesProperty,

      // isInSolution() is computed in the view, so we cannot observe model.concentrationMeter.probe.positionProperty.
      concentrationProbeNode.boundsProperty,
      soluteNameProperty,
      concentrationValueStringProperty,
      concentrationUnitsDescriptionProperty
    ], () => {
      if ( model.solution.volumeProperty.value === 0 ) {

        if ( model.solution.precipitateMolesProperty.value === 0 ) {

          // Empty beaker
          return BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetails.beakerEmptyStringProperty.value;
        }
        else {

          // Particles in beaker, but no solution.
          return StringUtils.fillIn( BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetails.onlyParticlesStringProperty.value, {
            soluteName: soluteNameProperty.value
          } );
        }
      }
      else if ( model.solution.concentrationProperty.value === 0 ) {

        // Only water in the beaker
        return StringUtils.fillIn( BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetails.onlyWaterStringProperty.value, {
          units: concentrationUnitsDescriptionProperty.value
        } );
      }
      else if ( concentrationProbeNode.isInSolution() ) {

        // Concentration probe is in the solution.
        return StringUtils.fillIn( BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetails.solutionConcentrationMeasuredStringProperty.value, {
          soluteName: soluteNameProperty.value,
          concentration: concentrationValueStringProperty.value,
          units: concentrationUnitsDescriptionProperty.value,
          saturationSentence: saturatedSentenceProperty.value
        } );
      }
      else {

        // Concentration probe is not in the solution.
        return StringUtils.fillIn( BeersLawLabStrings.a11y.concentrationScreen.screenSummary.currentDetails.solutionConcentrationNotMeasuredStringProperty.value, {
          soluteName: soluteNameProperty.value,
          concentration: concentrationValueStringProperty.value,
          units: concentrationUnitsDescriptionProperty.value,
          saturationSentence: saturatedSentenceProperty.value
        } );
      }
    } );

    super( {
      isDisposable: false,
      playAreaContent: BeersLawLabStrings.a11y.concentrationScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: BeersLawLabStrings.a11y.concentrationScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: BeersLawLabStrings.a11y.concentrationScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

beersLawLab.register( 'ConcentrationScreenSummaryContent', ConcentrationScreenSummaryContent );