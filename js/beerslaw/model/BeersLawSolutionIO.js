// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for BeersLawSolution.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from './BeersLawSolution.js';

class BeersLawSolutionIO extends ReferenceIO( ObjectIO ) {}

BeersLawSolutionIO.documentation = 'The solution for the sim';
BeersLawSolutionIO.validator = { isValidValue: value => value instanceof BeersLawSolution };
BeersLawSolutionIO.typeName = 'BeersLawSolutionIO';
ObjectIO.validateSubtype( BeersLawSolutionIO );

beersLawLab.register( 'BeersLawSolutionIO', BeersLawSolutionIO );
export default BeersLawSolutionIO;