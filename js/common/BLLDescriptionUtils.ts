// Copyright 2025, University of Colorado Boulder

/**
 * BLLDescriptionUtils is a collection of utility functions related to description strings in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BLLPreferences from './model/BLLPreferences.js';
import BeersLawLabStrings from '../BeersLawLabStrings.js';
import beersLawLab from '../beersLawLab.js';

export default class BLLDescriptionUtils {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Gets the concentration units that match the preference setting, and the singular/plural nature of the value.
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
}

beersLawLab.register( 'BLLDescriptionUtils', BLLDescriptionUtils );