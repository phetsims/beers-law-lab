// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for SoluteParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Vector2IO from '../../../../dot/js/Vector2IO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import SoluteParticle from './SoluteParticle.js';

const SoluteParticleIO = new IOType( 'SoluteParticleIO', {
  isValidValue: value => value instanceof SoluteParticle,
  documentation: 'A particle of solute to add to the solution',
  toStateObject: soluteParticle => ( {
    position: Vector2IO.toStateObject( soluteParticle.positionProperty.get() ),
    orientation: NumberIO.toStateObject( soluteParticle.orientation )
  } ),

  // TODO https://github.com/phetsims/tandem/issues/211 delete this?
  deserializeComponents( stateObject ) {
    return {
      position: Vector2IO.fromStateObject( stateObject.position ),
      orientation: NumberIO.fromStateObject( stateObject.orientation )
    };
  }
} );

beersLawLab.register( 'SoluteParticleIO', SoluteParticleIO );
export default SoluteParticleIO;