// Copyright 2013-2021, University of Colorado Boulder

/**
 * SoluteParticle is the base class for solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';

type SelfOptions = EmptySelfOptions;

type SoluteParticleOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

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
  protected constructor( color: Color, size: number, position: Vector2, orientation: number,
                         providedOptions: SoluteParticleOptions ) {

    super( providedOptions );

    this.color = color;
    this.size = size;
    this.positionProperty = new Vector2Property( position );
    this.orientation = orientation;
  }

  // @ts-ignore TODO https://github.com/phetsims/beers-law-lab/issues/287 return type?
  public toStateObject(): IntentionalAny {
    return {
      position: this.positionProperty.value.toStateObject(),
      orientation: NumberIO.toStateObject( this.orientation )
    };
  }

  // @ts-ignore TODO https://github.com/phetsims/beers-law-lab/issues/287 type of stateObject? return type?
  public static deserializeComponents( stateObject: IntentionalAny ): IntentionalAny {
    return {
      position: Vector2.Vector2IO.fromStateObject( stateObject.position ),
      orientation: NumberIO.fromStateObject( stateObject.orientation )
    };
  }

  public static readonly SoluteParticleIO = new IOType( 'SoluteParticleIO', {
    // @ts-ignore TODO https://github.com/phetsims/beers-law-lab/issues/287 TS error
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