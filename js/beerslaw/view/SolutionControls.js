// Copyright 2013-2020, University of Colorado Boulder

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import ConcentrationControl from './ConcentrationControl.js';
import SolutionComboBox from './SolutionComboBox.js';

class SolutionControls extends Panel {

  /**
   * @param {BeersLawSolution[]} solutions
   * @param {Property.<BeersLawSolution>} currentSolutionProperty
   * @param {Node} solutionListParent
   * @param {Object} [options]
   */
  constructor( solutions, currentSolutionProperty, solutionListParent, options ) {

    options = merge( {
      xMargin: 15,
      yMargin: 15,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: Tandem.REQUIRED
    }, options );

    // combo box, to select a solution
    const solutionComboBox = new SolutionComboBox( solutions, currentSolutionProperty, solutionListParent, {
      tandem: options.tandem.createTandem( 'solutionComboBox' )
    } );

    // {{value:{BeersLawSolution}, node:{ConcentrationControl}} - concentration controls, one for each solution
    const toggleNodeElements = solutions.map( solution => {
      return {
        value: solution,
        node: new ConcentrationControl( solution, {
          visible: false,
          tandem: options.tandem.createTandem( solution.internalName + 'ConcentrationControl' ),
          phetioDocumentation: 'the concentration control for ' + solution.internalName
        } )
      };
    } );

    // Makes the control visible for the selected solution
    const toggleNode = new ToggleNode( currentSolutionProperty, toggleNodeElements );

    const contentNode = new VBox( {
      spacing: 15,
      align: 'left',
      children: [ solutionComboBox, toggleNode ]
    } );

    super( contentNode, options );
  }
}

beersLawLab.register( 'SolutionControls', SolutionControls );
export default SolutionControls;