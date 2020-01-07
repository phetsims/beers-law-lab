// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Shaker
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const Vector2IO = require( 'DOT/Vector2IO' );
  const VoidIO = require( 'TANDEM/types/VoidIO' );
  const validate = require( 'AXON/validate' );

  class ShakerIO extends ObjectIO {

    /**
     * Serializes an instance.
     * @param {Shaker} shaker
     * @returns {Object}
     */
    static toStateObject( shaker ) {
      validate( shaker, this.validator );
      return { position: Vector2IO.toStateObject( shaker.previousPosition ) };
    }

    /**
     * Deserializes an instance.
     * @param {Object} stateObject
     * @returns {{position: Vector2}}
     */
    static fromStateObject( stateObject ) {
      return { position: Vector2IO.fromStateObject( stateObject.position ) };
    }

    /**
     * Set the position of the shaker using the value parsed in fromStateObject.  This method is automatically called by
     * phetioEngine.js when setting the state.
     * @param {Shaker} shaker
     * @param {{position: Vector2}} fromStateObject - the value returned by fromStateObject
     */
    static setValue( shaker, fromStateObject ) {
      validate( shaker, this.validator );
      shaker.previousPosition.set( fromStateObject.position );
    }
  }

  ShakerIO.methods = {
    setValue: {
      returnType: VoidIO,
      parameterTypes: [ ObjectIO ],
      implementation: function( value ) {
        this.phetioObject.previousPosition.set( Vector2IO.fromStateObject( value ) );
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