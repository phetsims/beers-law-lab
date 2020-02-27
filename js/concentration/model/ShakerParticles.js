// Copyright 2013-2020, University of Colorado Boulder

/**
 * Manages the lifetime of shaker particles, from creation when they exit the shaker,
 * to deletion when they are delivered to the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import Particles from './Particles.js';
import ShakerParticle from './ShakerParticle.js';
import ShakerParticlesIO from './ShakerParticlesIO.js';

// Units for speed and acceleration are not meaningful here, adjust these so that it looks good.
const INITIAL_SPEED = 100;
const GRAVITATIONAL_ACCELERATION_MAGNITUDE = 150;

// These offsets determine where a salt particle originates, relative to the shaker's position.
const MAX_X_OFFSET = 20;
const MAX_Y_OFFSET = 5;

class ShakerParticles extends Particles {

  /**
   * @param {Shaker} shaker
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @param {Object} [options]
   * @constructor
   */
  constructor( shaker, solution, beaker, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioType: ShakerParticlesIO
    }, options );

    super( options );

    // @private
    this.shaker = shaker;
    this.solution = solution;
    this.beaker = beaker;

    // when the solute changes, remove all particles
    solution.soluteProperty.link( () => {
      this.removeAllParticles();
    } );

    // @private
    this.shakerParticleGroupTandem = options.tandem.createGroupTandem( 'shakerParticle' );
  }

  // @public
  reset() {
    this.removeAllParticles();
  }

  // @public Particle animation and delivery to the solution, called when the simulation clock ticks.
  step( deltaSeconds ) {

    const beaker = this.beaker;
    const shaker = this.shaker;
    const solution = this.solution;
    let changed = this.particles.length > 0;

    // propagate existing particles
    for ( let i = this.particles.length - 1; i >= 0; i-- ) {

      const particle = this.particles[ i ];
      particle.step( deltaSeconds, beaker );

      // If the particle hits the solution surface or bottom of the beaker, delete it, and add a corresponding amount of solute to the solution.
      const percentFull = solution.volumeProperty.get() / beaker.volume;
      const solutionSurfaceY = beaker.position.y - ( percentFull * beaker.size.height ) - solution.soluteProperty.get().particleSize;
      if ( particle.positionProperty.get().y > solutionSurfaceY ) {
        this.removeParticle( particle );
        const soluteAmount = Math.min(
          BLLConstants.SOLUTE_AMOUNT_RANGE.max,
          solution.soluteAmountProperty.get() + ( 1 / solution.soluteProperty.get().particlesPerMole )
        );
        solution.soluteAmountProperty.set( soluteAmount );
      }
    }

    // create new particles
    if ( shaker.dispensingRateProperty.get() > 0 ) {
      const numberOfParticles = Utils.roundSymmetric( Math.max( 1, shaker.dispensingRateProperty.get() * solution.soluteProperty.get().particlesPerMole * deltaSeconds ) );
      for ( let j = 0; j < numberOfParticles; j++ ) {
        const shakerParticle = new ShakerParticle(
          solution.soluteProperty.get(),
          getRandomPosition( this.shaker.positionProperty.get() ),
          getRandomOrientation(),
          this.getInitialVelocity(),
          this.getGravitationalAcceleration(), {
            tandem: this.shakerParticleGroupTandem.createNextTandem()
          }
        );
        this.addParticle( shakerParticle );
      }
    }

    changed = changed || this.particles.length > 0;

    if ( changed ) {
      this.fireChanged();
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

  // @private
  removeParticle( particle ) {
    this.particles.splice( this.particles.indexOf( particle ), 1 );
    particle.dispose();
  }

  /**
   * @public
   */
  removeAllParticles() {
    const particles = this.particles.slice( 0 );
    for ( let i = 0; i < particles.length; i++ ) {
      this.removeParticle( particles[ i ] );
    }
    this.fireChanged();
  }
}

// Gets a random position relative to some origin
function getRandomPosition( origin ) {
  const xOffset = phet.joist.random.nextIntBetween( -MAX_X_OFFSET, MAX_X_OFFSET ); // positive or negative
  const yOffset = phet.joist.random.nextIntBetween( 0, MAX_Y_OFFSET ); // positive only
  return new Vector2( origin.x + xOffset, origin.y + yOffset );
}

// Gets a random orientation, in radians.
function getRandomOrientation() {
  return phet.joist.random.nextDouble() * 2 * Math.PI;
}

beersLawLab.register( 'ShakerParticles', ShakerParticles );
export default ShakerParticles;