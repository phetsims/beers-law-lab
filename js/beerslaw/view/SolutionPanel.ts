// Copyright 2013-2022, University of Colorado Boulder

/**
 * Control panel for solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeTranslationOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from '../model/BeersLawSolution.js';
import ConcentrationControl from './ConcentrationControl.js';
import SolutionComboBox from './SolutionComboBox.js';

type SelfOptions = EmptySelfOptions;

type SolutionPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class SolutionPanel extends Panel {

  // The concentration displayed in the panel. For PHET-iO only.
  private readonly concentrationProperty: TReadOnlyProperty<number>;

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

    // Concentration control. This is actually 1 control for each solution, with mutually-exclusive visibility.
    const concentrationControlTandem = options.tandem.createTandem( 'concentrationControl' );
    const concentrationControl = new Node( {
      children: solutions.map( solution => new ConcentrationControl( solution, {
        visibleProperty: new DerivedProperty( [ solutionProperty ], solutionValue => ( solutionValue === solution ) )
      } ) ),
      tandem: concentrationControlTandem
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

    const concentrationProperties = solutions.map( solution => solution.concentrationProperty );
    this.concentrationProperty = DerivedProperty.deriveAny( [ solutionProperty, ...concentrationProperties ],
      () => solutionProperty.value.concentrationProperty.value, {
        units: 'mol/L',
        tandem: concentrationControlTandem.createTandem( 'concentrationProperty' ),
        phetioDocumentation: 'the concentration value currently displayed by this control',
        phetioValueType: NumberIO,
        phetioLinkDependencies: false
      } );
  }
}

beersLawLab.register( 'SolutionPanel', SolutionPanel );