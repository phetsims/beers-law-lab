// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for ConcentrationModel.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrayIO = require( 'TANDEM/types/ArrayIO' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  var VoidIO = require( 'TANDEM/types/VoidIO' );

  class ConcentrationModelIO extends ObjectIO {}

  ConcentrationModelIO.methods = {
    setSolutes: {
      parameterTypes: [ ArrayIO( SoluteIO ) ],
      returnType: VoidIO,
      implementation: function( solutes ) {
        this.phetioObject.setSolutes( solutes );
      },
      documentation: 'Set which solutes are allowed for selection',
      invocableForReadOnlyElements: false
    }
  };
  ConcentrationModelIO.typeName = 'ConcentrationModelIO';
  ConcentrationModelIO.documentation = 'The model for the concentration screen.';
  ConcentrationModelIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.ConcentrationModel };
  ObjectIO.validateSubtype( ConcentrationModelIO );

  return beersLawLab.register( 'ConcentrationModelIO', ConcentrationModelIO );
} );

