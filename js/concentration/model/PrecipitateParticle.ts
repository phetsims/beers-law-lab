// Copyright 2013-2022, University of Colorado Boulder

/**
 * PrecipitateParticle is one particle that makes up the precipitate that forms on the bottom of the beaker.
 * PrecipitateParticles particles are static (they don't move). They have no associated animation,
 * and they magically appear on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import Solute, { SoluteStateObject } from '../../common/model/Solute.js';
import SoluteParticle, { SoluteParticleOptions } from './SoluteParticle.js';

type SelfOptions = EmptySelfOptions;

type PrecipitateParticleOptions = SelfOptions & PickRequired<SoluteParticleOptions, 'tandem'>;

type PrecipitateParticleStateObject = {
  solute: SoluteStateObject;
  position: Vector2StateObject;
  orientation: number;
};

export type PrecipitateParticleConstructorParameters = [ Solute, Vector2, number ];

export default class PrecipitateParticle extends SoluteParticle {

  public constructor( solute: Solute, position: Vector2, orientation: number, providedOptions: PrecipitateParticleOptions ) {

    const options = optionize<PrecipitateParticleOptions, SelfOptions, SoluteParticleOptions>()( {
      phetioType: PrecipitateParticle.PrecipitateParticleIO,
      phetioDynamicElement: true
    }, providedOptions );

    super( solute, position, orientation, options );
  }

  public toStateObject(): PrecipitateParticleStateObject {
    return {
      solute: Solute.SoluteIO.toStateObject( this.solute ),
      position: this.positionProperty.value.toStateObject(),
      orientation: this.orientation
    };
  }

  // PrecipitateParticles are created by a PhetioGroup, so we must use stateToArgsForConstructor instead of fromStateObject.
  public static stateToArgsForConstructor( stateObject: PrecipitateParticleStateObject ): PrecipitateParticleConstructorParameters {
    return [
      Solute.SoluteIO.fromStateObject( stateObject.solute ),
      Vector2.Vector2IO.fromStateObject( stateObject.position ),
      stateObject.orientation
    ];
  }

  public static readonly PrecipitateParticleIO =
    new IOType<PrecipitateParticle, PrecipitateParticleStateObject>( 'PrecipitateParticleIO', {
      valueType: PrecipitateParticle,
      documentation: 'A particle that precipitates at the bottom of a saturated solution.',
      stateSchema: {
        solute: Solute.SoluteIO,
        position: Vector2.Vector2IO,
        orientation: NumberIO
      },
      toStateObject: precipitateParticle => precipitateParticle.toStateObject(),
      stateToArgsForConstructor: PrecipitateParticle.stateToArgsForConstructor
    } );
}

beersLawLab.register( 'PrecipitateParticle', PrecipitateParticle );