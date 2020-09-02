// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for SoluteParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import Vector2IO from '../../../../dot/js/Vector2IO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import beersLawLab from '../../beersLawLab.js';
import SoluteParticle from './SoluteParticle.js';

class SoluteParticleIO extends ObjectIO {

  /**
   * Serializes an instance.  Not called by PhET-iO directly, but rather called from its subtypes.
   * @param soluteParticle
   * @returns {Object}
   * @public
   */
  static toStateObject( soluteParticle ) {
    validate( soluteParticle, this.validator );
    return {
      position: Vector2IO.toStateObject( soluteParticle.positionProperty.get() ),
      orientation: NumberIO.toStateObject( soluteParticle.orientation )
    };
  }

  /**
   * Deserializes an instance.  Not called by PhET-iO directly, but rather called from its subtypes.
   * @param {Object} stateObject
   * @returns {{position: Vector2, orientation: number}}
   * @public
   */
  static deserializeComponents( stateObject ) {
    return {
      position: Vector2IO.fromStateObject( stateObject.position ),
      orientation: NumberIO.fromStateObject( stateObject.orientation )
    };
  }
}

SoluteParticleIO.documentation = 'A particle of solute to add to the solution';
SoluteParticleIO.validator = { isValidValue: value => value instanceof SoluteParticle };
SoluteParticleIO.typeName = 'SoluteParticleIO';
ObjectIO.validateSubtype( SoluteParticleIO );

beersLawLab.register( 'SoluteParticleIO', SoluteParticleIO );
export default SoluteParticleIO;