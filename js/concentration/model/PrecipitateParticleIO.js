// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for PrecipitateParticle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import beersLawLab from '../../beersLawLab.js';
import PrecipitateParticle from './PrecipitateParticle.js';
import SoluteIO from './SoluteIO.js';
import SoluteParticleIO from './SoluteParticleIO.js';

const PrecipitateParticleIO = new IOType( 'PrecipitateParticleIO', {
  isValidValue: value => value instanceof PrecipitateParticle,
  supertype: SoluteParticleIO,
  documentation: 'A particle that precipitates at the bottom of a saturated solution.',

  /**
   * Serializes an instance.
   * @param {PrecipitateParticle} precipitateParticle
   * @returns {Object}
   * @public
   */
  toStateObject( precipitateParticle ) {
    return merge( SoluteParticleIO.toStateObject( precipitateParticle ), {
      solute: SoluteIO.toStateObject( precipitateParticle.solute )
    } );
  },

  /**
   * @param {Object} stateObject
   * @returns {Array.<*>}
   * @public
   * @override
   */
  stateToArgsForConstructor( stateObject ) {
    const parentDeserializedComponents = SoluteParticleIO.deserializeComponents( stateObject );

    // This must match PrecipitateParticle constructor signature
    return [
      SoluteIO.fromStateObject( stateObject.solute ),
      parentDeserializedComponents.position,
      parentDeserializedComponents.orientation
    ];
  }
} );

beersLawLab.register( 'PrecipitateParticleIO', PrecipitateParticleIO );
export default PrecipitateParticleIO;