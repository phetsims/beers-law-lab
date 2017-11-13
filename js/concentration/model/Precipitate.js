// Copyright 2013-2017, University of Colorado Boulder

/**
 * The precipitate that forms on the bottom of the beaker.
 * Manages the creation and deletion of precipitate particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Particles = require( 'BEERS_LAW_LAB/concentration/model/Particles' );
  var PrecipitateParticle = require( 'BEERS_LAW_LAB/concentration/model/PrecipitateParticle' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TPrecipitate = require( 'BEERS_LAW_LAB/concentration/model/TPrecipitate' );

  /**
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @param {Tandem} tandem
   * @constructor
   */
  function Precipitate( solution, beaker, tandem ) {

    Particles.call( this );

    var self = this;

    // @private
    this.solution = solution;
    this.beaker = beaker;

    // @private
    this.precipitateParticleGroupTandem = tandem.createGroupTandem( 'precipitateParticle' );

    // when the saturation changes, update the number of precipitate particles
    this.solution.precipitateAmountProperty.link( function() {
      self.updateParticles();
    } );

    // when the solute changes, remove all particles and create new particles for the solute
    this.solution.soluteProperty.link( function() {
      self.removeAllParticles();
      self.updateParticles();
    } );

    // Persists for the life of the sim, no need to be disposed
    tandem.addInstance( this, TPrecipitate );
  }

  beersLawLab.register( 'Precipitate', Precipitate );

  // Gets a random orientation, in radians.
  var getRandomOrientation = function() {
    return phet.joist.random.nextDouble() * 2 * Math.PI;
  };

  return inherit( Particles, Precipitate, {

    /*
     * Adds/removes particles to match the model.
     * To optimize performance, clients who register for the 'change' callback will assume that
     * particles are added/removed from the end of the 'particles' array.  See #48.
     * @private
     */
    updateParticles: function() {

      // number of particles desired after this update
      var numberOfParticles = this.solution.getNumberOfPrecipitateParticles();

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
    },

    /**
     * Adds particles to the precipitate.
     * @param {number} numberToAdd
     * @private
     */
    addParticles: function( numberToAdd ) {
      assert && assert( numberToAdd > 0, 'invalid numberToAdd: ' + numberToAdd );
      for ( var i = 0; i < numberToAdd; i++ ) {
        this.particles.push( new PrecipitateParticle(
          this.solution.soluteProperty.get(),
          this.getRandomOffset(),
          getRandomOrientation(),
          this.precipitateParticleGroupTandem.createNextTandem()
        ) );
      }
    },

    /**
     * Removes particles from the precipitate.
     * @param {number} numberToRemove
     * @private
     */
    removeParticles: function( numberToRemove ) {
      assert && assert( numberToRemove > 0 && numberToRemove <= this.particles.length,
        'invalid numberToRemove: ' + numberToRemove );

      var removedParticles = this.particles.splice( this.particles.length - numberToRemove, numberToRemove );
      assert && assert( removedParticles && removedParticles.length === numberToRemove );

      for ( var i = 0; i < removedParticles.length; i++ ) {
        removedParticles[ i ].dispose();
      }
    },

    /**
     * Removes all particles from the precipitate.
     * @private
     */
    removeAllParticles: function() {
      if ( this.particles.length > 0 ) {
        this.removeParticles( this.particles.length );
      }
    },

    // @private Gets a random location, in global model coordinate frame.
    getRandomOffset: function() {
      var particleSize = this.solution.soluteProperty.get().particleSize;
      // particles are square, largest margin required is the diagonal length
      var margin = Math.sqrt( particleSize * particleSize );
      // offset
      var x = this.beaker.location.x - ( this.beaker.size.width / 2 ) + margin + ( phet.joist.random.nextDouble() * ( this.beaker.size.width - ( 2 * margin ) ) );
      var y = this.beaker.location.y - margin; // this was tweaked based on the lineWidth used to stroke the beaker
      return new Vector2( x, y );
    }
  } );
} );