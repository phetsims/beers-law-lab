// Copyright 2013-2021, University of Colorado Boulder

/**
 * The precipitate that forms on the bottom of the beaker.
 * Manages the creation and deletion of precipitate particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import Beaker from './Beaker.js';
import ConcentrationSolution from './ConcentrationSolution.js';
import PrecipitateParticleGroup from './PrecipitateParticleGroup.js';

class Precipitate {

  /**
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @param {Object} [options]
   */
  constructor( solution, beaker, options ) {
    assert && assert( solution instanceof ConcentrationSolution );
    assert && assert( beaker instanceof Beaker );

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    // @private
    this.solution = solution;
    this.beaker = beaker;

    // @public
    this.particlesGroup = new PrecipitateParticleGroup( {
      tandem: options.tandem.createTandem( 'particlesGroup' )
    } );

    // when the saturation changes, update the number of precipitate particles
    this.solution.precipitateMolesProperty.link( () => this.updateParticles() );

    // when the solute changes, remove all particles and create new particles for the solute
    this.solution.soluteProperty.link( () => {

      // Remove all particles, unless solute was being restored by PhET-iO. Particles will be restored by particlesGroup.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.removeAllParticles();
        this.updateParticles();
      }
    } );
  }

  /*
   * Adds/removes particles to match the model.
   * To optimize performance, clients who register for the 'change' callback will assume that
   * particles are added/removed from the end of the 'particles' array.  See #48.
   * @private
   */
  updateParticles() {

    // number of particles desired after this update
    const numberOfParticles = this.solution.getNumberOfPrecipitateParticles();

    if ( numberOfParticles === this.particlesGroup.count ) {
      return; // no change, do nothing
    }
    else if ( numberOfParticles < this.particlesGroup.count ) {
      this.removeParticles( this.particlesGroup.count - numberOfParticles );
    }
    else {
      this.addParticles( numberOfParticles - this.particlesGroup.count );
    }
    assert && assert( this.particlesGroup.count === numberOfParticles );
  }

  /**
   * Adds particles to the precipitate.
   * @param {number} numberToAdd
   * @private
   */
  addParticles( numberToAdd ) {
    assert && assert( numberToAdd > 0, `invalid numberToAdd: ${numberToAdd}` );
    for ( let i = 0; i < numberToAdd; i++ ) {
      this.particlesGroup.createNextElement(
        this.solution.soluteProperty.value,
        this.getRandomOffset(),
        getRandomOrientation()
      );
    }
  }

  /**
   * Removes particles from the precipitate.
   * @param {number} numberToRemove
   * @private
   */
  removeParticles( numberToRemove ) {

    const particles = this.particlesGroup.getArray();
    assert && assert( numberToRemove > 0 && numberToRemove <= particles.length, `invalid numberToRemove: ${numberToRemove}` );

    const removedParticles = particles.slice( particles.length - numberToRemove, numberToRemove );
    assert && assert( removedParticles && removedParticles.length === numberToRemove,
      `expected to remove ${numberToRemove} particles, but only removed ${removedParticles.length}` );

    for ( let i = 0; i < removedParticles.length; i++ ) {
      this.particlesGroup.disposeElement( removedParticles[ i ] );
    }
  }

  // @private
  removeAllParticles() {
    this.particlesGroup.clear();
  }

  // @private Gets a random position, in global model coordinate frame.
  getRandomOffset() {
    const particleSize = this.solution.soluteProperty.value.particleSize;

    // particles are square, largest margin required is the diagonal length
    const margin = Math.sqrt( particleSize * particleSize );

    // offset
    const x = this.beaker.position.x - ( this.beaker.size.width / 2 ) + margin + ( dotRandom.nextDouble() * ( this.beaker.size.width - ( 2 * margin ) ) );
    const y = this.beaker.position.y - margin; // this was tweaked based on the lineWidth used to stroke the beaker
    return new Vector2( x, y );
  }
}

// Gets a random orientation, in radians.
function getRandomOrientation() {
  return dotRandom.nextDouble() * 2 * Math.PI;
}

beersLawLab.register( 'Precipitate', Precipitate );
export default Precipitate;