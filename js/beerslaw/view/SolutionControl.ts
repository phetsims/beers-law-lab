// Copyright 2013-2023, University of Colorado Boulder

/**
 * SolutionComboBox is the combo box for selecting a solution in the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, HBoxOptions, Node, Rectangle, RichText, Text } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BeersLawSolution from '../model/BeersLawSolution.js';
import Tandem from '../../../../tandem/js/Tandem.js';

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
      spacing: 10,

      comboBoxOptions: {
        tandem: Tandem.REQUIRED,
        listPosition: 'above',
        xMargin: 12,
        yMargin: 12,
        highlightFill: 'rgb( 218, 255, 255 )',
        cornerRadius: 8
      }
    }, providedOptions );

    const labelTextTandem = options.comboBoxOptions.tandem.createTandem( 'labelText' );

    const stringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.solutionStringProperty ],
      ( pattern: string, solutionString: string ) => StringUtils.format( pattern, solutionString ), {
        tandem: labelTextTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
        phetioValueType: StringIO
      } );

    // items
    const items = solutions.map( createItem );

    options.children = [
      new Text( stringProperty, {
        font: new PhetFont( 20 ),
        maxWidth: 85,
        tandem: labelTextTandem
      } ),
      new ComboBox<BeersLawSolution>( solutionProperty, items, solutionListParent, options.comboBoxOptions )
    ];

    super( options );
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
    tandemName: `${solution.tandemName}${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  };
}

beersLawLab.register( 'SolutionControl', SolutionControl );