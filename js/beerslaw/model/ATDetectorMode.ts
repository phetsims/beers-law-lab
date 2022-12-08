// Copyright 2021-2022, University of Colorado Boulder

/**
 * ATDetectorMode is an enumeration of the modes for the AT detector.
 * NOTE: When converting to TypeScript, this was not converted to a string union because we do not want to change
 * the PhET-iO API. String-union values use camelCase, while EnumerationValue uses UPPER_CASE.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import beersLawLab from '../../beersLawLab.js';

export default class ATDetectorMode extends EnumerationValue {
  public static readonly TRANSMITTANCE = new ATDetectorMode();
  public static readonly ABSORBANCE = new ATDetectorMode();

  public static readonly enumeration = new Enumeration( ATDetectorMode );
}

beersLawLab.register( 'ATDetectorMode', ATDetectorMode );