// Copyright 2013-2020, University of Colorado Boulder

/**
 * The precipitate that forms on the bottom of the beaker.
 * Manages the creation and deletion of precipitate particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const merge = require( 'PHET_CORE/merge' );
  const Particles = require( 'BEERS_LAW_LAB/concentration/model/Particles' );
  const PrecipitateParticle = require( 'BEERS_LAW_LAB/concentration/model/PrecipitateParticle' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );

  class Precipitate extends Particles {

    /**
     * @param {ConcentrationSolution} solution
     * @param {Beaker} beaker
     * @param {Object} [options]
     */
    constructor( solution, beaker, options ) {

      options = merge( {
        tandem: Tandem.REQUIRED,
        phetioState: false
      }, options );

      super( options );

      // @private
      this.solution = solution;
      this.beaker = beaker;

      // @private
      this.precipitateParticleGroupTandem = options.tandem.createGroupTandem( 'precipitateParticle' );

      // when the saturation changes, update the number of precipitate particles
      this.solution.precipitateAmountProperty.link( () => this.updateParticles() );

      // when the solute changes, remove all particles and create new particles for the solute
      this.solution.soluteProperty.link( () => {
        this.removeAllParticles();
        this.updateParticles();
      } );

      // Individual particles are derived from the model, so restoring individual particles (as part of saved
      // state) is problematic.  See https://github.com/phetsims/beers-law-lab/issues/213
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

      if ( numberOfParticles === this.particles.length ) {
        return; // no change, do nothing
      }
      else if ( numberOfParticles < this.particles.length ) {
        this.removeParticles( this.particles.length - numberOfParticles );
      }
      else {
        this.addParticles( numberOfParticles - this.particles.length );
      }
      assert && assert( this.particles.length === numberOfParticles );

      this.fireChanged();
    }

    /**
     * Adds particles to the precipitate.
     * @param {number} numberToAdd
     * @private
     */
    addParticles( numberToAdd ) {
      assert && assert( numberToAdd > 0, 'invalid numberToAdd: ' + numberToAdd );
      for ( let i = 0; i < numberToAdd; i++ ) {
        this.addParticle( new PrecipitateParticle(
          this.solution.soluteProperty.get(),
          this.getRandomOffset(),
          getRandomOrientation(), {
            tandem: this.precipitateParticleGroupTandem.createNextTandem()
          }
        ) );
      }
    }

    /**
     * Removes particles from the precipitate.
     * @param {number} numberToRemove
     * @private
     */
    removeParticles( numberToRemove ) {
      assert && assert( numberToRemove > 0 && numberToRemove <= this.particles.length,
        'invalid numberToRemove: ' + numberToRemove );

      const removedParticles = this.particles.splice( this.particles.length - numberToRemove, numberToRemove );
      assert && assert( removedParticles && removedParticles.length === numberToRemove );

      for ( let i = 0; i < removedParticles.length; i++ ) {
        removedParticles[ i ].dispose();
      }
    }

    /**
     * Removes all particles from the precipitate.
     * @private
     * @override
     */
    removeAllParticles() {
      if ( this.particles.length > 0 ) {
        this.removeParticles( this.particles.length );
      }
    }

    // @private Gets a random position, in global model coordinate frame.
    getRandomOffset() {
      const particleSize = this.solution.soluteProperty.get().particleSize;
      // particles are square, largest margin required is the diagonal length
      const margin = Math.sqrt( particleSize * particleSize );
      // offset
      const x = this.beaker.position.x - ( this.beaker.size.width / 2 ) + margin + ( phet.joist.random.nextDouble() * ( this.beaker.size.width - ( 2 * margin ) ) );
      const y = this.beaker.position.y - margin; // this was tweaked based on the lineWidth used to stroke the beaker
      return new Vector2( x, y );
    }
  }

  // Gets a random orientation, in radians.
  function getRandomOrientation() {
    return phet.joist.random.nextDouble() * 2 * Math.PI;
  }

  return beersLawLab.register( 'Precipitate', Precipitate );
} );