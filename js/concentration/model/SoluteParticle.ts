// Copyright 2013-2023, University of Colorado Boulder

/**
 * SoluteParticle is the model for all solute particles. This includes particles coming out of the shaker, and
 * precipitate particles on the bottom of the beaker.
 *
 * Note that this was formerly a base class, with ShakerParticle and PrecipitateParticle subclasses. Due to problems
 * with IOTypes in https://github.com/phetsims/beers-law-lab/issues/265, we decided to collapse the hierarchy into
 * a single class.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';
import Solute, { SoluteStateObject } from '../../common/model/Solute.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = {
  velocity?: Vector2;
  acceleration?: Vector2;
};

export type SoluteParticleOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export type SoluteParticleStateObject = {
  solute: SoluteStateObject;
  position: Vector2StateObject;
  orientation: number;
  velocity: Vector2StateObject;
  acceleration: Vector2StateObject;
};

export type SoluteParticleCreateElementArguments = [
  Solute, // solute
  Vector2,  // position
  number, // orientation
  Vector2, // velocity
  Vector2 // acceleration
];

export default class SoluteParticle extends PhetioObject {

  public readonly solute: Solute;

  public readonly color: Color;
  public readonly size: number;
  public readonly positionProperty: Property<Vector2>;
  public readonly orientation: number;
  public velocity: Vector2;
  public readonly acceleration: Vector2;

  // Precompute these things, to improve the performance of ParticlesNode.
  public readonly cos: number; // cosine of orientation
  public readonly sin: number; // sine of orientation
  public readonly fillStyle: string; // fillStyle for rendering with Canvas
  public readonly strokeStyle: string; // strokeStyle for rendering with Canvas

  /**
   * @param solute
   * @param position position of the particle in the beaker's coordinate frame
   * @param orientation in radians
   * @param [providedOptions]
   */
  public constructor( solute: Solute, position: Vector2, orientation: number, providedOptions: SoluteParticleOptions ) {

    const options = optionize<SoluteParticleOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      velocity: Vector2.ZERO,
      acceleration: Vector2.ZERO,

      // PhetioObjectOptions
      phetioType: SoluteParticle.SoluteParticleIO,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.solute = solute;
    this.color = solute.particleColor;
    this.size = solute.particleSize;
    this.positionProperty = new Vector2Property( position );
    this.orientation = orientation;
    this.velocity = options.velocity;
    this.acceleration = options.acceleration;

    this.cos = Math.cos( orientation );
    this.sin = Math.sin( orientation );
    this.fillStyle = this.color.getCanvasStyle();
    this.strokeStyle = this.color.darkerColor().getCanvasStyle();
  }

  protected toStateObject(): SoluteParticleStateObject {
    return {
      solute: Solute.SoluteIO.toStateObject( this.solute ),
      position: this.positionProperty.value.toStateObject(),
      orientation: this.orientation,
      velocity: Vector2.Vector2IO.toStateObject( this.velocity ),
      acceleration: Vector2.Vector2IO.toStateObject( this.acceleration )
    };
  }

  private static stateObjectToCreateElementArguments( stateObject: SoluteParticleStateObject ): SoluteParticleCreateElementArguments {
    return [
      Solute.SoluteIO.fromStateObject( stateObject.solute ),
      Vector2.Vector2IO.fromStateObject( stateObject.position ),
      stateObject.orientation,
      Vector2.Vector2IO.fromStateObject( stateObject.velocity ),
      Vector2.Vector2IO.fromStateObject( stateObject.acceleration )
    ];
  }

  public static readonly SoluteParticleIO = new IOType<SoluteParticle, SoluteParticleStateObject>( 'SoluteParticleIO', {
    valueType: SoluteParticle,
    stateSchema: {
      solute: Solute.SoluteIO,
      position: Vector2.Vector2IO,
      orientation: NumberIO,
      velocity: Vector2.Vector2IO,
      acceleration: Vector2.Vector2IO
    },
    toStateObject: soluteParticle => soluteParticle.toStateObject(),
    stateObjectToCreateElementArguments: stateObject => SoluteParticle.stateObjectToCreateElementArguments( stateObject )
  } );
}

beersLawLab.register( 'SoluteParticle', SoluteParticle );