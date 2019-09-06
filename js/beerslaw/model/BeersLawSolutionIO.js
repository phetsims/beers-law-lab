// Copyright 2017-2019, University of Colorado Boulder

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
  var validate = require( 'AXON/validate' );

  // ifphetio
  var phetioEngine = require( 'ifphetio!PHET_IO/phetioEngine' );


  class BeersLawSolutionIO extends ObjectIO {

    /**
     * Serializes the instance into its phetioID.
     * @param {BeersLawSolution} beersLawSolution
     * @returns {string}
     * @override
     */
    static toStateObject( beersLawSolution ) {
      validate( beersLawSolution, this.validator );
      return beersLawSolution.tandem.phetioID;
    }

    /**
     * Deserializes an instance.
     * Because the simulation has a Property that contains BeersLawSolution,
     * the Property relies on these methods for saving and loading the values.
     * @param {Object} stateObject
     * @returns {BeersLawSolution}
     * @override
     */
    static fromStateObject( stateObject ) {
      return phetioEngine.getPhetioObject( stateObject );
    }
  }

  BeersLawSolutionIO.documentation = 'The solution for the sim';
  BeersLawSolutionIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.BeersLawSolution };
  BeersLawSolutionIO.typeName = 'BeersLawSolutionIO';
  ObjectIO.validateSubtype( BeersLawSolutionIO );

  return beersLawLab.register( 'BeersLawSolutionIO', BeersLawSolutionIO );
} );

