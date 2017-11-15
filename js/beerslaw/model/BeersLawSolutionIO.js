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
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   * @param {BeersLawSolution} beersLawSolution
   * @param {string} phetioID
   * @constructor
   */
  function BeersLawSolutionIO( beersLawSolution, phetioID ) {
    assert && assertInstanceOf( beersLawSolution, phet.beersLawLab.BeersLawSolution );
    ObjectIO.call( this, beersLawSolution, phetioID );
  }

  phetioInherit( ObjectIO, 'BeersLawSolutionIO', BeersLawSolutionIO, {}, {
    documentation: 'The solution for the sim',

    // Because the simulation has a Property that contains BeersLawSolution, the Property relies on these methods for saving and loading the values.
    fromStateObject: function( stateObject ) {
      return phetio.getWrapper( stateObject ).instance;
    },

    toStateObject: function( instance ) {
      return instance.phetioID;
    }
  } );

  beersLawLab.register( 'BeersLawSolutionIO', BeersLawSolutionIO );

  return BeersLawSolutionIO;
} );

