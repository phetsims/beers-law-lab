// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Shaker
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import Vector2IO from '../../../../dot/js/Vector2IO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import Shaker from './Shaker.js';

class ShakerIO extends ObjectIO {

  /**
   * Serializes an instance.
   * @param {Shaker} shaker
   * @returns {Object}
   * @public
   */
  static toStateObject( shaker ) {
    validate( shaker, this.validator );
    return { position: Vector2IO.toStateObject( shaker.previousPosition ) };
  }

  /**
   * Deserializes an instance.
   * @param {Object} stateObject
   * @returns {{position: Vector2}}
   * @public
   */
  static fromStateObject( stateObject ) {
    return { position: Vector2IO.fromStateObject( stateObject.position ) };
  }

  /**
   * Set the position of the shaker using the value parsed in fromStateObject.  This method is automatically called by
   * phetioEngine.js when setting the state.
   * @param {Shaker} shaker
   * @param {{position: Vector2}} fromStateObject - the value returned by fromStateObject
   * @public
   * @override
   */
  static setValue( shaker, fromStateObject ) {
    validate( shaker, this.validator );
    shaker.previousPosition.set( fromStateObject.position );
  }
}

ShakerIO.methods = {
  setValue: {
    returnType: VoidIO,
    parameterTypes: [ ObjectIO ],
    implementation: value => this.phetioObject.previousPosition.set( Vector2IO.fromStateObject( value ) ),
    documentation: 'Load the values recorded in getState',
    invocableForReadOnlyElements: false
  }
};
ShakerIO.documentation = 'The Shaker that releases solute';
ShakerIO.validator = { isValidValue: value => value instanceof Shaker };
ObjectIO.validateSubtype( ShakerIO );

beersLawLab.register( 'ShakerIO', ShakerIO );
export default ShakerIO;