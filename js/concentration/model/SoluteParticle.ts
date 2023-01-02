// Copyright 2013-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/beers-law-lab/issues/265 address TODOs in this file
/**
 * SoluteParticle is the base class for solute particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';
import Solute, { SoluteStateObject } from '../../common/model/Solute.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = EmptySelfOptions;

export type SoluteParticleOptions = SelfOptions &
  PickRequired<PhetioObjectOptions, 'tandem' | 'phetioType'>;

export type SoluteParticleStateObject = {
  solute: SoluteStateObject;
  position: Vector2StateObject;
  orientation: number;
};

export default class SoluteParticle extends PhetioObject {

  protected readonly solute: Solute;

  public readonly color: Color;
  public readonly size: number;
  public readonly positionProperty: Property<Vector2>;
  public readonly orientation: number;

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
  protected constructor( solute: Solute, position: Vector2, orientation: number, providedOptions: SoluteParticleOptions ) {

    const options = optionize<SoluteParticleOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.solute = solute;
    this.color = solute.particleColor;
    this.size = solute.particleSize;
    this.positionProperty = new Vector2Property( position );
    this.orientation = orientation;

    this.cos = Math.cos( orientation );
    this.sin = Math.sin( orientation );
    this.fillStyle = this.color.getCanvasStyle();
    this.strokeStyle = this.color.darkerColor().getCanvasStyle();
  }

  //TODO It sounds like this is the default from stateSchema. But do I need it because subclasses need to call it?
  protected toStateObject(): SoluteParticleStateObject {
    return {
      solute: Solute.SoluteIO.toStateObject( this.solute ),
      position: this.positionProperty.value.toStateObject(),
      orientation: this.orientation
    };
  }

  protected static readonly SoluteParticleIO = new IOType<SoluteParticle, SoluteParticleStateObject>( 'SoluteParticleIO', {
    valueType: SoluteParticle,
    stateSchema: {
      solute: Solute.SoluteIO,
      position: Vector2.Vector2IO,
      orientation: NumberIO
    },
    toStateObject: soluteParticle => soluteParticle.toStateObject()
    // SoluteParticle subclasses are created by a PhetioGroup, so they will be defining stateToArgsForConstructor for deserialization.
    //TODO ... but what is the default deserialization in this case?
  } );
}

beersLawLab.register( 'SoluteParticle', SoluteParticle );