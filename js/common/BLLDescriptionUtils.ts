// Copyright 2025, University of Colorado Boulder

/**
 * BLLDescriptionUtils is a collection of utility functions related to description strings in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BLLPreferences from './model/BLLPreferences.js';
import BeersLawLabStrings from '../BeersLawLabStrings.js';
import beersLawLab from '../beersLawLab.js';
import BLLConstants from './BLLConstants.js';

export default class BLLDescriptionUtils {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Gets the concentration units that match the preference setting, and the singular/plural nature of the value.
   * If you use this method in a derivation, include the localized string Properties used herein as dependencies.
   */
  public static getConcentrationUnits( concentration: number ): string {
    let units;
    if ( BLLPreferences.concentrationMeterUnitsProperty.value === 'molesPerLiter' ) {
      if ( concentration === 1 ) {
        units = BeersLawLabStrings.a11y.unitsDescription.molePerLiterStringProperty.value;
      }
      else {
        units = BeersLawLabStrings.a11y.unitsDescription.molesPerLiterStringProperty.value;
      }
    }
    else {
      if ( concentration === 1 ) {
        units = BeersLawLabStrings.a11y.unitsDescription.percentSingularStringProperty.value;
      }
      else {
        units = BeersLawLabStrings.a11y.unitsDescription.percentPluralStringProperty.value;
      }
    }
    return units;
  }

  /**
   * Gets the color name that corresponds to the specified wavelength.
   * If you use this method in a derivation, include the localized string Properties used herein as dependencies.
   */
  public static getColorDescriptionString( wavelength: number ): string {
    assert && assert( BLLConstants.WAVELENGTH_RANGE.contains( wavelength ), `invalid wavelength: ${wavelength}` );
    assert && assert( BLLConstants.WAVELENGTH_RANGE.min === 380 );
    assert && assert( BLLConstants.WAVELENGTH_RANGE.max === 780 );

    if ( wavelength >= 380 && wavelength < 450 ) {
      return BeersLawLabStrings.a11y.colorNames.violetStringProperty.value;
    }
    else if ( wavelength >= 450 && wavelength < 495 ) {
      return BeersLawLabStrings.a11y.colorNames.blueStringProperty.value;
    }
    else if ( wavelength >= 495 && wavelength < 570 ) {
      return BeersLawLabStrings.a11y.colorNames.greenStringProperty.value;
    }
    else if ( wavelength >= 570 && wavelength < 590 ) {
      return BeersLawLabStrings.a11y.colorNames.yellowStringProperty.value;
    }
    else if ( wavelength >= 590 && wavelength < 620 ) {
      return BeersLawLabStrings.a11y.colorNames.orangeStringProperty.value;
    }
    else {
      return BeersLawLabStrings.a11y.colorNames.redStringProperty.value;
    }
  }
}

beersLawLab.register( 'BLLDescriptionUtils', BLLDescriptionUtils );