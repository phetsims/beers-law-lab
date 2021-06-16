[object Promise]

/**
 * SoluteForm is an enumeration of the forms that a solute may take in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import beersLawLab from '../../beersLawLab.js';

const SoluteForm = Enumeration.byKeys( [ 'SOLID', 'SOLUTION' ] );

beersLawLab.register( 'SoluteForm', SoluteForm );
export default SoluteForm;