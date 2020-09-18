// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for SoluteParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import beersLawLab from '../../beersLawLab.js';
import SoluteParticle from './SoluteParticle.js';

const SoluteParticleIO = new IOType( 'SoluteParticleIO', {
  isValidValue: value => value instanceof SoluteParticle,
  documentation: 'A particle of solute to add to the solution',
  toStateObject: soluteParticle => soluteParticle.toStateObject()
} );

beersLawLab.register( 'SoluteParticleIO', SoluteParticleIO );
export default SoluteParticleIO;