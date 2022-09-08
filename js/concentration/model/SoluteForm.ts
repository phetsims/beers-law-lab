// Copyright 2021-2022, University of Colorado Boulder

/**
 * SoluteForm is an enumeration of the forms that a solute may take in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import beersLawLab from '../../beersLawLab.js';

const SoluteForm = EnumerationDeprecated.byKeys( [ 'SOLID', 'SOLUTION' ] );

beersLawLab.register( 'SoluteForm', SoluteForm );
export default SoluteForm;