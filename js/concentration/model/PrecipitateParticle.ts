// Copyright 2013-2021, University of Colorado Boulder

// @ts-nocheck
/**
 * One particle that makes up the precipitate that forms on the bottom of the beaker.
 * Precipitate particles are static (they don't move). They have no associated animation,
 * and they magically appear on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import SoluteParticle from './SoluteParticle.js';

class PrecipitateParticle extends SoluteParticle {

  /**
   * @param {Solute} solute
   * @param {Vector2} position position in the beaker's coordinate frame
   * @param {number} orientation in radians
   * @param {Object} [options]
   */
  constructor( solute, position, orientation, options ) {
    assert && assert( solute instanceof Solute );
    assert && assert( position instanceof Vector2 );
    assert && assert( typeof orientation === 'number' );

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
      solute: Solute.SoluteIO.toStateObject( this.solute )
    } );
  }

  // @public
  static stateToArgsForConstructor( stateObject ) {
    const parentDeserializedComponents = SoluteParticle.deserializeComponents( stateObject );

    // This must match PrecipitateParticle constructor signature
    return [
      Solute.SoluteIO.fromStateObject( stateObject.solute ),
      parentDeserializedComponents.position,
      parentDeserializedComponents.orientation
    ];
  }
}

PrecipitateParticle.PrecipitateParticleIO = new IOType( 'PrecipitateParticleIO', {
  valueType: PrecipitateParticle,
  supertype: SoluteParticle.SoluteParticleIO,
  documentation: 'A particle that precipitates at the bottom of a saturated solution.',
  toStateObject: precipitateParticle => precipitateParticle.toStateObject(),
  stateToArgsForConstructor: PrecipitateParticle.stateToArgsForConstructor,
  stateSchema: {
    solute: Solute.SoluteIO
  }
} );

beersLawLab.register( 'PrecipitateParticle', PrecipitateParticle );
export default PrecipitateParticle;