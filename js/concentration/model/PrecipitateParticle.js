// Copyright 2013-2020, University of Colorado Boulder

/**
 * One particle that makes up the precipitate that forms on the bottom of the beaker.
 * Precipitate particles are static (they don't move). They have no associated animation,
 * and they magically appear on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import beersLawLab from '../../beersLawLab.js';
import SoluteIO from './SoluteIO.js';
import SoluteParticle from './SoluteParticle.js';
import SoluteParticleIO from './SoluteParticleIO.js';

class PrecipitateParticle extends SoluteParticle {

  /**
   * @param {Solute} solute
   * @param {Vector2} position position in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @param {Object} [options]
   */
  constructor( solute, position, orientation, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioType: PrecipitateParticle.PrecipitateParticleIO,
      phetioDynamicElement: true
    }, options );

    super( solute.particleColor, solute.particleSize, position, orientation, options );

    // @public (phet-io)
    this.solute = solute;
  }

  /**
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return merge( super.toStateObject(), {

      // TODO: https://github.com/phetsims/phet-io/issues/1709 just call on the core type?
      // TODO: Should PhetioObject.toStateObject default to tandem.phetioID (reference style)?
      solute: SoluteIO.toStateObject( this.solute )
    } );
  }

  // @public
  static stateToArgsForConstructor( stateObject ) {
    const parentDeserializedComponents = SoluteParticle.deserializeComponents( stateObject );

    // This must match PrecipitateParticle constructor signature
    return [
      SoluteIO.fromStateObject( stateObject.solute ),
      parentDeserializedComponents.position,
      parentDeserializedComponents.orientation
    ];
  }
}

PrecipitateParticle.PrecipitateParticleIO = new IOType( 'PrecipitateParticleIO', {
  isValidValue: value => value instanceof PrecipitateParticle,
  supertype: SoluteParticleIO,
  documentation: 'A particle that precipitates at the bottom of a saturated solution.',
  toStateObject: precipitateParticle => precipitateParticle.toStateObject(),
  stateToArgsForConstructor: PrecipitateParticle.stateToArgsForConstructor
} );

beersLawLab.register( 'PrecipitateParticle', PrecipitateParticle );
export default PrecipitateParticle;