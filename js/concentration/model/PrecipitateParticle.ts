// Copyright 2013-2022, University of Colorado Boulder

/**
 * PrecipitateParticle is one particle that makes up the precipitate that forms on the bottom of the beaker.
 * Precipitate particles are static (they don't move). They have no associated animation,
 * and they magically appear on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import beersLawLab from '../../beersLawLab.js';
import Solute, { SoluteStateObject } from '../../common/model/Solute.js';
import SoluteParticle, { SoluteParticleOptions, SoluteParticleStateObject } from './SoluteParticle.js';

type SelfOptions = EmptySelfOptions;

type PrecipitateParticleOptions = SelfOptions & PickRequired<SoluteParticleOptions, 'tandem'>;

type PrecipitateParticleStateObject = {
  solute: SoluteStateObject;
} & SoluteParticleStateObject;

export type PrecipitateParticleConstructorParameters = [ Solute, Vector2, number ];

export default class PrecipitateParticle extends SoluteParticle {

  public readonly solute: Solute;

  public constructor( solute: Solute, position: Vector2, orientation: number, providedOptions: PrecipitateParticleOptions ) {

    const options = optionize<PrecipitateParticleOptions, SelfOptions, SoluteParticleOptions>()( {
      phetioType: PrecipitateParticle.PrecipitateParticleIO,
      phetioDynamicElement: true
    }, providedOptions );

    super( solute.particleColor, solute.particleSize, position, orientation, options );

    this.solute = solute;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override toStateObject(): PrecipitateParticleStateObject {
    return combineOptions<PrecipitateParticleStateObject>( super.toStateObject(), {
      solute: Solute.SoluteIO.toStateObject( this.solute )
    } );
  }

  public static stateToArgsForConstructor( stateObject: PrecipitateParticleStateObject ): PrecipitateParticleConstructorParameters {
    const superComponents = SoluteParticle.deserializeComponents( stateObject );
    return [
      Solute.SoluteIO.fromStateObject( stateObject.solute ),
      superComponents.position,
      superComponents.orientation
    ];
  }

  public static readonly PrecipitateParticleIO =
    new IOType<PrecipitateParticle, PrecipitateParticleStateObject>( 'PrecipitateParticleIO', {
      valueType: PrecipitateParticle,
      supertype: SoluteParticle.SoluteParticleIO,
      documentation: 'A particle that precipitates at the bottom of a saturated solution.',
      toStateObject: precipitateParticle => precipitateParticle.toStateObject(),
      stateToArgsForConstructor: PrecipitateParticle.stateToArgsForConstructor,
      stateSchema: {
        solute: Solute.SoluteIO
      }
    } );
}

beersLawLab.register( 'PrecipitateParticle', PrecipitateParticle );