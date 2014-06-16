// Copyright 2002-2013, University of Colorado Boulder

/**
 * Manages the lifetime of shaker particles, from creation when they exit the shaker,
 * to deletion when they are delivered to the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ShakerParticle = require( 'BEERS_LAW_LAB/concentration/model/ShakerParticle' );
  var Vector2 = require( 'DOT/Vector2' );

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
   * @constructor
   */
  function ShakerParticles( shaker, solution, beaker ) {

    var thisParticles = this;

    thisParticles.shaker = shaker;
    thisParticles.solution = solution;
    thisParticles.beaker = beaker;
    thisParticles.particles = []; // ShakerParticle
    thisParticles.changedCallbacks = []; // function(ShakerParticle)

    // when the solute changes, remove all particles
    solution.solute.link( function() {
      thisParticles.removeAllParticles();
    } );
  }

  ShakerParticles.prototype = {

    /**
     * Registers a callback that will be notified when particles move, or when all particles are removed.
     * @param {ShakerParticles~Callback} callback
     */
    registerParticleChangedCallback: function( callback ) {
      this.changedCallbacks.push( callback );
    },

    // Particle animation and delivery to the solution, called when the simulation clock ticks.
    step: function( deltaSeconds ) {

      var beaker = this.beaker;
      var shaker = this.shaker;
      var solution = this.solution;
      var changed = this.particles.length > 0;

      // propagate existing particles
      for ( var i = this.particles.length - 1; i >= 0; i-- ) {

        var particle = this.particles[i];
        particle.step( deltaSeconds, beaker );

        // If the particle hits the solution surface or bottom of the beaker, delete it, and add a corresponding amount of solute to the solution.
        var percentFull = solution.volume.get() / beaker.volume;
        var solutionSurfaceY = beaker.location.y - ( percentFull * beaker.size.height ) - solution.solute.get().particleSize;
        if ( particle.locationProperty.get().y > solutionSurfaceY ) {
          this._removeParticle( particle );
          solution.soluteAmount.set( solution.soluteAmount.get() + ( 1 / solution.solute.get().particlesPerMole ) );
        }
      }

      // create new particles
      if ( shaker.dispensingRate.get() > 0 ) {
        var numberOfParticles = Math.round( Math.max( 1, shaker.dispensingRate.get() * solution.solute.get().particlesPerMole * deltaSeconds ) );
        for ( var j = 0; j < numberOfParticles; j++ ) {
          this._addParticle( new ShakerParticle( solution.solute.get(), getRandomLocation( this.shaker.locationProperty.get() ), getRandomOrientation(),
            this._getInitialVelocity(), this._getGravitationalAcceleration() ) );
        }
      }

      changed = changed || this.particles.length > 0;

      if ( changed ) {
        this._fireParticlesChanged();
      }
    },

    // Computes an initial velocity for the particle.
    _getInitialVelocity: function() {
      return Vector2.createPolar( INITIAL_SPEED, this.shaker.orientation ); // in the direction the shaker is pointing
    },

    // Gravitational acceleration is in the downward direction.
    _getGravitationalAcceleration: function() {
      return new Vector2( 0, GRAVITATIONAL_ACCELERATION_MAGNITUDE );
    },

    _addParticle: function( particle ) {
      this.particles.push( particle );
    },

    _removeParticle: function( particle ) {
      this.particles.splice( this.particles.indexOf( particle ), 1 );
    },

    removeAllParticles: function() {
      var particles = this.particles.slice( 0 );
      for ( var i = 0; i < particles.length; i++ ) {
        this._removeParticle( particles[i] );
      }
      this._fireParticlesChanged();
    },

    // Notify that at least one particle was added, removed, or moved
    _fireParticlesChanged: function() {
      var changedCallbacks = this.changedCallbacks.slice( 0 );
      for ( var i = 0; i < changedCallbacks.length; i++ ) {
        changedCallbacks[i]();
      }
    }
  };

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

  return ShakerParticles;
} );
