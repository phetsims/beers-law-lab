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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BLLConstants from '../../common/BLLConstants.js';
import ATDetectorMode from '../model/ATDetectorMode.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import ConcentrationTransform from '../model/ConcentrationTransform.js';

export default class BeersLawScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: BeersLawModel ) {

    // Light state (on/off), with support for dynamic locale.
    const lightStateProperty = new DerivedProperty( [
        model.light.isOnProperty,
        BeersLawLabStrings.a11y.onStringProperty,
        BeersLawLabStrings.a11y.offStringProperty
      ],
      ( isOn, onString, offString ) => isOn ? onString : offString );

    const solutionNameProperty = DerivedProperty.deriveAny( [ model.solutionProperty, ...BLLConstants.SOLUTE_NAME_PROPERTIES ],
      () => model.solutionProperty.value.nameProperty.value );

    // Wavelength value with the correct number of decimal places, including trailing zeros.
    const wavelengthValueStringProperty = new DerivedStringProperty( [ model.light.wavelengthProperty ],
      wavelength => toFixed( wavelength, BLLConstants.WAVELENGTH_DECIMAL_PLACES ) );

    // Concentration value with the correct number of decimal places, including trailing zeros.
    const concentrationValueStringProperty = new DerivedStringProperty( [ model.solutionProperty, model.solutionInCuvette.concentrationProperty ],
      ( solution, concentration ) => toFixed( solution.concentrationTransform.modelToView( concentration ), BLLConstants.DECIMAL_PLACES_CONCENTRATION ) );

    // Absorbance value with the correct number of decimal places, including trailing zeros.
    const absorbanceValueStringProperty = new DerivedStringProperty( [ model.detector.absorbanceProperty ],
      absorbance => ( absorbance === null ) ? '' : toFixed( absorbance, BLLConstants.ABSORBANCE_DECIMAL_PLACES ) );

    // Transmittance value with the correct number of decimal places, including trailing zeros.
    const transmittanceValueStringProperty = new DerivedStringProperty( [ model.detector.transmittanceProperty ],
      transmittance => ( transmittance === null ) ? '' : toFixed( transmittance * 100, BLLConstants.TRANSMITTANCE_DECIMAL_PLACES ) );

    // Concentration units, with singular vs plural matched to the absorbance value, and support for dynamic locale.
    const concentrationUnitsStringProperty = new DerivedStringProperty( [
        model.solutionProperty,
        model.solutionInCuvette.concentrationProperty,
        BeersLawLabStrings.a11y.unitsDescription.microMoleStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.microMolesStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.milliMoleStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.milliMolesStringProperty
      ],
      ( solution, concentration, microMoleString, microMolesString, milliMoleString, milliMolesString ) => {
        if ( solution.concentrationTransform === ConcentrationTransform.mM ) {
          return ( concentration === 1 ) ? milliMoleString : milliMolesString;
        }
        else {
          return ( concentration === 1 ) ? microMoleString : microMolesString;
        }
      } );

    // Transmittance units, with singular vs plural matched to the transmittance value, and support for dynamic locale.
    const transmittanceUnitsDescriptionProperty = new DerivedStringProperty( [
        model.detector.absorbanceProperty,
        BeersLawLabStrings.a11y.unitsDescription.percentSingularStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.percentPluralStringProperty
      ],
      ( absorbance, percentSingularString, percentPluralString ) => ( absorbance === 1 ) ? percentSingularString : percentPluralString );

    // Localized strings that are used directly in the derivation of currentDetailsStringProperty.
    const currentDetailsStringProperties = [
      BeersLawLabStrings.a11y.beersLawScreen.screenSummary.currentDetails.noMeasurementStringProperty,
      BeersLawLabStrings.a11y.beersLawScreen.screenSummary.currentDetails.measuredAbsorbanceStringProperty,
      BeersLawLabStrings.a11y.beersLawScreen.screenSummary.currentDetails.measuredTransmittanceStringProperty
    ];

    const currentDetailsStringProperty = DerivedStringProperty.deriveAny( [
      ...currentDetailsStringProperties,
      model.light.isOnProperty,
      model.detector.isInBeamProperty,
      model.detector.modeProperty,
      lightStateProperty,
      wavelengthValueStringProperty,
      BeersLawLabStrings.a11y.unitsDescription.nanometersStringProperty,
      concentrationValueStringProperty,
      concentrationUnitsStringProperty,
      solutionNameProperty,
      absorbanceValueStringProperty,
      transmittanceValueStringProperty
    ], () => {
      if ( !model.light.isOnProperty || !model.detector.isInBeamProperty.value ) {

        // AT probe is not measuring anything.
        return StringUtils.fillIn( BeersLawLabStrings.a11y.beersLawScreen.screenSummary.currentDetails.noMeasurementStringProperty.value, {
          onOff: lightStateProperty.value,
          wavelength: wavelengthValueStringProperty.value,
          wavelengthUnits: BeersLawLabStrings.a11y.unitsDescription.nanometersStringProperty.value,
          concentration: concentrationValueStringProperty.value,
          concentrationUnits: concentrationUnitsStringProperty.value,
          solutionName: solutionNameProperty.value
        } );
      }
      else if ( model.detector.modeProperty.value === ATDetectorMode.TRANSMITTANCE ) {

        // AT probe is measuring transmittance.
        return StringUtils.fillIn( BeersLawLabStrings.a11y.beersLawScreen.screenSummary.currentDetails.measuredTransmittanceStringProperty.value, {
          onOff: lightStateProperty.value,
          wavelength: wavelengthValueStringProperty.value,
          wavelengthUnits: BeersLawLabStrings.a11y.unitsDescription.nanometersStringProperty.value,
          concentration: concentrationValueStringProperty.value,
          concentrationUnits: concentrationUnitsStringProperty.value,
          solutionName: solutionNameProperty.value,
          transmittance: transmittanceValueStringProperty.value,
          transmittanceUnits: transmittanceUnitsDescriptionProperty.value
        } );
      }
      else {

        // AT probe is measuring absorbance.
        return StringUtils.fillIn( BeersLawLabStrings.a11y.beersLawScreen.screenSummary.currentDetails.measuredAbsorbanceStringProperty.value, {
          onOff: lightStateProperty.value,
          wavelength: model.light.wavelengthProperty.value,
          wavelengthUnits: BeersLawLabStrings.a11y.unitsDescription.nanometersStringProperty.value,
          concentration: concentrationValueStringProperty.value,
          concentrationUnits: concentrationUnitsStringProperty.value,
          solutionName: solutionNameProperty.value,
          absorbance: absorbanceValueStringProperty.value
          // Absorbance has no units.
        } );
      }
    } );

    super( {
      playAreaContent: BeersLawLabStrings.a11y.beersLawScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: BeersLawLabStrings.a11y.beersLawScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: BeersLawLabStrings.a11y.beersLawScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

beersLawLab.register( 'BeersLawScreenSummaryContent', BeersLawScreenSummaryContent );