// Copyright 2013-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/beers-law-lab/issues/265 address TODOs in this file
/**
 * PrecipitateParticle is one particle that makes up the precipitate that forms on the bottom of the beaker.
 * PrecipitateParticles particles are static (they don't move). They have no associated animation,
 * and they magically appear on the bottom of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import SoluteParticle, { SoluteParticleOptions, SoluteParticleStateObject } from './SoluteParticle.js';

type SelfOptions = EmptySelfOptions;

type PrecipitateParticleOptions = SelfOptions & PickRequired<SoluteParticleOptions, 'tandem'>;

type PrecipitateParticleStateObject = SoluteParticleStateObject;

export type PrecipitateParticleConstructorParameters = [ Solute, Vector2, number ];

export default class PrecipitateParticle extends SoluteParticle {

  public constructor( solute: Solute, position: Vector2, orientation: number, providedOptions: PrecipitateParticleOptions ) {

    const options = optionize<PrecipitateParticleOptions, SelfOptions, SoluteParticleOptions>()( {

      // SoluteParticleOptions
      phetioType: PrecipitateParticle.PrecipitateParticleIO
    }, providedOptions );

    super( solute, position, orientation, options );
  }

  //TODO toStateObject is the same as super.toStateObject, should I include it for clarity?

  //TODO OK that this gets nothing from super, while Resistor does?
  //TODO This method is poorly named. It's not args for constructor. It's args for PrecipitateParticleGroup.createElement.
  private static stateToArgsForConstructor( stateObject: PrecipitateParticleStateObject ): PrecipitateParticleConstructorParameters {
    return [
      Solute.SoluteIO.fromStateObject( stateObject.solute ),
      Vector2.Vector2IO.fromStateObject( stateObject.position ),
      stateObject.orientation
    ];
  }

  public static readonly PrecipitateParticleIO =
    new IOType<PrecipitateParticle, PrecipitateParticleStateObject>( 'PrecipitateParticleIO', {
      valueType: PrecipitateParticle,
      supertype: SoluteParticle.SoluteParticleIO,
      documentation: 'A particle that precipitates at the bottom of a saturated solution.',
      //TODO do I need stateSchema, or is it inherited from supertype?
      toStateObject: precipitateParticle => precipitateParticle.toStateObject(),

      // PrecipitateParticle is instantiated by a PhetioGroup, so we must use stateToArgsForConstructor instead of fromStateObject.
      stateToArgsForConstructor: stateObject => PrecipitateParticle.stateToArgsForConstructor( stateObject )
    } );
}

beersLawLab.register( 'PrecipitateParticle', PrecipitateParticle );