// Copyright 2017-2018, University of Colorado Boulder

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
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var StringIO = require( 'TANDEM/types/StringIO' );
  var VoidIO = require( 'TANDEM/types/VoidIO' );
  var validate = require( 'AXON/validate' );

  // ifphetio
  var phetioEngine = require( 'ifphetio!PHET_IO/phetioEngine' );

  /**
   * @param {Solute} solute
   * @param {string} phetioID
   * @constructor
   */
  function SoluteIO( solute, phetioID ) {
    ObjectIO.call( this, solute, phetioID );
  }

  phetioInherit( ObjectIO, 'SoluteIO', SoluteIO, {

    setName: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( text ) {
        this.instance.name = text;
      },
      documentation: 'Set the name of the solute',
      invocableForReadOnlyElements: false
    },

    setFormula: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( text ) {
        this.instance.formula = text;
      },
      documentation: 'Set the formula of the solute',
      invocableForReadOnlyElements: false
    }
  }, {
    documentation: 'The Solute for the sim.',
    validator: { isValidValue: v => v instanceof phet.beersLawLab.Solute },

    /**
     * Serializes an instance.
     * @param {Solute} solute
     * @returns {Object}
     */
    toStateObject: function( solute ) {
      validate( solute, this.validator );
      return solute.tandem.phetioID;
    },

    /**
     * Deserializes an instance.
     * @param {Object} stateObject
     * @returns {Solute}
     */
    fromStateObject: function( stateObject ) {
      return phetioEngine.getInstance( stateObject );
    }
  } );

  beersLawLab.register( 'SoluteIO', SoluteIO );

  return SoluteIO;
} );

