// Copyright 2002-2013, University of Colorado Boulder

/**
 * The precipitate that forms on the bottom of the beaker.
 * Manages the creation and deletion of precipitate particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PrecipitateParticle = require( 'BEERS_LAW_LAB/concentration/model/PrecipitateParticle' );
  var Vector2 = require( 'DOT/Vector2' );

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
    thisPrecipitate.changedCallbacks = []; // function(Precipitate), private

    // when the saturation changes, update the number of precipitate particles
    thisPrecipitate.solution.precipitateAmountProperty.link( function() {
      thisPrecipitate.updateParticles();
    } );

    // when the solute changes, remove all particles and create new particles for the solute
    thisPrecipitate.solution.soluteProperty.link( function() {
      thisPrecipitate.removeAllParticles();
      thisPrecipitate.updateParticles();
    } );
  }

  // Gets a random orientation, in radians.
  var getRandomOrientation = function() {
    return Math.random() * 2 * Math.PI;
  };

  return inherit( Object, Precipitate, {

    /**
     * Registers a callback that will be notified when the precipitate changes.
     * @param {Precipitate~Callback} callback has a {Particle} parameter
     */
    registerChangedCallback: function( callback ) {
      this.changedCallbacks.push( callback );
    },

    /*
     * @private
     * Adds/removes particles to match the model.
     * To optimize performance, clients who register for the 'change' callback will assume that
     * particles are added/removed from the end of the 'particles' array.  See #48.
     */
    updateParticles: function() {
      var numberOfParticles = this.solution.getNumberOfPrecipitateParticles(); // number of particles desired after this update
      if ( numberOfParticles === this.particles.length ) {
        // no change, do nothing
        return;
      }
      else if ( numberOfParticles === 0 ) {
        // remove all particles
        this.removeAllParticles();
      }
      else if ( numberOfParticles < this.particles.length ) {
        // remove some particles
        var numberToRemove = this.particles.length - numberOfParticles;
        this.particles.splice( this.particles.length - 1 - numberToRemove, numberToRemove );
      }
      else {
        // add some particles
        while ( numberOfParticles > this.particles.length ) {
          this.particles.push( new PrecipitateParticle( this.solution.soluteProperty.get(), this.getRandomOffset(), getRandomOrientation() ) );
        }
      }
      assert && assert( this.particles.length === numberOfParticles );
      this.fireChanged();
    },

    // @private
    removeAllParticles: function() {
      this.particles = [];
    },

    // @private Notify that the precipitate has changed.
    fireChanged: function() {
      var changedCallbacks = this.changedCallbacks.slice( 0 ); // copy to prevent concurrent modification
      for ( var i = 0; i < changedCallbacks.length; i++ ) {
        changedCallbacks[ i ]( this );
      }
    },

    // @private Gets a random location, in global model coordinate frame.
    getRandomOffset: function() {
      var particleSize = this.solution.soluteProperty.get().particleSize;
      // particles are square, largest margin required is the diagonal length
      var margin = Math.sqrt( particleSize * particleSize );
      // offset
      var x = this.beaker.location.x - ( this.beaker.size.width / 2 ) + margin + ( Math.random() * ( this.beaker.size.width - ( 2 * margin ) ) );
      var y = this.beaker.location.y - margin; // this was tweaked based on the lineWidth used to stroke the beaker
      return new Vector2( x, y );
    }
  } );
} );