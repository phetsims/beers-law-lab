// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for BeersLawSolution.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const validate = require( 'AXON/validate' );

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
      return phet.phetIo.phetioEngine.getPhetioObject( stateObject );
    }
  }

  BeersLawSolutionIO.documentation = 'The solution for the sim';
  BeersLawSolutionIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.BeersLawSolution };
  BeersLawSolutionIO.typeName = 'BeersLawSolutionIO';
  ObjectIO.validateSubtype( BeersLawSolutionIO );

  return beersLawLab.register( 'BeersLawSolutionIO', BeersLawSolutionIO );
} );

