// Copyright 2002-2013, University of Colorado

/**
* Manages the lifetime of shaker particles, from creation when they exit the shaker,
* to deletion when they are delivered to the solution.
*
* @author Chris Malley (cmalley@pixelzoom.com)
*/
define(
  [
    "DOT/Vector2"
  ],
  function( Vector2 ) {

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

      var particles = this;

      particles.shaker = shaker;
      particles.solution = solution;
      particles.beaker = beaker;
      particles.particles = new Array(); // ShakerParticle
      particles.addedCallbacks = new Array();  // function(ShakerParticle)
      particles.removedCallbacks = new Array(); // function(ShakerParticle)

      // when the solute changes, remove all particles
      solution.solute.addObserver( function () {
        particles.removeAllParticles();
      } );
    }

    ShakerParticles.prototype.registerParticleAddedCallback = function ( callback ) {
      this.addedCallbacks.push( callback );
    };

    ShakerParticles.prototype.registerParticleRemovedCallback = function ( callback ) {
      this.removedCallbacks.push( callback );
    };

    // Particle animation and delivery to the solution, called when the simulation clock ticks.
    ShakerParticles.prototype.step = function ( deltaSeconds ) {

      var beaker = this.beaker;
      var shaker = this.shaker;
      var solution = this.solution;

      // propagate existing particles
      for ( var i = 0; i < this.particles.length; i++ ) {

        var particle = this.particles[i];
        particle.step( deltaSeconds, beaker );

        // If the particle hits the solution surface or bottom of the beaker, delete it, and add a corresponding amount of solute to the solution.
        var percentFull = solution.volume.get() / beaker.volume;
        var solutionSurfaceY = beaker.location.getY() - ( percentFull * beaker.size.getHeight() ) - solution.solute.get().particleSize;
        if ( particle.location.get().getY() > solutionSurfaceY ) {
          this.removeParticle( particle );
          solution.soluteAmount.set( solution.soluteAmount.get() + ( 1 / solution.solute.get().particlesPerMole ) );
        }
      }

      // create new particles
      if ( shaker.dispensingRate.get() > 0 ) {
        var numberOfParticles = Math.round( Math.max( 1, shaker.dispensingRate.get() * solution.solute.get().particlesPerMole * deltaSeconds ) );
        for ( var j = 0; j < numberOfParticles; j++ ) {
          this.addParticle( new ShakerParticle( solution.solute.get(), this.getRandomLocation(), ShakerParticles.getRandomOrientation(),
                                                this.getInitialVelocity(), this.getGravitationalAcceleration() ) );
        }
      }
    };

    // Computes an initial velocity for the particle.
    ShakerParticles.prototype.getInitialVelocity = function () {
      return Vector2.createPolar( INITIAL_SPEED, this.shaker.orientation ); // in the direction the shaker is pointing
    };

    // Gravitational acceleration is in the downward direction.
    ShakerParticles.prototype.getGravitationalAcceleration = function () {
      return new Vector2( 0, GRAVITATIONAL_ACCELERATION_MAGNITUDE );
    };

    ShakerParticles.prototype.addParticle = function ( particle ) {
      this.particles.add( particle );
      this.fireParticleAdded( particle );
    };

    ShakerParticles.prototype.removeParticle = function ( particle ) {
      this.particles.remove( particle );
      this.fireParticleRemoved( particle );
    };

    ShakerParticles.prototype.removeAllParticles = function () {
      var particles = this.particles.slice( 0 );
      for ( var i = 0; i < particles.length; i++ ) {
        this.removeParticle( particles[i] );
      }
    };

    // Notify that a {ShakerParticle} particle was added.
    ShakerParticles.prototype.fireParticleAdded = function ( particle ) {
      var addedCallbacks = this.addedCallbacks.slice( 0 );
      for ( var i = 0; i < addedCallbacks.length; i++ ) {
        addedCallbacks[i]( particle );
      }
    };

    // Notify that a {ShakerParticle} particle was removed.
    ShakerParticles.prototype.fireParticleRemoved = function ( particle ) {
      var removedCallbacks = this.removedCallbacks.slice( 0 );
      for ( var i = 0; i < removedCallbacks.length; i++ ) {
        removedCallbacks[i]( particle );
      }
    };

    ShakerParticles.prototype.getRandomLocation = function () {
      // (Math.floor(Math.random() * (randNumMax - randNumMin + 1)) + randNumMin);
      var xOffset = ShakerParticles.getRandomInt( -MAX_X_OFFSET, MAX_X_OFFSET ); // positive or negative
      var yOffset = ShakerParticles.getRandomInt( 0, MAX_Y_OFFSET ); // positive only
      return new Vector2( this.shaker.getX() + xOffset, this.shaker.getY() + yOffset );
    };

    //TODO common code
    // Gets a random number in a range
    ShakerParticles.getRandomInt = function( min, max ) {
      return (Math.floor(Math.random() * (max - min + 1)) + min);
    };

    //TODO common code
    // Gets a random orientation, in radians.
    ShakerParticles.getRandomOrientation = function () {
      return Math.random() * 2 * Math.PI;
    };

    return ShakerParticles;
  }
);
//
//
//    public void stepInTime( double deltaSeconds ) {
//
//
//    }
//

//