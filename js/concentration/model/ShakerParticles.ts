// Copyright 2013-2023, University of Colorado Boulder

/**
 * ShakerParticles manages the lifetime of solute particles, from creation when they exit the shaker,
 * to deletion when they are delivered to the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import Beaker from './Beaker.js';
import ConcentrationSolution from './ConcentrationSolution.js';
import SoluteParticles, { SoluteParticlesOptions } from './SoluteParticles.js';
import Shaker from './Shaker.js';
import SoluteParticle from './SoluteParticle.js';

// Units for speed and acceleration are not meaningful here, adjust these so that it looks good.
const INITIAL_SPEED = 100;
const GRAVITATIONAL_ACCELERATION_MAGNITUDE = 150;

// These offsets determine where a salt particle originates, relative to the shaker's position.
const MAX_X_OFFSET = 20;
const MAX_Y_OFFSET = 5;

type SelfOptions = EmptySelfOptions;

type ShakerParticlesOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class ShakerParticles extends SoluteParticles {

  private readonly solution: ConcentrationSolution;
  private readonly beaker: Beaker;
  private readonly shaker: Shaker;
  public readonly particlesMovedEmitter: Emitter; // emits on step if one or more particles has moved

  public constructor( solution: ConcentrationSolution,
                      beaker: Beaker,
                      shaker: Shaker,
                      providedOptions: ShakerParticlesOptions ) {

    const options = optionize<ShakerParticlesOptions, SelfOptions, SoluteParticlesOptions>()( {

      // SoluteParticlesOptions
      particleGroupDocumentation: 'Dynamically creates solute particles for the shaker'
    }, providedOptions );

    super( solution.soluteProperty, options );

    this.solution = solution;
    this.beaker = beaker;
    this.shaker = shaker;
    this.particlesMovedEmitter = new Emitter();

    // when the solute changes, remove all particles
    solution.soluteProperty.link( () => {

      // Remove all particles, unless solute was being restored by PhET-iO. Particles will be restored by particleGroup.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.removeAllParticles();
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.removeAllParticles();
  }

  // Particle animation and delivery to the solution, called when the simulation clock ticks.
  public step( dt: number ): void {

    const particles = this.getParticlesReference();
    const beaker = this.beaker;
    const shaker = this.shaker;
    const solution = this.solution;
    let someParticleMoved = false;

    // propagate existing particles
    for ( let i = particles.length - 1; i >= 0; i-- ) {

      const particle = particles[ i ];
      this.stepParticle( dt, particle );

      // If the particle hits the solution surface or bottom of the beaker, delete it, and add a corresponding amount of solute to the solution.
      const percentFull = solution.volumeProperty.value / beaker.volume;
      const solutionSurfaceY = beaker.position.y - ( percentFull * beaker.size.height ) - solution.soluteProperty.value.particleSize;
      if ( particle.positionProperty.value.y > solutionSurfaceY ) {
        this.disposeParticle( particle );
        solution.soluteMolesProperty.value = Math.min(
          BLLConstants.SOLUTE_AMOUNT_RANGE.max,
          solution.soluteMolesProperty.value + ( 1 / solution.soluteProperty.value.particlesPerMole )
        );
      }
      else {
        someParticleMoved = true;
      }
    }

    // create new particles
    if ( shaker.dispensingRateProperty.value > 0 ) {

      const numberOfParticles = Utils.roundSymmetric( Math.max( 1,
        shaker.dispensingRateProperty.value * solution.soluteProperty.value.particlesPerMole * dt ) );

      for ( let j = 0; j < numberOfParticles; j++ ) {
        this.createParticle( solution.soluteProperty.value,
          getRandomPosition( this.shaker.positionProperty.value ),
          ShakerParticles.getRandomOrientation(),
          this.getInitialVelocity(),
          this.getGravitationalAcceleration()
        );
      }
    }

    if ( someParticleMoved ) {
      this.particlesMovedEmitter.emit();
    }
  }

  /**
   * Propagates a particle to a new position.
   */
  private stepParticle( deltaSeconds: number, particle: SoluteParticle ): void {

    // mutable calls added to remove the number of new objects we create
    particle.velocity = particle.acceleration.times( deltaSeconds ).add( particle.velocity );
    const newPosition = particle.velocity.times( deltaSeconds ).add( particle.positionProperty.value );

    /*
     * Did the particle hit the left wall of the beaker? If so, change direction.
     * Note that this is a very simplified model, and only deals with the left wall of the beaker,
     * which is the only wall that the particles can hit in practice.
     */
    const minX = this.beaker.left + particle.solute.particleSize;
    if ( newPosition.x <= minX ) {
      newPosition.setX( minX );
      particle.velocity.setX( Math.abs( particle.velocity.x ) );
    }

    particle.positionProperty.value = newPosition;
  }

  // Computes an initial velocity for the particle.
  private getInitialVelocity(): Vector2 {
    return Vector2.createPolar( INITIAL_SPEED, this.shaker.orientation ); // in the direction the shaker is pointing
  }

  // Gravitational acceleration is in the downward direction.
  private getGravitationalAcceleration(): Vector2 {
    return new Vector2( 0, GRAVITATIONAL_ACCELERATION_MAGNITUDE );
  }
}

// Gets a random position relative to some origin
function getRandomPosition( origin: Vector2 ): Vector2 {
  const xOffset = dotRandom.nextIntBetween( -MAX_X_OFFSET, MAX_X_OFFSET ); // positive or negative
  const yOffset = dotRandom.nextIntBetween( 0, MAX_Y_OFFSET ); // positive only
  return new Vector2( origin.x + xOffset, origin.y + yOffset );
}

beersLawLab.register( 'ShakerParticles', ShakerParticles );