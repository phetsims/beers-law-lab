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

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TShakerParticles( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.ShakerParticles );
    TObject.call( this, instance, phetioID );
  }

  phetioInherit( TObject, 'TShakerParticles', TShakerParticles, {}, {
    documentation: 'The particles that are shaken from the shaker.',

    clearChildInstances: function( instance ) {
      instance.removeAllParticles();
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

      // solute, location, orientation, initialVelocity, acceleration, tandem
      instance.addParticle( new phet.beersLawLab.ShakerParticle(
        value.solute,
        value.location,
        value.orientation,
        value.velocity,
        value.acceleration,
        tandem
      ) );

      // ShakerParticles.step is not called in playback mode, so this needs to be called explicitly to update the view.
      instance.fireChanged();
    }
  } );

  beersLawLab.register( 'TShakerParticles', TShakerParticles );

  return TShakerParticles;
} );