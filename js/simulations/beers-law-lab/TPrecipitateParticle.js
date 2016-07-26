// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare
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

  var TPrecipitateParticle = phetioInherit( TObject, 'TPrecipitateParticle', function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.PrecipitateParticle );
  }, {
    setValue: {
      implementation: function( value ) {
        // grouped item, should have value set with create.  What is this for?  I don't know.
      }
    }
  }, {

    /**
     * When the state is loaded back, create a ShakerParticle.
     * @param {string} id - the full phetioID to be registered with a tandem
     * @param {Object} value - the value that would be used with setValue, which can be used to customize the object creation.
     * @returns {ChargedParticle}
     */
    create: function( id, value ) {

      var rootTandem = phet.tandem.Tandem.createRootTandem();
      var model = phetio.getInstance( rootTandem.id + '.concentrationScreen.model.precipitate' );

      // solute, location, orientation, initialVelocity, acceleration, tandem
      model.particles.push( new phet.beersLawLab.PrecipitateParticle(
        value.solute,
        value.location,
        value.orientation,
        value.tandem
      ) );
      model.fireChanged();
    },

    fromStateObject: function( stateObject ) {
      return {
        solute: TSolute.fromStateObject( stateObject.solute ),
        location: TVector2.fromStateObject( stateObject.location ),
        orientation: TNumber.fromStateObject( stateObject.orientation ),
        tandem: TTandem.fromStateObject( stateObject.tandem )
      };
    },

    toStateObject: function( value ) {
      return {
        solute: TSolute.toStateObject( value.solute ),
        location: TVector2.toStateObject( value.locationProperty.get() ),
        orientation: TNumber.toStateObject( value.orientation ),
        tandem: TTandem.toStateObject( value.tandem )
      };
    }
  } );

  phetioNamespace.register( 'TPrecipitateParticle', TPrecipitateParticle );

  return TPrecipitateParticle;
} );

