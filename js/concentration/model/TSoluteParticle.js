// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var NumberIO = require( 'ifphetio!PHET_IO/types/NumberIO' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var TVector2 = require( 'DOT/TVector2' );

  /**
   * @param {SoluteParticle} soluteParticle
   * @param {string} phetioID
   * @constructor
   */
  function TSoluteParticle( soluteParticle, phetioID ) {
    assert && assertInstanceOf( soluteParticle, phet.beersLawLab.SoluteParticle );
    ObjectIO.call( this, soluteParticle, phetioID );
  }

  phetioInherit( ObjectIO, 'TSoluteParticle', TSoluteParticle, {}, {

    fromStateObject: function( stateObject ) {
      return {
        location: TVector2.fromStateObject( stateObject.location ),
        orientation: NumberIO.fromStateObject( stateObject.orientation )
      };
    },

    toStateObject: function( value ) {
      return {
        location: TVector2.toStateObject( value.locationProperty.get() ),
        orientation: NumberIO.toStateObject( value.orientation )
      };
    },
    documentation: 'A particle that shows at the bottom of a saturated solution.'
  } );

  beersLawLab.register( 'TSoluteParticle', TSoluteParticle );

  return TSoluteParticle;
} );