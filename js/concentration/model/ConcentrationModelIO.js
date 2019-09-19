// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for ConcentrationModel.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrayIO = require( 'TANDEM/types/ArrayIO' );
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  const VoidIO = require( 'TANDEM/types/VoidIO' );

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

