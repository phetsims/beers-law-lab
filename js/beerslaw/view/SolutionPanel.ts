// Copyright 2013-2022, University of Colorado Boulder

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeTranslationOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from '../model/BeersLawSolution.js';
import ConcentrationControl from './ConcentrationControl.js';
import SolutionComboBox from './SolutionComboBox.js';

type SelfOptions = EmptySelfOptions;

type SolutionPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class SolutionPanel extends Panel {

  public constructor( solutions: BeersLawSolution[],
                      solutionProperty: Property<BeersLawSolution>,
                      concentrationProperty: ReadOnlyProperty<number>,
                      solutionListParent: Node,
                      providedOptions: SolutionPanelOptions ) {

    const options = optionize<SolutionPanelOptions, SelfOptions, PanelOptions>()( {
      xMargin: 15,
      yMargin: 15,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      maxWidth: 575 // determined empirically
    }, providedOptions );

    const solutionComboBox = new SolutionComboBox( solutionProperty, solutions, solutionListParent, {
      tandem: options.tandem.createTandem( 'solutionComboBox' )
    } );

    const concentrationControl = new ConcentrationControl( solutions, solutionProperty, concentrationProperty, {
      tandem: options.tandem.createTandem( 'concentrationControl' )
    } );

    const contentNode = new VBox( {
      spacing: 15,
      align: 'left',
      children: [ solutionComboBox, concentrationControl ]
    } );

    super( contentNode, options );

    this.addLinkedElement( solutionProperty, {
      tandem: options.tandem.createTandem( 'solutionProperty' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'SolutionPanel', SolutionPanel );