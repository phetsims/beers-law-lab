// Copyright 2013-2025, University of Colorado Boulder

/**
 * SolutionComboBox is the combo box for selecting a solution in the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BeersLawSolution from '../model/BeersLawSolution.js';
import BLLColors from '../../common/BLLColors.js';

type SelfOptions = {
  comboBoxOptions?: WithRequired<ComboBoxOptions, 'tandem'>;
};

type SolutionComboBoxOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class SolutionControl extends HBox {

  public constructor( solutionProperty: Property<BeersLawSolution>,
                      solutions: BeersLawSolution[],
                      solutionListParent: Node,
                      providedOptions: SolutionComboBoxOptions ) {

    const options = optionize<SolutionComboBoxOptions, SelfOptions, HBoxOptions>()( {
      isDisposable: false,
      spacing: 10,
      comboBoxOptions: {
        tandem: Tandem.REQUIRED,
        listPosition: 'above',
        xMargin: 12,
        yMargin: 12,
        highlightFill: BLLColors.comboBoxHighlightColorProperty,
        cornerRadius: 8,
        accessibleName: BeersLawLabStrings.solutionStringProperty
      }
    }, providedOptions );

    const labelStringProperty = new DerivedStringProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.solutionStringProperty ],
      ( pattern: string, solutionString: string ) => StringUtils.format( pattern, solutionString ), {
        tandem: options.comboBoxOptions.tandem.createTandem( 'labelStringProperty' )
      } );

    // items
    const items = solutions.map( createItem );

    const comboBox = new ComboBox<BeersLawSolution>( solutionProperty, items, solutionListParent, options.comboBoxOptions );

    const labelText = new Text( labelStringProperty, {
      font: new PhetFont( 20 ),
      maxWidth: 100,
      visibleProperty: comboBox.visibleProperty
    } );

    options.children = [
      labelText,
      comboBox
    ];

    super( options );
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

  const labelStringProperty = new DerivedStringProperty(
    [ BeersLawLabStrings.pattern[ '0formula' ][ '1nameStringProperty' ], solution.nameProperty, solution.formulaProperty ],
    ( pattern, name, formula ) => {
      if ( formula === null || formula === '' ) {
        return name; // if there is no formula, default to the solution name
      }
      else {
        // See https://github.com/phetsims/beers-law-lab/issues/326 for StringUtils.wrapLTR
        return StringUtils.format( pattern, StringUtils.wrapLTR( formula ), name );
      }
    }
  );

  const labelText = new RichText( labelStringProperty, {
    maxWidth: 305, // determined empirically, so that English strings are not scaled down
    font: new PhetFont( 20 )
    // No PhET-iO instrumentation is desired.
  } );

  const hBox = new HBox( {
    spacing: 5,
    children: [ colorSquare, labelText ]
  } );

  return {
    value: solution,
    createNode: () => hBox,
    accessibleName: solution.nameProperty,
    tandemName: `${solution.tandemName}Item`
  };
}

beersLawLab.register( 'SolutionControl', SolutionControl );