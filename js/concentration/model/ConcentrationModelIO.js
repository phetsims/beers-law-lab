// Copyright 2017-2018, University of Colorado Boulder

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
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var SoluteIO = require( 'BEERS_LAW_LAB/concentration/model/SoluteIO' );
  var VoidIO = require( 'TANDEM/types/VoidIO' );

  /**
   * @param {ConcentrationModel} concentrationModel
   * @param {string} phetioID
   * @constructor
   */
  function ConcentrationModelIO( concentrationModel, phetioID ) {
    ObjectIO.call( this, concentrationModel, phetioID );
  }

  phetioInherit( ObjectIO, 'ConcentrationModelIO', ConcentrationModelIO, {
    setSolutes: {
      parameterTypes: [ ArrayIO( SoluteIO ) ],
      returnType: VoidIO,
      implementation: function( solutes ) {
        this.instance.setSolutes( solutes );
      },
      documentation: 'Set which solutes are allowed for selection',
      invocableForReadOnlyElements: false
    }
  }, {
    documentation: 'The model for the concentration screen.',
    validator: { isValidValue: v => v instanceof phet.beersLawLab.ConcentrationModel }
  } );

  beersLawLab.register( 'ConcentrationModelIO', ConcentrationModelIO );

  return ConcentrationModelIO;
} );

