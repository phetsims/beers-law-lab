// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for BeersLawSolution.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from './BeersLawSolution.js';

const BeersLawSolutionIO = new IOType( 'BeersLawSolutionIO', {
  isValidValue: value => value instanceof BeersLawSolution,
  documentation: 'The solution for the sim',
  supertype: ReferenceIO( IOType.ObjectIO )
} );

beersLawLab.register( 'BeersLawSolutionIO', BeersLawSolutionIO );
export default BeersLawSolutionIO;