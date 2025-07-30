// Copyright 2021-2025, University of Colorado Boulder

/**
 * DetectorMode is an enumeration of the modes for the detector that measures transmittance or absorbance.
 * NOTE: When converting to TypeScript, this was not converted to a string union because we do not want to change
 * the PhET-iO API. String-union values use camelCase, while EnumerationValue uses UPPER_CASE.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import beersLawLab from '../../beersLawLab.js';

export default class DetectorMode extends EnumerationValue {
  public static readonly TRANSMITTANCE = new DetectorMode();
  public static readonly ABSORBANCE = new DetectorMode();

  public static readonly enumeration = new Enumeration( DetectorMode );
}

beersLawLab.register( 'DetectorMode', DetectorMode );