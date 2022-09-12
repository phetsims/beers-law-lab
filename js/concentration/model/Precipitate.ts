// Copyright 2013-2022, University of Colorado Boulder

/**
 * The precipitate that forms on the bottom of the beaker.
 * Manages the creation and deletion of precipitate particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import beersLawLab from '../../beersLawLab.js';
import Beaker from './Beaker.js';
import ConcentrationSolution from './ConcentrationSolution.js';
import PrecipitateParticleGroup from './PrecipitateParticleGroup.js';

type SelfOptions = EmptySelfOptions;

type PrecipitateOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Precipitate {

  private readonly solution: ConcentrationSolution;
  private readonly beaker: Beaker;
  public readonly particleGroup: PrecipitateParticleGroup;

  public constructor( solution: ConcentrationSolution, beaker: Beaker, providedOptions: PrecipitateOptions ) {

    this.solution = solution;
    this.beaker = beaker;

    this.particleGroup = new PrecipitateParticleGroup( {
      tandem: providedOptions.tandem.createTandem( 'particleGroup' )
    } );

    // when the saturation changes, update the number of precipitate particles
    this.solution.precipitateMolesProperty.link( () => this.updateParticles() );

    // when the solute changes, remove all particles and create new particles for the solute
    this.solution.soluteProperty.link( () => {

      // Remove all particles, unless solute was being restored by PhET-iO. Particles will be restored by particleGroup.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.removeAllParticles();
        this.updateParticles();
      }
    } );
  }

  /*
   * Adds/removes particles to match the model. To optimize performance, clients who register for the 'change'
   * callback will assume that particles are added/removed from the end of the 'particles' array.
   * See https://github.com/phetsims/beers-law-lab/issues/48
   */
  private updateParticles(): void {

    // number of particles desired after this update
    const numberOfParticles = this.solution.getNumberOfPrecipitateParticles();

    if ( numberOfParticles === this.particleGroup.count ) {
      return; // no change, do nothing
    }
    else if ( numberOfParticles < this.particleGroup.count ) {
      this.removeParticles( this.particleGroup.count - numberOfParticles );
    }
    else {
      this.addParticles( numberOfParticles - this.particleGroup.count );
    }
    assert && assert( this.particleGroup.count === numberOfParticles );
  }

  /**
   * Adds particles to the precipitate.
   */
  private addParticles( numberToAdd: number ): void {
    assert && assert( numberToAdd > 0, `invalid numberToAdd: ${numberToAdd}` );
    for ( let i = 0; i < numberToAdd; i++ ) {

      // @ts-ignore TODO https://github.com/phetsims/beers-law-lab/issues/287 PhetioGroup is unhappy with these args
      this.particleGroup.createNextElement( this.solution.soluteProperty.value,
        this.getRandomOffset(),
        getRandomOrientation()
      );
    }
  }

  /**
   * Removes particles from the precipitate.
   */
  private removeParticles( numberToRemove: number ): void {

    const particles = this.particleGroup.getArray();
    assert && assert( numberToRemove > 0 && numberToRemove <= particles.length, `invalid numberToRemove: ${numberToRemove}` );

    const removedParticles = particles.slice( particles.length - numberToRemove, numberToRemove );
    assert && assert( removedParticles && removedParticles.length === numberToRemove,
      `unexpected number of particles removed: expected ${numberToRemove}, removed ${removedParticles.length}` );

    for ( let i = 0; i < removedParticles.length; i++ ) {
      this.particleGroup.disposeElement( removedParticles[ i ] );
    }
  }

  /**
   * Removes all particles from the precipitate.
   */
  private removeAllParticles(): void {
    this.particleGroup.clear();
  }

  /**
   * Gets a random position, in global model coordinate frame.
   */
  private getRandomOffset(): Vector2 {
    const particleSize = this.solution.soluteProperty.value.particleSize;

    // particles are square, the largest margin required is the diagonal length
    const margin = Math.sqrt( particleSize * particleSize );

    // offset
    const x = this.beaker.position.x - ( this.beaker.size.width / 2 ) + margin + ( dotRandom.nextDouble() * ( this.beaker.size.width - ( 2 * margin ) ) );
    const y = this.beaker.position.y - margin; // this was tweaked based on the lineWidth used to stroke the beaker
    return new Vector2( x, y );
  }
}

// Gets a random orientation, in radians.
function getRandomOrientation(): number {
  return dotRandom.nextDouble() * 2 * Math.PI;
}

beersLawLab.register( 'Precipitate', Precipitate );