// Copyright 2002-2013, University of Colorado

/**
 * The precipitate that forms on the bottom of the beaker.
 * Manages the creation and deletion of precipitate particles.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Vector2 = require( "DOT/Vector2" );
  var PrecipitateParticle = require( "concentration/model/PrecipitateParticle" );

  /**
   * @param {ConcentrationSolution} solution
   * @param {Beaker} beaker
   * @constructor
   */
  function Precipitate( solution, beaker ) {

    var precipitate = this;

    precipitate.solution = solution;
    precipitate.beaker = beaker;
    precipitate.particles = new Array(); // PrecipitateParticle
    precipitate.addedCallbacks = new Array(); // function(PrecipitateParticle)
    precipitate.removedCallbacks = new Array(); // function(PrecipitateParticle)

    // when the saturation changes, update the number of precipitate particles
    precipitate.solution.precipitateAmount.addObserver( function () {
      precipitate._updateParticles();
    } );

    // when the solute changes, remove all particles and create new particles for the solute
    precipitate.solution.solute.addObserver( function () {
      precipitate._removeAllParticles();
      precipitate._updateParticles();
    } );
  }

  Precipitate.prototype.registerParticleAddedCallback = function ( callback ) {
    this.addedCallbacks.push( callback );
  };

  Precipitate.prototype.registerParticleRemovedCallback = function ( callback ) {
    this.removedCallbacks.push( callback );
  };

  // Adds/removes particles to match the model
  Precipitate.prototype._updateParticles = function () {
    var numberOfParticles = this.solution.getNumberOfPrecipitateParticles();
    if ( numberOfParticles == 0 ) {
      this._removeAllParticles();
    }
    else if ( numberOfParticles > this.particles.size() ) {
      // add particles
      while ( numberOfParticles > this.particles.size() ) {
        this._addParticle( new PrecipitateParticle( this.solution.solute.get(), this._getRandomOffset(), Precipitate.getRandomOrientation() ) );
      }
    }
    else {
      // remove particles
      while ( numberOfParticles < this.particles.size() ) {
        this._removeParticle( this.particles.get( this.particles.size() - 1 ) );
      }
    }
  };

  Precipitate.prototype._addParticle = function ( particle ) {
    this.particles.push( particle );
    this._fireParticleAdded( particle );
  };

  Precipitate.prototype._removeParticle = function ( particle ) {
    this.particles.splice( this.particles.indexOf( particle ), 1 );
    this._fireParticleRemoved( particle );
  };

  Precipitate.prototype._removeAllParticles = function () {
    var particles = this.particles.slice( 0 ); // copy to prevent concurrent modification
    for ( var i = 0; i < particles.length; i++ ) {
      this._removeParticle( particles[i] );
    }
  };

  // Notify that a {PrecipitateParticle} particle was added.
  Precipitate.prototype._fireParticleAdded = function ( particle ) {
    var addedCallbacks = this.addedCallbacks.slice( 0 ); // copy to prevent concurrent modification
    for ( var i = 0; i < addedCallbacks.length; i++ ) {
      addedCallbacks[i]( particle );
    }
  };

  // Notify that a {PrecipitateParticle} particle was removed.
  Precipitate.prototype._fireParticleRemoved = function ( particle ) {
    var removedCallbacks = this.removedCallbacks.slice( 0 ); // copy to prevent concurrent modification
    for ( var i = 0; i < removedCallbacks.length; i++ ) {
      removedCallbacks[i]( particle );
    }
  };

  // Gets a random location, relative to the coordinate frame of the beaker.
  Precipitate.prototype._getRandomOffset = function () {
    var particleSize = this.solution.solute.get().particleSize;
    // x offset
    var xMargin = particleSize;
    var width = this.beaker.size.getWidth() - particleSize - ( 2 * xMargin );
    var x = xMargin + ( Math.random() * width ) - ( this.beaker.size.getWidth() / 2 );
    // y offset
    var yMargin = particleSize;
    var y = -yMargin;
    // offset
    return new Vector2( x, y );
  };

  //TODO common code, duplicate of ShakerParticles.getRandomOrientation
  // Gets a random orientation, in radians.
  Precipitate.getRandomOrientation = function () {
    return Math.random() * 2 * Math.PI;
  };

  return Precipitate;

} );