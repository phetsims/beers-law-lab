// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Solute.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var StringIO = require( 'TANDEM/types/StringIO' );
  var VoidIO = require( 'TANDEM/types/VoidIO' );
  var validate = require( 'AXON/validate' );

  // ifphetio
  var phetioEngine = require( 'ifphetio!PHET_IO/phetioEngine' );

  class SoluteIO extends ObjectIO {

    /**
     * Serializes an instance.
     * @param {Solute} solute
     * @returns {Object}
     */
    static toStateObject( solute ) {
      validate( solute, this.validator );
      return solute.tandem.phetioID;
    }

    /**
     * Deserializes an instance.
     * @param {Object} stateObject
     * @returns {Solute}
     */
    static fromStateObject( stateObject ) {
      return phetioEngine.getPhetioObject( stateObject );
    }
  }

  SoluteIO.methods = {

    setName: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( text ) {
        this.phetioObject.name = text;
      },
      documentation: 'Set the name of the solute',
      invocableForReadOnlyElements: false
    },

    setFormula: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( text ) {
        this.phetioObject.formula = text;
      },
      documentation: 'Set the formula of the solute',
      invocableForReadOnlyElements: false
    }
  };

  SoluteIO.documentation = 'The Solute for the sim.';
  SoluteIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.Solute };
  SoluteIO.typeName = 'SoluteIO';
  ObjectIO.validateSubtype( SoluteIO );

  return beersLawLab.register( 'SoluteIO', SoluteIO );
} );

