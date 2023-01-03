// Copyright 2022-2023, University of Colorado Boulder

/**
 * SoluteParticles is the base class for a system of solute particles. It delegates most of its responsibilities
 * to a PhetioGroup, and hides that PhetioGroup from the rest of the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Solute from '../../common/model/Solute.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import beersLawLab from '../../beersLawLab.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import SoluteParticleGroup from './SoluteParticleGroup.js';
import SoluteParticle from './SoluteParticle.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = {
  particleGroupDocumentation: string;
};

export type SoluteParticlesOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SoluteParticles {

  protected readonly soluteProperty: TReadOnlyProperty<Solute>;
  private readonly particleGroup: SoluteParticleGroup;

  protected constructor( soluteProperty: TReadOnlyProperty<Solute>, providedOptions: SoluteParticlesOptions ) {

    this.soluteProperty = soluteProperty;

    this.particleGroup = new SoluteParticleGroup( {
      tandem: providedOptions.tandem.createTandem( 'particleGroup' ),
      phetioDocumentation: providedOptions.particleGroupDocumentation
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Gets a reference to the array of particles. Do not modify this array!
   */
  public getParticlesReference(): SoluteParticle[] {
    return this.particleGroup.getArray();
  }

  /**
   * Gets the number of particles that are in the PhetioGroup.
   */
  public get numberOfParticles(): number {
    return this.particleGroup.count;
  }

  /**
   * Creates a particle.
   */
  protected createParticle( solute: Solute, position: Vector2, orientation: number,
                                velocity: Vector2, acceleration: Vector2 ): void {
    this.particleGroup.createNextElement( solute, position, orientation, velocity, acceleration );
  }

  /**
   * Disposes of a particle.
   */
  protected disposeParticle( particle: SoluteParticle ): void {
    this.particleGroup.disposeElement( particle );
  }

  /**
   * Disposes the last particle that was created.
   */
  protected disposeLastParticle(): void {
    this.disposeParticle( this.particleGroup.getLastElement() );
  }

  /**
   * Adds a listener that is notified when a particle is created.
   */
  public addParticleCreatedListener( listener: () => void ): void {
    this.particleGroup.elementCreatedEmitter.addListener( listener );
  }

  /**
   * Adds a listener that is notified when a particle is disposed.
   */
  public addParticleDisposedListener( listener: () => void ): void {
    this.particleGroup.elementDisposedEmitter.addListener( listener );
  }

  /**
   * Removes all particles from the precipitate.
   */
  public removeAllParticles(): void {
    this.particleGroup.clear();
  }

  /**
   * Gets the size of all particles in the system. Particles are square.
   */
  public getParticleSize(): number {
    return this.soluteProperty.value.particleSize;
  }

  /**
   * Gets the Canvas fillStyle for all particles in the system.
   */
  public getFillStyle(): string {
    return this.soluteProperty.value.fillStyle;
  }

  /**
   * Gets the Canvas strokeStyle for all particles in the system.
   */
  public getStrokeStyle(): string {
    return this.soluteProperty.value.strokeStyle;
  }

  /**
   * Gets a random orientation for a particle, in radians.
   */
  protected static getRandomOrientation(): number {
    return dotRandom.nextDouble() * 2 * Math.PI;
  }
}

beersLawLab.register( 'SoluteParticles', SoluteParticles );