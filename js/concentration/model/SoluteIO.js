// Copyright 2017, University of Colorado Boulder

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

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );
  var VoidIO = require( 'ifphetio!PHET_IO/types/VoidIO' );

  /**
   * @param {Solute} solute
   * @param {string} phetioID
   * @constructor
   */
  function SoluteIO( solute, phetioID ) {
    assert && assertInstanceOf( solute, phet.beersLawLab.Solute );
    ObjectIO.call( this, solute, phetioID );
  }

  phetioInherit( ObjectIO, 'SoluteIO', SoluteIO, {

    setName: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( text ) {
        this.instance.name = text;
      },
      documentation: 'Set the name of the solute'
    },

    setFormula: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( text ) {
        this.instance.formula = text;
      },
      documentation: 'Set the formula of the solute'
    }
  }, {
    documentation: 'The Solute for the sim.',

    /**
     * Serializes an instance.
     * @param {Solute} solute
     * @returns {Object}
     */
    toStateObject: function( solute ) {
      assert && assertInstanceOf( solute, phet.beersLawLab.Solute );
      return solute.tandem.phetioID;
    },

    /**
     * Deserializes an instance.
     * @param {Object} stateObject
     * @returns {Solute}
     */
    fromStateObject: function( stateObject ) {
      return phetio.getInstance( stateObject );
    }
  } );

  beersLawLab.register( 'SoluteIO', SoluteIO );

  return SoluteIO;
} );

