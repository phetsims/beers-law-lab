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
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var Vector2IO = require( 'DOT/Vector2IO' );
  var VoidIO = require( 'TANDEM/types/VoidIO' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {Shaker} shaker
   * @param {string} phetioID
   * @constructor
   */
  function ShakerIO( shaker, phetioID ) {
    ObjectIO.call( this, shaker, phetioID );
  }

  phetioInherit( ObjectIO, 'ShakerIO', ShakerIO, {
    setValue: {
      returnType: VoidIO,
      parameterTypes: [ ObjectIO ],
      implementation: function( value ) {
        this.instance.previousLocation.set( Vector2IO.fromStateObject( value ) );
      },
      documentation: 'Load the values recorded in getState',
      invocableForReadOnlyElements: false
    }
  }, {
    documentation: 'The Shaker that releases solute',
    validator: { isValidValue: v => v instanceof phet.beersLawLab.Shaker },

    /**
     * Serializes an instance.
     * @param {Shaker} shaker
     * @returns {Object}
     */
    toStateObject: function( shaker ) {
      validate( shaker, this.validator );
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
     * Set the location of the shaker using the value parsed in fromStateObject.  This method is automatically called by
     * phetioEngine.js when setting the state.
     * @param {Shaker} shaker
     * @param {{location: Vector2}} fromStateObject - the value returned by fromStateObject
     */
    setValue: function( shaker, fromStateObject ) {
      validate( shaker, this.validator );
      shaker.previousLocation.set( fromStateObject.location );
    }
  } );

  beersLawLab.register( 'ShakerIO', ShakerIO );

  return ShakerIO;
} );