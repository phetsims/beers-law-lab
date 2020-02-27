// Copyright 2017-2019, University of Colorado Boulder

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
import SoluteIO from './SoluteIO.js';
import SoluteParticleIO from './SoluteParticleIO.js';

class PrecipitateParticleIO extends SoluteParticleIO {

  /**
   * Serializes an instance.
   * @param {PrecipitateParticle} precipitateParticle
   * @returns {Object}
   */
  static toStateObject( precipitateParticle ) {
    validate( precipitateParticle, this.validator );
    const soluteParticle = SoluteParticleIO.toStateObject( precipitateParticle );
    return merge( soluteParticle, { solute: SoluteIO.toStateObject( precipitateParticle.solute ) } );
  }

  /**
   * Deserializes an instance.
   * @param {Object} stateObject
   * @returns {PrecipitateParticle}
   */
  static fromStateObject( stateObject ) {
    const soluteParticle = SoluteParticleIO.fromStateObject( stateObject );
    return merge( soluteParticle, { solute: SoluteIO.fromStateObject( stateObject.solute ) } );
  }
}

PrecipitateParticleIO.documentation = 'A particle that shows at the bottom of a saturated solution.';
PrecipitateParticleIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.PrecipitateParticle };
PrecipitateParticleIO.typeName = 'PrecipitateParticleIO';
ObjectIO.validateSubtype( PrecipitateParticleIO );

beersLawLab.register( 'PrecipitateParticleIO', PrecipitateParticleIO );
export default PrecipitateParticleIO;