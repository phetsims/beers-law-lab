// Copyright 2013-2023, University of Colorado Boulder

/**
 * PrecipitateParticles manages the creation and deletion of solute particles that form on the bottom of
 * the beaker as precipitate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import beersLawLab from '../../beersLawLab.js';
import Beaker from './Beaker.js';
import ConcentrationSolution from './ConcentrationSolution.js';
import SoluteParticles, { SoluteParticlesOptions } from './SoluteParticles.js';

type SelfOptions = EmptySelfOptions;

type PrecipitateOptions = SelfOptions & PickRequired<SoluteParticlesOptions, 'tandem'>;

export default class PrecipitateParticles extends SoluteParticles {

  private readonly solution: ConcentrationSolution;
  private readonly beaker: Beaker;

  public constructor( solution: ConcentrationSolution, beaker: Beaker, providedOptions: PrecipitateOptions ) {

    const options = optionize<PrecipitateOptions, SelfOptions, SoluteParticlesOptions>()( {

      // SoluteParticlesOptions
      particleGroupDocumentation: 'Dynamically creates solute particles for the precipitate'
    }, providedOptions );

    super( solution.soluteProperty, options );

    this.solution = solution;
    this.beaker = beaker;

    // when the saturation changes, update the number of precipitate particles
    this.solution.precipitateMolesProperty.link( () => this.updateParticles() );

    // when the solute changes, remove all particles and create new particles for the solute
    this.solution.soluteProperty.link( solute => {

      // Remove all particles, unless solute was being restored by PhET-iO. Particles will be restored by particleGroup.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.removeAllParticles();
        this.updateParticles();
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /*
   * Adds/removes particles to match the model. To optimize performance, clients who register for the 'change'
   * callback will assume that particles are added/removed from the end of the 'particles' array.
   * See https://github.com/phetsims/beers-law-lab/issues/48
   */
  private updateParticles(): void {

    // number of particles desired after this update
    const numberOfParticles = this.solution.getNumberOfPrecipitateParticles();

    if ( numberOfParticles === this.numberOfParticles ) {
      return; // no change, do nothing
    }
    else if ( numberOfParticles < this.numberOfParticles ) {
      this.removeParticles( this.numberOfParticles - numberOfParticles );
    }
    else {
      this.addParticles( numberOfParticles - this.numberOfParticles );
    }
    assert && assert( this.numberOfParticles === numberOfParticles );
  }

  /**
   * Adds a specified number of particles to the precipitate.
   */
  private addParticles( numberToAdd: number ): void {
    assert && assert( numberToAdd > 0, `invalid numberToAdd: ${numberToAdd}` );
    for ( let i = 0; i < numberToAdd; i++ ) {
      this.createParticle( this.solution.soluteProperty.value,
        this.getRandomPosition(),
        PrecipitateParticles.getRandomOrientation(),
        Vector2.ZERO,
        Vector2.ZERO
      );
    }
  }

  /**
   * Removes a specified number of particles from the precipitate.
   */
  private removeParticles( numberToRemove: number ): void {

    const numberBefore = this.numberOfParticles;

    const particles = this.getParticlesReference();
    assert && assert( numberToRemove > 0 && numberToRemove <= particles.length, `invalid numberToRemove: ${numberToRemove}` );

    // Remove from the end of the array.
    for ( let i = 0; i < numberToRemove; i++ ) {
      this.disposeLastParticle();
    }

    assert && assert( this.numberOfParticles + numberToRemove === numberBefore,
      `unexpected number of particles removed: expected ${numberToRemove}, removed ${numberBefore - this.numberOfParticles}` );
  }

  /**
   * Gets a random position at the bottom of the beaker, in the global model coordinate frame.
   */
  private getRandomPosition(): Vector2 {
    const particleSize = this.solution.soluteProperty.value.particleSize;

    // Particles are square, so the largest margin required is the diagonal length.
    const margin = Math.sqrt( particleSize * particleSize );

    const x = this.beaker.position.x - ( this.beaker.size.width / 2 ) + margin + ( dotRandom.nextDouble() * ( this.beaker.size.width - ( 2 * margin ) ) );
    const y = this.beaker.position.y - margin; // this was tweaked based on the lineWidth used to stroke the beaker
    return new Vector2( x, y );
  }
}

beersLawLab.register( 'PrecipitateParticles', PrecipitateParticles );