// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for Shaker
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
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var Vector2IO = require( 'DOT/Vector2IO' );
  var VoidIO = require( 'ifphetio!PHET_IO/types/VoidIO' );

  /**
   * @param {Shaker} shaker
   * @param {string} phetioID
   * @constructor
   */
  function ShakerIO( shaker, phetioID ) {
    assert && assertInstanceOf( shaker, phet.beersLawLab.Shaker );
    ObjectIO.call( this, shaker, phetioID );
  }

  phetioInherit( ObjectIO, 'ShakerIO', ShakerIO, {
    setValue: {
      returnType: VoidIO,
      parameterTypes: [ ObjectIO ],
      implementation: function( value ) {
        this.instance.previousLocation.set( Vector2IO.fromStateObject( value ) );
      },
      documentation: 'Load the values recorded in getState'
    }
  }, {
    documentation: 'The Shaker that releases solute',

    /**
     * Serializes an instance.
     * @param {Shaker} shaker
     * @returns {Object}
     */
    toStateObject: function( shaker ) {
      assert && assertInstanceOf( shaker, phet.beersLawLab.Shaker );
      return { location: Vector2IO.toStateObject( shaker.previousLocation ) };
    },

    /**
     * Deserializes an instance.
     * @param {Object} stateObject
     * @returns {{location: Vector2}}
     */
    fromStateObject: function( stateObject ) {
      return { location: Vector2IO.fromStateObject( stateObject.location ) };
    },

    /**
     * TODO #222 document
     * @param {Shaker} shaker
     * @param valueFromStateObject TODO #222 type expression
     */
    setValue: function( shaker, valueFromStateObject ) {
      assert && assertInstanceOf( shaker, phet.beersLawLab.Shaker );
      shaker.previousLocation.set( valueFromStateObject.location );
    }
  } );

  beersLawLab.register( 'ShakerIO', ShakerIO );

  return ShakerIO;
} );