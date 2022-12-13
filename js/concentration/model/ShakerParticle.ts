// Copyright 2013-2022, University of Colorado Boulder

/**
 * ShakerParticle is a particle that comes out of the shaker.
 * The particle falls towards the surface of the solution, may bounce off the wall
 * of the beaker, and disappears when it hits the surface of the solution (or bottom of the beaker,
 * if the beaker is empty.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import beersLawLab from '../../beersLawLab.js';
import Solute, { SoluteStateObject } from '../../common/model/Solute.js';
import SoluteParticle, { SoluteParticleOptions } from './SoluteParticle.js';
import Beaker from './Beaker.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = EmptySelfOptions;

type ShakerParticleOptions = SelfOptions & PickRequired<SoluteParticleOptions, 'tandem'>;

type ShakerParticleStateObject = {
  solute: SoluteStateObject;
  position: Vector2StateObject;
  orientation: number;
  velocity: Vector2StateObject;
  acceleration: Vector2StateObject;
};

export type ShakerParticleConstructorParameters = [ Solute, Vector2, number, Vector2, Vector2 ];

export default class ShakerParticle extends SoluteParticle {

  public velocity: Vector2;
  public readonly acceleration: Vector2;

  public constructor( solute: Solute, position: Vector2, orientation: number, initialVelocity: Vector2,
                      acceleration: Vector2, providedOptions: ShakerParticleOptions ) {

    const options = optionize<ShakerParticleOptions, SelfOptions, SoluteParticleOptions>()( {

      // SoluteParticleOptions
      phetioType: ShakerParticle.ShakerParticleIO,
      phetioDynamicElement: true
    }, providedOptions );

    super( solute, position, orientation, options );

    this.velocity = initialVelocity;
    this.acceleration = acceleration;
  }

  /**
   * Propagates the particle to a new position.
   */
  public step( deltaSeconds: number, beaker: Beaker ): void {

    // mutable calls added to remove the number of new objects we create
    this.velocity = this.acceleration.times( deltaSeconds ).add( this.velocity );
    const newPosition = this.velocity.times( deltaSeconds ).add( this.positionProperty.value );

    /*
     * Did the particle hit the left wall of the beaker? If so, change direction.
     * Note that this is a very simplified model, and only deals with the left wall of the beaker,
     * which is the only wall that the particles can hit in practice.
     */
    const minX = beaker.left + this.solute.particleSize;
    if ( newPosition.x <= minX ) {
      newPosition.setX( minX );
      this.velocity.setX( Math.abs( this.velocity.x ) );
    }

    this.positionProperty.value = newPosition;
  }

  public toStateObject(): ShakerParticleStateObject {
    return {
      solute: Solute.SoluteIO.toStateObject( this.solute ),
      position: this.positionProperty.value.toStateObject(),
      orientation: this.orientation,
      velocity: Vector2.Vector2IO.toStateObject( this.velocity ),
      acceleration: Vector2.Vector2IO.toStateObject( this.acceleration )
    };
  }

  // ShakerParticles are created by a PhetioGroup, so we must use stateToArgsForConstructor instead of fromStateObject.
  public static stateToArgsForConstructor( stateObject: ShakerParticleStateObject ): ShakerParticleConstructorParameters {
    return [
      Solute.SoluteIO.fromStateObject( stateObject.solute ),
      Vector2.Vector2IO.fromStateObject( stateObject.position ),
      stateObject.orientation,
      Vector2.Vector2IO.fromStateObject( stateObject.velocity ),
      Vector2.Vector2IO.fromStateObject( stateObject.acceleration )
    ];
  }

  public static readonly ShakerParticleIO = new IOType<ShakerParticle, ShakerParticleStateObject>( 'ShakerParticleIO', {
    documentation: 'A particle that comes from the shaker.',
    valueType: ShakerParticle,
    stateSchema: {
      solute: Solute.SoluteIO,
      position: Vector2.Vector2IO,
      orientation: NumberIO,
      velocity: Vector2.Vector2IO,
      acceleration: Vector2.Vector2IO
    },
    toStateObject: shakerParticle => shakerParticle.toStateObject(),
    stateToArgsForConstructor: ShakerParticle.stateToArgsForConstructor
  } );
}

beersLawLab.register( 'ShakerParticle', ShakerParticle );