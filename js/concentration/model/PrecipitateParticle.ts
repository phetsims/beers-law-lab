// Copyright 2013-2021, University of Colorado Boulder

/**
 * One particle that makes up the precipitate that forms on the bottom of the beaker.
 * Precipitate particles are static (they don't move). They have no associated animation,
 * and they magically appear on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import SoluteParticle, { SoluteParticleOptions, SoluteParticleStateObject } from './SoluteParticle.js';

type SelfOptions = EmptySelfOptions;

type PrecipitateParticleOptions = SelfOptions & PickRequired<SoluteParticleOptions, 'tandem'>;

type PrecipitateParticleStateObject = {
  //TODO https://github.com/phetsims/beers-law-lab/issues/287 what is the state type of solute?
  //solute: ??
} & SoluteParticleStateObject;

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

  public override toStateObject(): PrecipitateParticleStateObject {
    return merge( super.toStateObject(), {
      solute: Solute.SoluteIO.toStateObject( this.solute )
    } );
  }

  // @ts-ignore TODO https://github.com/phetsims/beers-law-lab/issues/287 return type?
  public static stateToArgsForConstructor( stateObject: PrecipitateParticleStateObject ): IntentionalAny {
    const parentDeserializedComponents = SoluteParticle.deserializeComponents( stateObject );

    // This must match PrecipitateParticle constructor signature
    return [
      // @ts-ignore TODO https://github.com/phetsims/beers-law-lab/issues/287 TS error
      Solute.SoluteIO.fromStateObject( stateObject.solute ),
      parentDeserializedComponents.position,
      parentDeserializedComponents.orientation
    ];
  }

  public static readonly PrecipitateParticleIO =
    new IOType<PrecipitateParticle, PrecipitateParticleStateObject>( 'PrecipitateParticleIO', {
      valueType: PrecipitateParticle,
      // @ts-ignore TODO https://github.com/phetsims/beers-law-lab/issues/287 TS error
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