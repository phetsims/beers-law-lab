// Copyright 2013-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/beers-law-lab/issues/265 address TODOs in this file
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
import Solute from '../../common/model/Solute.js';
import SoluteParticle, { SoluteParticleOptions, SoluteParticleStateObject } from './SoluteParticle.js';
import Beaker from './Beaker.js';

type SelfOptions = EmptySelfOptions;

type ShakerParticleOptions = SelfOptions & PickRequired<SoluteParticleOptions, 'tandem'>;

type ShakerParticleStateObject = SoluteParticleStateObject & {
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
      phetioType: ShakerParticle.ShakerParticleIO
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

  //TODO Sounds like I need this because default toStateObject will not handle supertype.
  protected override toStateObject(): ShakerParticleStateObject {
    return {
      //TODO Is this the preferred pattern when there is an IOType supertype?
      ...super.toStateObject(),
      velocity: Vector2.Vector2IO.toStateObject( this.velocity ),
      acceleration: Vector2.Vector2IO.toStateObject( this.acceleration )
    };
  }

  //TODO OK that this gets nothing from super, while Resistor does?
  //TODO This method is poorly named. It's not args for constructor. It's args for ShakerParticleGroup.createElement.
  private static stateToArgsForConstructor( stateObject: ShakerParticleStateObject ): ShakerParticleConstructorParameters {
    return [
      Solute.SoluteIO.fromStateObject( stateObject.solute ),
      Vector2.Vector2IO.fromStateObject( stateObject.position ),
      stateObject.orientation,
      Vector2.Vector2IO.fromStateObject( stateObject.velocity ),
      Vector2.Vector2IO.fromStateObject( stateObject.acceleration )
    ];
  }

  public static readonly ShakerParticleIO = new IOType<ShakerParticle, ShakerParticleStateObject>( 'ShakerParticleIO', {
    valueType: ShakerParticle,

    //TODO What is this telling IOType? IOTypeOptions.supertype and IOType.supertype have no documentation.
    supertype: SoluteParticle.SoluteParticleIO,
    documentation: 'A particle that comes from the shaker.',

    //TODO As in Resistor... Do I only need to specify additional subclass fields here? Are other fields inherited from SoluteParticleIO stateSchema?
    //TODO If so... What if my subclass does not need all supertype schema fields?
    stateSchema: {
      velocity: Vector2.Vector2IO,
      acceleration: Vector2.Vector2IO
    },
    toStateObject: shakerParticle => shakerParticle.toStateObject(),

    // ShakerParticle is instantiated by a PhetioGroup, so we must use stateToArgsForConstructor instead of fromStateObject.
    stateToArgsForConstructor: stateObject => ShakerParticle.stateToArgsForConstructor( stateObject )
  } );
}

beersLawLab.register( 'ShakerParticle', ShakerParticle );