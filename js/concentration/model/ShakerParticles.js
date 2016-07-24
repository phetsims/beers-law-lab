// Copyright 2013-2015, University of Colorado Boulder

/**
 * Manages the lifetime of shaker particles, from creation when they exit the shaker,
 * to deletion when they are delivered to the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Particles = require( 'BEERS_LAW_LAB/concentration/model/Particles' );
  var ShakerParticle = require( 'BEERS_LAW_LAB/concentration/model/ShakerParticle' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TShakerParticles = require( 'ifphetio!PHET_IO/simulations/beers-law-lab/types/TShakerParticles' );

  // Units for speed and acceleration are not meaningful here, adjust these so that it looks good.
  var INITIAL_SPEED = 100;
  var GRAVITATIONAL_ACCELERATION_MAGNITUDE = 150;

  // These offsets determine where a salt particle originates, relative to the shaker's location.
  var MAX_X_OFFSET = 20;
  var MAX_Y_OFFSET = 5;

  /**
   * @param {Shaker} shaker
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @param {Tandem} tandem
   * @constructor
   */
  function ShakerParticles( shaker, solution, beaker, tandem ) {

    Particles.call( this );

    var thisParticles = this;

    // @private
    thisParticles.shaker = shaker;
    thisParticles.solution = solution;
    thisParticles.beaker = beaker;

    // when the solute changes, remove all particles
    solution.soluteProperty.link( function() {
      thisParticles.removeAllParticles();
    } );

    this.shakerParticleGroupTandem = tandem.createGroupTandem( 'shakerParticle' );

    // no corresponding removeInstance is needed because this object exists for the lifetime of the sim
    TShakerParticles && tandem.addInstance( this, TShakerParticles );
  }

  beersLawLab.register( 'ShakerParticles', ShakerParticles );

  // Gets a random location relative to some origin
  var getRandomLocation = function( origin ) {
    // (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
    var xOffset = getRandomInt( -MAX_X_OFFSET, MAX_X_OFFSET ); // positive or negative
    var yOffset = getRandomInt( 0, MAX_Y_OFFSET ); // positive only
    return new Vector2( origin.x + xOffset, origin.y + yOffset );
  };

  // Gets a random number in a range
  var getRandomInt = function( min, max ) {
    return (Math.floor( Math.random() * (max - min + 1) ) + min);
  };

  // Gets a random orientation, in radians.
  var getRandomOrientation = function() {
    return Math.random() * 2 * Math.PI;
  };

  return inherit( Particles, ShakerParticles, {

    // @public
    reset: function() {
      this.removeAllParticles();
    },

    // @public Particle animation and delivery to the solution, called when the simulation clock ticks.
    step: function( deltaSeconds ) {

      var beaker = this.beaker;
      var shaker = this.shaker;
      var solution = this.solution;
      var changed = this.particles.length > 0;

      // propagate existing particles
      for ( var i = this.particles.length - 1; i >= 0; i-- ) {

        var particle = this.particles[ i ];
        particle.step( deltaSeconds, beaker );

        // If the particle hits the solution surface or bottom of the beaker, delete it, and add a corresponding amount of solute to the solution.
        var percentFull = solution.volumeProperty.get() / beaker.volume;
        var solutionSurfaceY = beaker.location.y - ( percentFull * beaker.size.height ) - solution.soluteProperty.get().particleSize;
        if ( particle.locationProperty.get().y > solutionSurfaceY ) {
          this.removeParticle( particle );
          var soluteAmount = Math.min(
            BLLConstants.SOLUTE_AMOUNT_RANGE.max,
            solution.soluteAmountProperty.get() + ( 1 / solution.soluteProperty.get().particlesPerMole )
          );
          solution.soluteAmountProperty.set( soluteAmount );
        }
      }

      // create new particles
      if ( shaker.dispensingRateProperty.get() > 0 ) {
        var numberOfParticles = Math.round( Math.max( 1, shaker.dispensingRateProperty.get() * solution.soluteProperty.get().particlesPerMole * deltaSeconds ) );
        for ( var j = 0; j < numberOfParticles; j++ ) {
          var shakerParticle = new ShakerParticle(
            solution.soluteProperty.get(),
            getRandomLocation( this.shaker.locationProperty.get() ),
            getRandomOrientation(),
            this.getInitialVelocity(),
            this.getGravitationalAcceleration(),
            this.shakerParticleGroupTandem.createNextTandem()
          );
          this.addParticle( shakerParticle );
        }
      }

      changed = changed || this.particles.length > 0;

      if ( changed ) {
        this.fireParticlesChanged();
      }
    },

    // @private Computes an initial velocity for the particle.
    getInitialVelocity: function() {
      return Vector2.createPolar( INITIAL_SPEED, this.shaker.orientation ); // in the direction the shaker is pointing
    },

    // @private Gravitational acceleration is in the downward direction.
    getGravitationalAcceleration: function() {
      return new Vector2( 0, GRAVITATIONAL_ACCELERATION_MAGNITUDE );
    },

    // @private
    addParticle: function( particle ) {
      this.particles.push( particle );
    },

    // @private
    removeParticle: function( particle ) {
      this.particles.splice( this.particles.indexOf( particle ), 1 );
      particle.dispose();
    },

    // @public
    removeAllParticles: function() {
      var particles = this.particles.slice( 0 );
      for ( var i = 0; i < particles.length; i++ ) {
        this.removeParticle( particles[ i ] );
      }
      this.fireParticlesChanged();
    },

    // @private Notify that at least one particle was added, removed, or moved
    fireParticlesChanged: function() {
      var changedCallbacks = this.changedCallbacks.slice( 0 );
      for ( var i = 0; i < changedCallbacks.length; i++ ) {
        changedCallbacks[ i ]();
      }
    }
  } );
} );
