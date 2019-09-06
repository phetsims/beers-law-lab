// Copyright 2017-2019, University of Colorado Boulder

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
  var Vector2IO = require( 'DOT/Vector2IO' );
  var VoidIO = require( 'TANDEM/types/VoidIO' );
  var validate = require( 'AXON/validate' );

  class ShakerIO extends ObjectIO {

    /**
     * Serializes an instance.
     * @param {Shaker} shaker
     * @returns {Object}
     */
    static toStateObject( shaker ) {
      validate( shaker, this.validator );
      return { location: Vector2IO.toStateObject( shaker.previousLocation ) };
    }

    /**
     * Deserializes an instance.
     * @param {Object} stateObject
     * @returns {{location: Vector2}}
     */
    static fromStateObject( stateObject ) {
      return { location: Vector2IO.fromStateObject( stateObject.location ) };
    }

    /**
     * Set the location of the shaker using the value parsed in fromStateObject.  This method is automatically called by
     * phetioEngine.js when setting the state.
     * @param {Shaker} shaker
     * @param {{location: Vector2}} fromStateObject - the value returned by fromStateObject
     */
    static setValue( shaker, fromStateObject ) {
      validate( shaker, this.validator );
      shaker.previousLocation.set( fromStateObject.location );
    }
  }

  ShakerIO.methods = {
    setValue: {
      returnType: VoidIO,
      parameterTypes: [ ObjectIO ],
      implementation: function( value ) {
        this.phetioObject.previousLocation.set( Vector2IO.fromStateObject( value ) );
      },
      documentation: 'Load the values recorded in getState',
      invocableForReadOnlyElements: false
    }
  };
  ShakerIO.documentation = 'The Shaker that releases solute';
  ShakerIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.Shaker };
  ObjectIO.validateSubtype( ShakerIO );

  return beersLawLab.register( 'ShakerIO', ShakerIO );
} );