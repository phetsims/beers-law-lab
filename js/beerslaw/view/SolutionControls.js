// Copyright 2013-2017, University of Colorado Boulder

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ConcentrationControl = require( 'BEERS_LAW_LAB/beerslaw/view/ConcentrationControl' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var SolutionComboBox = require( 'BEERS_LAW_LAB/beerslaw/view/SolutionComboBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {BeersLawSolution[]} solutions
   * @param {Property.<BeersLawSolution>} currentSolutionProperty
   * @param {Node} solutionListParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function SolutionControls( solutions, currentSolutionProperty, solutionListParent, tandem, options ) {

    options = _.extend( {
      xMargin: 15,
      yMargin: 15,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: tandem
    }, options );

    // combo box, to select a solution
    var comboBox = new SolutionComboBox( solutions, currentSolutionProperty, solutionListParent, tandem.createTandem( 'comboBox' ) );

    // concentration controls, one for each solution
    var concentrationControls = [];
    solutions.forEach( function( solution ) {
      concentrationControls.push( new ConcentrationControl( solution, {
        visible: false,
        tandem: tandem.createTandem( solution.internalName + 'ConcentrationControl' ),
        phetioDocumentation: 'the concentration control for ' + solution.name
      } ) );
    } );
    
    var concentrationControlsParent = new Node( { children: concentrationControls } );

    var contentNode = new VBox( {
      spacing: 15,
      align: 'left',
      children: [ comboBox, concentrationControlsParent ]
    } );

    Panel.call( this, contentNode, options );

    // Make the control visible for the selected solution
    currentSolutionProperty.link( function( currentSolution ) {
      concentrationControls.forEach( function( concentrationControl ) {
        concentrationControl.visible = ( currentSolution === concentrationControl.solution );
      } );
    } );
  }

  beersLawLab.register( 'SolutionControls', SolutionControls );

  return inherit( Panel, SolutionControls );
} );