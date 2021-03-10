// Copyright 2013-2020, University of Colorado Boulder

/**
 * Manages the lifetime of shaker particles, from creation when they exit the shaker,
 * to deletion when they are delivered to the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import Beaker from './Beaker.js';
import ConcentrationSolution from './ConcentrationSolution.js';
import Shaker from './Shaker.js';
import ShakerParticleGroup from './ShakerParticleGroup.js';

// Units for speed and acceleration are not meaningful here, adjust these so that it looks good.
const INITIAL_SPEED = 100;
const GRAVITATIONAL_ACCELERATION_MAGNITUDE = 150;

// These offsets determine where a salt particle originates, relative to the shaker's position.
const MAX_X_OFFSET = 20;
const MAX_Y_OFFSET = 5;

class ShakerParticles {

  /**
   * @param {Shaker} shaker
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @param {Object} [options]
   * @constructor
   */
  constructor( shaker, solution, beaker, options ) {
    assert && assert( shaker instanceof Shaker );
    assert && assert( solution instanceof ConcentrationSolution );
    assert && assert( beaker instanceof Beaker );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @private
    this.shaker = shaker;
    this.solution = solution;
    this.beaker = beaker;

    // @public
    this.particlesGroup = new ShakerParticleGroup( {
      tandem: options.tandem.createTandem( 'particlesGroup' )
    } );

    // @public emits on step if one or more particles has moved
    this.particlesMovedEmitter = new Emitter();

    // when the solute changes, remove all particles
    solution.soluteProperty.link( () => {

      // Remove all particles, unless solute was being restored by PhET-iO. Particles will be restored by particlesGroup.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.removeAllParticles();
      }
    } );
  }

  // @public
  removeAllParticles() {
    this.particlesGroup.clear();
  }

  // @public
  reset() {
    this.removeAllParticles();
  }

  // @public Particle animation and delivery to the solution, called when the simulation clock ticks.
  step( deltaSeconds ) {

    const particles = this.particlesGroup.getArray();
    const beaker = this.beaker;
    const shaker = this.shaker;
    const solution = this.solution;
    let someParticleMoved = false;

    // propagate existing particles
    for ( let i = particles.length - 1; i >= 0; i-- ) {

      const particle = particles[ i ];
      particle.step( deltaSeconds, beaker );

      // If the particle hits the solution surface or bottom of the beaker, delete it, and add a corresponding amount of solute to the solution.
      const percentFull = solution.volumeProperty.value / beaker.volume;
      const solutionSurfaceY = beaker.position.y - ( percentFull * beaker.size.height ) - solution.soluteProperty.value.particleSize;
      if ( particle.positionProperty.value.y > solutionSurfaceY ) {
        this.particlesGroup.disposeElement( particle );
        const soluteAmount = Math.min(
          BLLConstants.SOLUTE_AMOUNT_RANGE.max,
          solution.soluteMolesProperty.value + ( 1 / solution.soluteProperty.value.particlesPerMole )
        );
        solution.soluteMolesProperty.value = soluteAmount;
      }
      else {
        someParticleMoved = true;
      }
    }

    // create new particles
    if ( shaker.dispensingRateProperty.value > 0 ) {

      const numberOfParticles = Utils.roundSymmetric( Math.max( 1,
        shaker.dispensingRateProperty.value * solution.soluteProperty.value.particlesPerMole * deltaSeconds ) );

      for ( let j = 0; j < numberOfParticles; j++ ) {
        this.particlesGroup.createNextElement(
          solution.soluteProperty.value,
          getRandomPosition( this.shaker.positionProperty.value ),
          getRandomOrientation(),
          this.getInitialVelocity(),
          this.getGravitationalAcceleration()
        );
      }
    }

    if ( someParticleMoved ) {
      this.particlesMovedEmitter.emit();
    }
  }

  // @private Computes an initial velocity for the particle.
  getInitialVelocity() {
    return Vector2.createPolar( INITIAL_SPEED, this.shaker.orientation ); // in the direction the shaker is pointing
  }

  // @private Gravitational acceleration is in the downward direction.
  getGravitationalAcceleration() {
    return new Vector2( 0, GRAVITATIONAL_ACCELERATION_MAGNITUDE );
  }
}

// Gets a random position relative to some origin
function getRandomPosition( origin ) {
  const xOffset = dotRandom.nextIntBetween( -MAX_X_OFFSET, MAX_X_OFFSET ); // positive or negative
  const yOffset = dotRandom.nextIntBetween( 0, MAX_Y_OFFSET ); // positive only
  return new Vector2( origin.x + xOffset, origin.y + yOffset );
}

// Gets a random orientation, in radians.
function getRandomOrientation() {
  return dotRandom.nextDouble() * 2 * Math.PI;
}

beersLawLab.register( 'ShakerParticles', ShakerParticles );
export default ShakerParticles;