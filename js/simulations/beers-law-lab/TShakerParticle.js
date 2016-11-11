// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TNumber = require( 'PHET_IO/types/TNumber' );
  var TObject = require( 'PHET_IO/types/TObject' );
  var TSolute = require( 'PHET_IO/simulations/beers-law-lab/TSolute' );
  var TTandem = require( 'PHET_IO/types/tandem/TTandem' );
  var TVector2 = require( 'PHET_IO/types/dot/TVector2' );
  var phetio = require( 'PHET_IO/phetio' );

  var TShakerParticle = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.ShakerParticle );
  };

  phetioInherit( TObject, 'TShakerParticle', TShakerParticle, {}, {

    /**
     * When the state is loaded back, create a ShakerParticle.
     * @param {string} id - the full phetioID to be registered with a tandem
     * @param {Object} value - the value that would be used with setValue, which can be used to customize the object creation.
     * @returns {ChargedParticle}
     */
    create: function( id, value ) {

    },

    fromStateObject: function( stateObject ) {
      return {
        solute: TSolute.fromStateObject( stateObject.solute ),
        location: TVector2.fromStateObject( stateObject.location ),
        orientation: TNumber().fromStateObject( stateObject.orientation ),
        velocity: TVector2.fromStateObject( stateObject.velocity ),
        acceleration: TVector2.fromStateObject( stateObject.acceleration ),
        tandem: TTandem.fromStateObject( stateObject.tandem )
      };
    },

    toStateObject: function( value ) {
      return {
        solute: TSolute.toStateObject( value.solute ),
        location: TVector2.toStateObject( value.locationProperty.get() ),
        orientation: TNumber().toStateObject( value.orientation ),
        velocity: TVector2.toStateObject( value.velocity ),
        acceleration: TVector2.toStateObject( value.acceleration ),
        tandem: TTandem.toStateObject( value.tandem )
      };
    },

    setValue: function( instance, value ) {}
  } );

  phetioNamespace.register( 'TShakerParticle', TShakerParticle );

  return TShakerParticle;
} );

