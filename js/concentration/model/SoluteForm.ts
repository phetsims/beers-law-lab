// Copyright 2021-2022, University of Colorado Boulder

/**
 * SoluteForm is an enumeration of the forms that a solute may take in this sim.
 * NOTE: When converting to TypeScript, this was not converted to a string union because we do not want to change
 * the PhET-iO API. String-union values use camelCase, while EnumerationValue uses UPPER_CASE.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import beersLawLab from '../../beersLawLab.js';

export default class SoluteForm extends EnumerationValue {
  public static readonly SOLID = new SoluteForm();
  public static readonly SOLUTION = new SoluteForm();

  public static readonly enumeration = new Enumeration( SoluteForm );
}

beersLawLab.register( 'SoluteForm', SoluteForm );