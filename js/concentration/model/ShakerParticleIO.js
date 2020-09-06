// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for ShakerParticle.
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
   * @public
   */
  static toStateObject( shakerParticle ) {
    validate( shakerParticle, this.validator );
    return merge( SoluteParticleIO.toStateObject( shakerParticle ), {
      solute: SoluteIO.toStateObject( shakerParticle.solute ),
      velocity: Vector2IO.toStateObject( shakerParticle.velocity ),
      acceleration: Vector2IO.toStateObject( shakerParticle.acceleration )
    } );
  }

  /**
   * Deserializes an instance.
   * @param {Object} stateObject
   * @returns {ShakerParticle}
   * @public
   */
  static fromStateObject( stateObject ) {
    return merge( SoluteParticleIO.fromStateObject( stateObject ), {
      solute: SoluteIO.fromStateObject( stateObject.solute ),
      velocity: Vector2IO.fromStateObject( stateObject.velocity ),
      acceleration: Vector2IO.fromStateObject( stateObject.acceleration )
    } );
  }

  /**
   * @param {Object} stateObject
   * @returns {Array.<*>}
   * @public
   * @override
   */
  static stateToArgsForConstructor( stateObject ) {
    const parentDeserializedComponents = SoluteParticleIO.deserializeComponents( stateObject );

    // This must match SoluteParticle constructor signature
    return [
      SoluteIO.fromStateObject( stateObject.solute ),
      parentDeserializedComponents.position,
      parentDeserializedComponents.orientation,
      Vector2IO.fromStateObject( stateObject.velocity ),
      Vector2IO.fromStateObject( stateObject.acceleration )
    ];
  }
}

ShakerParticleIO.documentation = 'A particle that comes from the shaker.';
ShakerParticleIO.validator = { isValidValue: value => value instanceof ShakerParticle };
ShakerParticleIO.typeName = 'ShakerParticleIO';
ObjectIO.validateIOType( ShakerParticleIO );

beersLawLab.register( 'ShakerParticleIO', ShakerParticleIO );
export default ShakerParticleIO;