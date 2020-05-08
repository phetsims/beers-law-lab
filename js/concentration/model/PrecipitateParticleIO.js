// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for PrecipitateParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import merge from '../../../../phet-core/js/merge.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import beersLawLab from '../../beersLawLab.js';
import PrecipitateParticle from './PrecipitateParticle.js';
import SoluteIO from './SoluteIO.js';
import SoluteParticleIO from './SoluteParticleIO.js';

class PrecipitateParticleIO extends SoluteParticleIO {

  /**
   * Serializes an instance.
   * @param {PrecipitateParticle} precipitateParticle
   * @returns {Object}
   * @public
   */
  static toStateObject( precipitateParticle ) {
    validate( precipitateParticle, this.validator );
    return merge( SoluteParticleIO.toStateObject( precipitateParticle ), {
      solute: SoluteIO.toStateObject( precipitateParticle.solute )
    } );
  }

  /**
   * Deserializes an instance.
   * @param {Object} stateObject
   * @returns {PrecipitateParticle}
   * @public
   */
  static fromStateObject( stateObject ) {
    return merge( SoluteParticleIO.fromStateObject( stateObject ), {
      solute: SoluteIO.fromStateObject( stateObject.solute )
    } );
  }

  /**
   * @param {Object} state
   * @returns {Array.<*>}
   * @public
   * @override
   */
  static stateToArgsForConstructor( state ) {

    // This must match PrecipitateParticle constructor signature
    return [ state.solute, state.position, state.orientation ];
  }
}

PrecipitateParticleIO.documentation = 'A particle that precipitates at the bottom of a saturated solution.';
PrecipitateParticleIO.validator = { isValidValue: value => value instanceof PrecipitateParticle };
PrecipitateParticleIO.typeName = 'PrecipitateParticleIO';
ObjectIO.validateSubtype( PrecipitateParticleIO );

beersLawLab.register( 'PrecipitateParticleIO', PrecipitateParticleIO );
export default PrecipitateParticleIO;