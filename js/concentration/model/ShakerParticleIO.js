// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for ShakerParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Vector2IO from '../../../../dot/js/Vector2IO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import beersLawLab from '../../beersLawLab.js';
import ShakerParticle from './ShakerParticle.js';
import SoluteIO from './SoluteIO.js';
import SoluteParticle from './SoluteParticle.js';
import SoluteParticleIO from './SoluteParticleIO.js';

const ShakerParticleIO = new IOType( 'ShakerParticleIO', {
  isValidValue: value => value instanceof ShakerParticle,
  documentation: 'A particle that comes from the shaker.',
  supertype: SoluteParticleIO,
  toStateObject: shakerParticle => shakerParticle.toStateObject(),
  fromStateObject: stateObject => ShakerParticle.fromStateObject,
  stateToArgsForConstructor: stateObject => {
    const parentDeserializedComponents = SoluteParticle.deserializeComponents( stateObject );

    // This must match SoluteParticle constructor signature
    return [
      SoluteIO.fromStateObject( stateObject.solute ),
      parentDeserializedComponents.position,
      parentDeserializedComponents.orientation,
      Vector2IO.fromStateObject( stateObject.velocity ),
      Vector2IO.fromStateObject( stateObject.acceleration )
    ];
  }
} );

beersLawLab.register( 'ShakerParticleIO', ShakerParticleIO );
export default ShakerParticleIO;