// Copyright 2013-2019, University of Colorado Boulder

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ConcentrationControl = require( 'BEERS_LAW_LAB/beerslaw/view/ConcentrationControl' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const SolutionComboBox = require( 'BEERS_LAW_LAB/beerslaw/view/SolutionComboBox' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class SolutionControls extends Panel {

    /**
     * @param {BeersLawSolution[]} solutions
     * @param {Property.<BeersLawSolution>} currentSolutionProperty
     * @param {Node} solutionListParent
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( solutions, currentSolutionProperty, solutionListParent, tandem, options ) {

      options = merge( {
        xMargin: 15,
        yMargin: 15,
        fill: '#F0F0F0',
        stroke: 'gray',
        lineWidth: 1,
        tandem: tandem
      }, options );

      // combo box, to select a solution
      const comboBox = new SolutionComboBox( solutions, currentSolutionProperty, solutionListParent, tandem.createTandem( 'comboBox' ) );

      // {{value:{BeersLawSolution}, node:{ConcentrationControl}} - concentration controls, one for each solution
      const toggleNodeElements = solutions.map( solution => {
        return {
          value: solution,
          node: new ConcentrationControl( solution, {
            visible: false,
            tandem: tandem.createTandem( solution.internalName + 'ConcentrationControl' ),
            phetioDocumentation: 'the concentration control for ' + solution.internalName
          } )
        };
      } );

      // Makes the control visible for the selected solution
      const toggleNode = new ToggleNode( currentSolutionProperty, toggleNodeElements );

      const contentNode = new VBox( {
        spacing: 15,
        align: 'left',
        children: [ comboBox, toggleNode ]
      } );

      super( contentNode, options );
    }
  }

  return beersLawLab.register( 'SolutionControls', SolutionControls );
} );