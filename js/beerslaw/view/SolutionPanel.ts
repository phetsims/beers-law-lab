// Copyright 2013-2022, University of Colorado Boulder

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeTranslationOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from '../model/BeersLawSolution.js';
import ConcentrationControl from './ConcentrationControl.js';
import SolutionComboBox from './SolutionComboBox.js';

type SelfOptions = EmptySelfOptions;

type SolutionPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class SolutionPanel extends Panel {

  public constructor( solutions: BeersLawSolution[], solutionProperty: Property<BeersLawSolution>,
                      solutionListParent: Node, providedOptions: SolutionPanelOptions ) {

    const options = optionize<SolutionPanelOptions, SelfOptions, PanelOptions>()( {
      xMargin: 15,
      yMargin: 15,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      maxWidth: 575 // determined empirically
    }, providedOptions );

    // combo box, to select a solution
    const solutionComboBox = new SolutionComboBox( solutionProperty, solutions, solutionListParent, {
      tandem: options.tandem.createTandem( 'solutionComboBox' )
    } );

    // Concentration controls, one for each solution
    const concentrationControls = new ConcentrationControls( solutions, solutionProperty,
      options.tandem.createTandem( 'concentrationControls' ) );

    const contentNode = new VBox( {
      spacing: 15,
      align: 'left',
      children: [ solutionComboBox, concentrationControls ]
    } );

    super( contentNode, options );

    this.addLinkedElement( solutionProperty, {
      tandem: options.tandem.createTandem( 'solutionProperty' )
    } );
  }
}

class ConcentrationControls extends Node {

  public constructor( solutions: BeersLawSolution[], solutionProperty: Property<BeersLawSolution>, tandem: Tandem ) {

    // a ConcentrationControl for each solution
    const toggleNodeElements = solutions.map( solution => {
      return {
        value: solution,
        node: new ConcentrationControl( solution, {
          visible: false,
          tandem: tandem.createTandem( `${solution.tandemName}ConcentrationControl` ),
          phetioDocumentation: `the concentration control for ${solution.tandemName}`
        } )
      };
    } );

    // makes the ConcentrationControl visible for the selected solution
    const toggleNode = new ToggleNode( solutionProperty, toggleNodeElements );

    super( {
      children: [ toggleNode ],
      tandem: tandem
    } );
  }
}

beersLawLab.register( 'SolutionPanel', SolutionPanel );