// Copyright 2015-2017, University of Colorado Boulder

/**
 * Abstract base type for a collection of particles.
 *
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetioObject = require( 'TANDEM/PhetioObject' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Particles( options ) {
    this.particles = []; // @public the particles in the collection
    this.changedEmitter = new Emitter(); // @private emit is called when the collection of particles changes

    PhetioObject.call( this, options );
  }

  beersLawLab.register( 'Particles', Particles );

  return inherit( PhetioObject, Particles, {

    /**
     * Adds a particle.
     * @param {SoluteParticle} particle
     * @protected
     */
    addParticle: function( particle ) {
      this.particles.push( particle );
    },

    /**
     * Registers a listener that will be called when the collection of particles has changed in some way
     * (eg, number of particles, particles move, ...)
     * @param {function} listener
     * @public
     */
    addChangedListener: function( listener ) {
      this.changedEmitter.addListener( listener );
    },

    /**
     * Notify listeners that the particles have changed.
     * @protected
     */
    fireChanged: function() {
      this.changedEmitter.emit();
    }
  } );
} );
