// Copyright 2013-2022, University of Colorado Boulder

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
import beersLawLab from '../../beersLawLab.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Solute from '../../common/model/Solute.js';

type SelfOptions = EmptySelfOptions;

export type SoluteParticleOptions = SelfOptions &
  PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioType' | 'phetioDynamicElement'>;

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

    super( providedOptions );

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
}

beersLawLab.register( 'SoluteParticle', SoluteParticle );