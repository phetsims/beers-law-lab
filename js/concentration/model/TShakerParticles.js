// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var TShakerParticle = require( 'BEERS_LAW_LAB/concentration/model/TShakerParticle' );
  var TParticles = require( 'BEERS_LAW_LAB/concentration/model/TParticles' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TShakerParticles( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.ShakerParticles );
    TParticles.call( this, instance, phetioID );
  }

  phetioInherit( TObject, 'TShakerParticles', TShakerParticles, {}, {
    documentation: 'Base type for a group of particles.',

    clearChildInstances: function( instance ) {
      TParticles.clearChildInstances( instance );
    },

    /**
     * Create a dynamic particle as specified by the phetioID and state.
     * @param {Object} instance
     * @param {Tandem} tandem
     * @param {Object} stateObject
     * @returns {ChargedParticle}
     */
    addChildInstance: function( instance, tandem, stateObject ) {
      var value = TShakerParticle.fromStateObject( stateObject );
      assert && assert( value.acceleration instanceof phet.dot.Vector2, 'acceleration should be a Vector2' );
      TParticles.addParticle( instance, new phet.beersLawLab.ShakerParticle(
        value.solute,
        value.location,
        value.orientation,
        value.velocity,
        value.acceleration,
        tandem
      ) );
    }
  } );

  beersLawLab.register( 'TShakerParticles', TShakerParticles );

  return TShakerParticles;
} );