// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for ShakerParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import Vector2IO from '../../../../dot/js/Vector2IO.js';
import merge from '../../../../phet-core/js/merge.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import beersLawLab from '../../beersLawLab.js';
import ShakerParticle from './ShakerParticle.js';
import SoluteIO from './SoluteIO.js';
import SoluteParticleIO from './SoluteParticleIO.js';

class ShakerParticleIO extends SoluteParticleIO {

  /**
   * Serializes an instance.
   * @param {ShakerParticle} shakerParticle
   * @returns {Object}
   */
  static toStateObject( shakerParticle ) {
    validate( shakerParticle, this.validator );
    const soluteParticle = SoluteParticleIO.toStateObject( shakerParticle );
    return merge( soluteParticle, {
      solute: SoluteIO.toStateObject( shakerParticle.solute ),
      velocity: Vector2IO.toStateObject( shakerParticle.velocity ),
      acceleration: Vector2IO.toStateObject( shakerParticle.acceleration )
    } );
  }

  /**
   * Deserializes an instance.
   * @param {Object} stateObject
   * @returns {ShakerParticle}
   */
  static fromStateObject( stateObject ) {
    const soluteParticle = SoluteParticleIO.fromStateObject( stateObject );
    return merge( soluteParticle, {
      solute: SoluteIO.fromStateObject( stateObject.solute ),
      velocity: Vector2IO.fromStateObject( stateObject.velocity ),
      acceleration: Vector2IO.fromStateObject( stateObject.acceleration )
    } );
  }
}

ShakerParticleIO.documentation = 'A particle that comes from the shaker.';
ShakerParticleIO.validator = { isValidValue: v => v instanceof ShakerParticle };
ShakerParticleIO.typeName = 'ShakerParticleIO';
ObjectIO.validateSubtype( ShakerParticleIO );

beersLawLab.register( 'ShakerParticleIO', ShakerParticleIO );
export default ShakerParticleIO;