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
  var validate = require( 'AXON/validate' );

  // ifphetio
  var phetioEngine = require( 'ifphetio!PHET_IO/phetioEngine' );

  /**
   * @param {BeersLawSolution} beersLawSolution
   * @param {string} phetioID
   * @constructor
   */
  function BeersLawSolutionIO( beersLawSolution, phetioID ) {
    ObjectIO.call( this, beersLawSolution, phetioID );
  }

  phetioInherit( ObjectIO, 'BeersLawSolutionIO', BeersLawSolutionIO, {}, {
    documentation: 'The solution for the sim',
    validator: { isValidValue: v => v instanceof phet.beersLawLab.BeersLawSolution },

    /**
     * Serializes the instance into its phetioID.
     * @param {BeersLawSolution} beersLawSolution
     * @returns {string}
     * @override
     */
    toStateObject: function( beersLawSolution ) {
      validate( beersLawSolution, this.validator );
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
      return phetioEngine.getPhetioObject( stateObject );
    }
  } );

  beersLawLab.register( 'BeersLawSolutionIO', BeersLawSolutionIO );

  return BeersLawSolutionIO;
} );

