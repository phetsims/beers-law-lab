// Copyright 2013-2023, University of Colorado Boulder

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
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from '../model/BeersLawSolution.js';
import ConcentrationControl from './ConcentrationControl.js';
import SolutionControl from './SolutionControl.js';
import SolutionInCuvette from '../model/SolutionInCuvette.js';
import BLLColors from '../../common/BLLColors.js';

type SelfOptions = EmptySelfOptions;

type SolutionPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class SolutionPanel extends Panel {

  public constructor( solutions: BeersLawSolution[],
                      solutionProperty: Property<BeersLawSolution>,
                      solutionInCuvette: SolutionInCuvette,
                      solutionListParent: Node,
                      providedOptions: SolutionPanelOptions ) {

    const options = optionize<SolutionPanelOptions, SelfOptions, PanelOptions>()( {
      isDisposable: false,
      xMargin: 15,
      yMargin: 15,
      fill: BLLColors.panelFillProperty,
      stroke: 'gray',
      lineWidth: 1,
      maxWidth: 575, // determined empirically
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    const solutionComboBox = new SolutionControl( solutionProperty, solutions, solutionListParent, {
      comboBoxOptions: {
        tandem: options.tandem.createTandem( 'solutionComboBox' )
      }
    } );

    const concentrationControl = new ConcentrationControl( solutions, solutionProperty, solutionInCuvette.concentrationProperty, {
      tandem: options.tandem.createTandem( 'concentrationControl' )
    } );

    const contentNode = new VBox( {
      spacing: 15,
      align: 'left',
      children: [ solutionComboBox, concentrationControl ]
    } );

    super( contentNode, options );

    this.addLinkedElement( solutionInCuvette, {
      tandemName: 'solutionInCuvette'
    } );
  }
}

beersLawLab.register( 'SolutionPanel', SolutionPanel );