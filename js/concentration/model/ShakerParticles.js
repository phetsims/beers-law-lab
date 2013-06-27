// Copyright 2002-2013, University of Colorado Boulder

/**
 * Manages the lifetime of shaker particles, from creation when they exit the shaker,
 * to deletion when they are delivered to the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var ShakerParticle = require( "concentration/model/ShakerParticle" );
  var Vector2 = require( "DOT/Vector2" );

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
    thisParticles.addedCallbacks = [];  // function(ShakerParticle)
    thisParticles.removedCallbacks = []; // function(ShakerParticle)

    // when the solute changes, remove all particles
    solution.solute.link( function() {
      thisParticles._removeAllParticles();
    } );

    // remove all particles if the solute amount goes to zero.
    solution.soluteAmount.link( function( amount ) {
      if ( amount === 0 ) {
        thisParticles._removeAllParticles();
      }
    } );
  }

  ShakerParticles.prototype = {

    /**
     * Registers a callback that will be notified when a particle is added.
     * @param {ShakerParticles~Callback} callback, has a {Particle} parameter
     */
    registerParticleAddedCallback: function( callback ) {
      this.addedCallbacks.push( callback );
    },

    /**
     * Registers a callback that will be notified when a particle is removed.
     * @param {ShakerParticles~Callback} callback
     */
    registerParticleRemovedCallback: function( callback ) {
      this.removedCallbacks.push( callback );
    },

    // Particle animation and delivery to the solution, called when the simulation clock ticks.
    step: function( deltaSeconds ) {

      var beaker = this.beaker;
      var shaker = this.shaker;
      var solution = this.solution;

      // propagate existing particles
      for ( var i = 0; i < this.particles.length; i++ ) {

        var particle = this.particles[i];
        particle.step( deltaSeconds, beaker );

        // If the particle hits the solution surface or bottom of the beaker, delete it, and add a corresponding amount of solute to the solution.
        var percentFull = solution.volume.get() / beaker.volume;
        var solutionSurfaceY = beaker.location.y - ( percentFull * beaker.size.height ) - solution.solute.get().particleSize;
        if ( particle.location.get().y > solutionSurfaceY ) {
          this._removeParticle( particle );
          solution.soluteAmount.set( solution.soluteAmount.get() + ( 1 / solution.solute.get().particlesPerMole ) );
        }
      }

      // create new particles
      if ( shaker.dispensingRate.get() > 0 ) {
        var numberOfParticles = Math.round( Math.max( 1, shaker.dispensingRate.get() * solution.solute.get().particlesPerMole * deltaSeconds ) );
        for ( var j = 0; j < numberOfParticles; j++ ) {
          this._addParticle( new ShakerParticle( solution.solute.get(), this._getRandomLocation(), ShakerParticles._getRandomOrientation(),
            this._getInitialVelocity(), this._getGravitationalAcceleration() ) );
        }
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
      this._fireParticleAdded( particle );
    },

    _removeParticle: function( particle ) {
      this.particles.splice( this.particles.indexOf( particle ), 1 );
      this._fireParticleRemoved( particle );
    },

    _removeAllParticles: function() {
      var particles = this.particles.slice( 0 );
      for ( var i = 0; i < particles.length; i++ ) {
        this._removeParticle( particles[i] );
      }
    },

    // Notify that a {ShakerParticle} particle was added.
    _fireParticleAdded: function( particle ) {
      var addedCallbacks = this.addedCallbacks.slice( 0 );
      for ( var i = 0; i < addedCallbacks.length; i++ ) {
        addedCallbacks[i]( particle );
      }
    },

    // Notify that a {ShakerParticle} particle was removed.
    _fireParticleRemoved: function( particle ) {
      var removedCallbacks = this.removedCallbacks.slice( 0 );
      for ( var i = 0; i < removedCallbacks.length; i++ ) {
        removedCallbacks[i]( particle );
      }
    },

    _getRandomLocation: function() {
      // (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
      var xOffset = ShakerParticles._getRandomInt( -MAX_X_OFFSET, MAX_X_OFFSET ); // positive or negative
      var yOffset = ShakerParticles._getRandomInt( 0, MAX_Y_OFFSET ); // positive only
      return new Vector2( this.shaker.location.get().x + xOffset, this.shaker.location.get().y + yOffset );
    }
  };

  // Gets a random number in a range
  ShakerParticles._getRandomInt = function( min, max ) {
    return (Math.floor( Math.random() * (max - min + 1) ) + min);
  };

  // Gets a random orientation, in radians.
  ShakerParticles._getRandomOrientation = function() {
    return Math.random() * 2 * Math.PI;
  };

  return ShakerParticles;
} );