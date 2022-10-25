// Copyright 2013-2022, University of Colorado Boulder

/**
 * SoluteParticle is the base class for solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = EmptySelfOptions;

export type SoluteParticleOptions = SelfOptions &
  PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioType' | 'phetioDynamicElement'>;

export type SoluteParticleStateObject = {
  position: Vector2StateObject;
  orientation: number;
};

export type SoluteParticleComponents = {
  position: Vector2;
  orientation: number;
};

export default class SoluteParticle extends PhetioObject {

  public readonly color: Color;
  public readonly size: number;
  public readonly positionProperty: Property<Vector2>;
  public readonly orientation: number;

  /**
   * @param color
   * @param size particles are square, this is the length of one side
   * @param position position of the particle in the beaker's coordinate frame
   * @param orientation in radians
   * @param [providedOptions]
   */
  public constructor( color: Color, size: number, position: Vector2, orientation: number,
                      providedOptions: SoluteParticleOptions ) {

    super( providedOptions );

    this.color = color;
    this.size = size;
    this.positionProperty = new Vector2Property( position );
    this.orientation = orientation;
  }

  public toStateObject(): SoluteParticleStateObject {
    return {
      position: this.positionProperty.value.toStateObject(),
      orientation: this.orientation
    };
  }

  public static deserializeComponents( stateObject: SoluteParticleStateObject ): SoluteParticleComponents {
    return {
      position: Vector2.Vector2IO.fromStateObject( stateObject.position ),
      orientation: stateObject.orientation
    };
  }

  public static readonly SoluteParticleIO = new IOType<SoluteParticle, SoluteParticleStateObject>( 'SoluteParticleIO', {
    valueType: SoluteParticle,
    documentation: 'A particle of solute to add to the solution',
    toStateObject: soluteParticle => soluteParticle.toStateObject(),
    stateSchema: {
      position: Vector2.Vector2IO,
      orientation: NumberIO
    }
  } );
}

beersLawLab.register( 'SoluteParticle', SoluteParticle );