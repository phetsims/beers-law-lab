// Copyright 2002-2013, University of Colorado

/**
 * The precipitate that forms on the bottom of the beaker.
 * Manages the creation and deletion of precipitate particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var PrecipitateParticle = require( "concentration/model/PrecipitateParticle" );
  var Vector2 = require( "DOT/Vector2" );

  /**
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @constructor
   */
  function Precipitate( solution, beaker ) {

    var thisPrecipitate = this;

    thisPrecipitate.solution = solution;
    thisPrecipitate.beaker = beaker;
    thisPrecipitate.particles = []; // PrecipitateParticle
    thisPrecipitate.addedCallbacks = []; // function(PrecipitateParticle)
    thisPrecipitate.removedCallbacks = []; // function(PrecipitateParticle)

    // when the saturation changes, update the number of precipitate particles
    thisPrecipitate.solution.precipitateAmount.link( function() {
      thisPrecipitate._updateParticles();
    } );

    // when the solute changes, remove all particles and create new particles for the solute
    thisPrecipitate.solution.solute.link( function() {
      thisPrecipitate._removeAllParticles();
      thisPrecipitate._updateParticles();
    } );
  }

  /**
   * Document the callback.
   * @name Precipitate~Callback
   * @param {Particle} particle
   */

  /**
   * Registers a callback that will be notified when a particle is added.
   * @param {Precipitate~Callback} callback
   */
  Precipitate.prototype.registerParticleAddedCallback = function( callback ) {
    this.addedCallbacks.push( callback );
  };

  /**
   * Registers a callback that will be notified when a particle is removed.
   * @param {Precipitate~Callback} callback
   */
  Precipitate.prototype.registerParticleRemovedCallback = function( callback ) {
    this.removedCallbacks.push( callback );
  };

  // Adds/removes particles to match the model
  Precipitate.prototype._updateParticles = function() {
    var numberOfParticles = this.solution.getNumberOfPrecipitateParticles();
    if ( numberOfParticles === 0 ) {
      this._removeAllParticles();
    }
    else if ( numberOfParticles > this.particles.length ) {
      // add particles
      while ( numberOfParticles > this.particles.length ) {
        this._addParticle( new PrecipitateParticle( this.solution.solute.get(), this._getRandomOffset(), Precipitate._getRandomOrientation() ) );
      }
    }
    else {
      // remove particles
      while ( numberOfParticles < this.particles.length ) {
        this._removeParticle( this.particles[ this.particles.length - 1 ] );
      }
    }
  };

  Precipitate.prototype._addParticle = function( particle ) {
    this.particles.push( particle );
    this._fireParticleAdded( particle );
  };

  Precipitate.prototype._removeParticle = function( particle ) {
    this.particles.splice( this.particles.indexOf( particle ), 1 );
    this._fireParticleRemoved( particle );
  };

  Precipitate.prototype._removeAllParticles = function() {
    var particles = this.particles.slice( 0 ); // copy to prevent concurrent modification
    for ( var i = 0; i < particles.length; i++ ) {
      this._removeParticle( particles[i] );
    }
  };

  // Notify that a {PrecipitateParticle} particle was added.
  Precipitate.prototype._fireParticleAdded = function( particle ) {
    var addedCallbacks = this.addedCallbacks.slice( 0 ); // copy to prevent concurrent modification
    for ( var i = 0; i < addedCallbacks.length; i++ ) {
      addedCallbacks[i]( particle );
    }
  };

  // Notify that a {PrecipitateParticle} particle was removed.
  Precipitate.prototype._fireParticleRemoved = function( particle ) {
    var removedCallbacks = this.removedCallbacks.slice( 0 ); // copy to prevent concurrent modification
    for ( var i = 0; i < removedCallbacks.length; i++ ) {
      removedCallbacks[i]( particle );
    }
  };

  // Gets a random location, relative to the coordinate frame of the beaker.
  Precipitate.prototype._getRandomOffset = function() {
    var particleSize = this.solution.solute.get().particleSize;
    // x offset
    var xMargin = particleSize;
    var width = this.beaker.size.width - particleSize - ( 2 * xMargin );
    var x = xMargin + ( Math.random() * width ) - ( this.beaker.size.width / 2 );
    // y offset
    var yMargin = particleSize;
    var y = -yMargin;
    // offset
    return new Vector2( x, y );
  };

  // Gets a random orientation, in radians.
  Precipitate._getRandomOrientation = function() {
    return Math.random() * 2 * Math.PI;
  };

  return Precipitate;
} );