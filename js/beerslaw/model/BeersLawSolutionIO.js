// Copyright 2017, University of Colorado Boulder

/**
 * IO type for BeersLawSolution.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {BeersLawSolution} beersLawSolution
   * @param {string} phetioID
   * @constructor
   */
  function BeersLawSolutionIO( beersLawSolution, phetioID ) {
    assert && assertInstanceOf( beersLawSolution, phet.beersLawLab.BeersLawSolution );
    ObjectIO.call( this, beersLawSolution, phetioID );
  }

  phetioInherit( ObjectIO, 'BeersLawSolutionIO', BeersLawSolutionIO, {}, {
    documentation: 'The solution for the sim',

    /**
     * Serializes an instance.
     * @param {BeersLawSolution} beersLawSolution
     * @returns {Object}
     */
    toStateObject: function( beersLawSolution ) {
      assert && assertInstanceOf( beersLawSolution, phet.beersLawLab.BeersLawSolution );
      return beersLawSolution.tandem.phetioID;
    },

    /**
     * Deserializes an instance.
     * Because the simulation has a Property that contains BeersLawSolution,
     * the Property relies on these methods for saving and loading the values.
     * @param {Object} stateObject
     * @returns {BeersLawSolution}
     */
    fromStateObject: function( stateObject ) {
      return phetio.getWrapper( stateObject ).instance;
    }
  } );

  beersLawLab.register( 'BeersLawSolutionIO', BeersLawSolutionIO );

  return BeersLawSolutionIO;
} );

