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
  var TParticles = require( 'BEERS_LAW_LAB/concentration/model/TParticles' );
  var TPrecipitateParticle = require( 'BEERS_LAW_LAB/concentration/model/TPrecipitateParticle' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TPrecipitate( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.beersLawLab.Precipitate );
    TParticles.call( this, instance, phetioID );
  }

  phetioInherit( TParticles, 'TPrecipitate', TPrecipitate, {}, {
    documentation: 'The precipitate that comes from the solution',

    clearChildInstances: function( precipitate ) {
      TParticles.clearChildInstances( precipitate );
    },

    /**
     * Adds a precipitate particle as specified by the phetioID and state.
     * @param {Object} precipitate
     * @param {Tandem} tandem
     * @param {Object} stateObject
     */
    addChildInstance: function( precipitate, tandem, stateObject ) {
      var value = TPrecipitateParticle.fromStateObject( stateObject );
      TParticles.addParticle( precipitate, new phet.beersLawLab.PrecipitateParticle(
        value.solute,
        value.location,
        value.orientation,
        tandem
      ) );
    }
  } );

  beersLawLab.register( 'TPrecipitate', TPrecipitate );

  return TPrecipitate;
} );

