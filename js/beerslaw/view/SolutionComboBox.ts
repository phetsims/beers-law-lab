// Copyright 2013-2022, University of Colorado Boulder

/**
 * SolutionComboBox is the combo box for selecting a solution in the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Rectangle, RichText, Text } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BeersLawSolution from '../model/BeersLawSolution.js';

type SelfOptions = EmptySelfOptions;

type SolutionComboBoxOptions = SelfOptions & PickRequired<ComboBoxOptions, 'tandem'>;

export default class SolutionComboBox extends ComboBox<BeersLawSolution> {

  public constructor( solutionProperty: Property<BeersLawSolution>,
                      solutions: BeersLawSolution[],
                      solutionListParent: Node,
                      providedOptions: SolutionComboBoxOptions ) {

    const options = optionize<SolutionComboBoxOptions, SelfOptions, ComboBoxOptions>()( {

      // ComboBoxOptions
      listPosition: 'above',
      xMargin: 12,
      yMargin: 12,
      highlightFill: 'rgb( 218, 255, 255 )',
      cornerRadius: 8
    }, providedOptions );

    const labelStringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.solutionStringProperty ],
      ( pattern: string, solutionString: string ) => StringUtils.format( pattern, solutionString )
    );

    // 'Solution' label
    options.labelNode = new Text( labelStringProperty, {
      font: new PhetFont( 20 ),
      maxWidth: 85,
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    // items
    const items = solutions.map( createItem );

    super( solutionProperty, items, solutionListParent, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Creates a combo box item.
 */
function createItem( solution: BeersLawSolution ): ComboBoxItem<BeersLawSolution> {

  const colorSquare = new Rectangle( 0, 0, 20, 20, {
    fill: solution.saturatedColor,
    stroke: solution.saturatedColor.darkerColor()
  } );

  const labelStringProperty = new DerivedProperty(
    [ BeersLawLabStrings.pattern[ '0formula' ][ '1nameStringProperty' ], solution.nameProperty, solution.formulaProperty ],
    ( pattern, name, formula ) => ( formula === null || formula === '' ) ? name : StringUtils.format( pattern, formula, name )
  );

  const labelText = new RichText( labelStringProperty, {
    maxWidth: 305, // determined empirically, so that English strings are not scaled down
    font: new PhetFont( 20 )
  } );

  const hBox = new HBox( {
    spacing: 5,
    children: [ colorSquare, labelText ]
  } );

  return {
    value: solution,
    node: hBox,
    tandemName: `${solution.tandemName}${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  };
}

beersLawLab.register( 'SolutionComboBox', SolutionComboBox );