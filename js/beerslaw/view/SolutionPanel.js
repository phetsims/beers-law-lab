// Copyright 2013-2020, University of Colorado Boulder

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from '../model/BeersLawSolution.js';
import ConcentrationControl from './ConcentrationControl.js';
import SolutionComboBox from './SolutionComboBox.js';

class SolutionPanel extends Panel {

  /**
   * @param {BeersLawSolution[]} solutions
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Node} solutionListParent
   * @param {Object} [options]
   */
  constructor( solutions, solutionProperty, solutionListParent, options ) {
    assert && assert( Array.isArray( solutions ) );
    assert && assert( _.every( solutions, solution => solution instanceof BeersLawSolution ) );
    assert && assert( solutionListParent instanceof Node );

    options = merge( {
      xMargin: 15,
      yMargin: 15,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: Tandem.REQUIRED
    }, options );

    // combo box, to select a solution
    const solutionComboBox = new SolutionComboBox( solutions, solutionProperty, solutionListParent, {
      tandem: options.tandem.createTandem( 'solutionComboBox' )
    } );

    // {{value:{BeersLawSolution}, node:{ConcentrationControl}} - concentration controls, one for each solution
    const toggleNodeElements = solutions.map( solution => {
      return {
        value: solution,
        node: new ConcentrationControl( solution, {
          visible: false,
          tandem: options.tandem.createTandem( `${solution.internalName}ConcentrationControl` ),
          phetioDocumentation: `the concentration control for ${solution.internalName}`
        } )
      };
    } );

    // Makes the control visible for the selected solution
    const toggleNode = new ToggleNode( solutionProperty, toggleNodeElements );

    const contentNode = new VBox( {
      spacing: 15,
      align: 'left',
      children: [ solutionComboBox, toggleNode ]
    } );

    super( contentNode, options );

    this.addLinkedElement( solutionProperty, {
      tandem: options.tandem.createTandem( 'solutionProperty' )
    } );
  }
}

beersLawLab.register( 'SolutionPanel', SolutionPanel );
export default SolutionPanel;