// Copyright 2017, University of Colorado Boulder

/**
 * PhET-iO Type for Particles
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   * @param {Particles} particles
   * @param {string} phetioID
   * @constructor
   */
  function TParticles( particles, phetioID ) {
    assert && assertInstanceOf( particles, phet.beersLawLab.Particles );
    TObject.call( this, particles, phetioID );
  }

  phetioInherit( TObject, 'TParticles', TParticles, {}, {
    documentation: 'The particles that are shaken from the shaker.',

    /**
     * @param {Particles} particles
     * @public - called by subclasses
     */
    clearChildInstances: function( particles ) {
      particles.removeAllParticles();

      // Particles.step is not called in playback mode, so this needs to be called explicitly to update the view.
      particles.fireChanged();
    },

    /**
     * Create a dynamic particle as specified by the phetioID and state.
     * @param {Particles} particles
     * @param {Particle} particle
     * @public - called by subclasses
     */
    addParticle: function( particles, particle ) {
      particles.addParticle( particle );

      // Particles.step is not called in playback mode, so this needs to be called explicitly to update the view.
      particles.fireChanged();
    }
  } );

  beersLawLab.register( 'TParticles', TParticles );

  return TParticles;
} );