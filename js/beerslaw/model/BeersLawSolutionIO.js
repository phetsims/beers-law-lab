// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for BeersLawSolution.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioEngine = require( 'ifphetio!PHET_IO/phetioEngine' );

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
     * @override
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
     * @override
     */
    fromStateObject: function( stateObject ) {
      return phetioEngine.getInstance( stateObject );
    }
  } );

  beersLawLab.register( 'BeersLawSolutionIO', BeersLawSolutionIO );

  return BeersLawSolutionIO;
} );

