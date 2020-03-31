// Copyright 2013-2020, University of Colorado Boulder

/**
 * Combo box for selecting solutions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import beersLawLab from '../../beersLawLab.js';

const pattern0LabelString = beersLawLabStrings.pattern[ '0label' ];
const solutionString = beersLawLabStrings.solution;

class SolutionComboBox extends ComboBox {

  /**
   * @param {BeersLawSolution[]} solutions
   * @param {Property.<BeersLawSolution>} selectedSolutionProperty
   * @param {Node} solutionListParent
   * @param {Tandem} tandem
   * @constructor
   */
  constructor( solutions, selectedSolutionProperty, solutionListParent, tandem ) {

    // 'Solution' label
    const label = new Text( StringUtils.format( pattern0LabelString, solutionString ), { font: new PhetFont( 20 ) } );

    // items
    const items = solutions.map( solution => createItem( solution, tandem ) );

    super( items, selectedSolutionProperty, solutionListParent, {
      labelNode: label,
      listPosition: 'above',
      xMargin: 12,
      yMargin: 12,
      highlightFill: 'rgb( 218, 255, 255 )',
      cornerRadius: 8,
      tandem: tandem
    } );
  }
}

/**
 * Creates a combo box item.
 * @private
 * @param {BeersLawSolution} solution
 * @param {Tandem} tandem
 * @returns {ComboBoxItem}
 */
function createItem( solution, tandem ) {

  const colorSquare = new Rectangle( 0, 0, 20, 20, {
    fill: solution.saturatedColor,
    stroke: solution.saturatedColor.darkerColor()
  } );

  const solutionName = new RichText( solution.getDisplayName(), {
    font: new PhetFont( 20 ),
    tandem: tandem.createTandem( solution.tandemName + 'Text' )
  } );

  const hBox = new HBox( {
    spacing: 5,
    children: [ colorSquare, solutionName ]
  } );

  return new ComboBoxItem( hBox, solution, {
    tandemName: solution.tandemName
  } );
}

beersLawLab.register( 'SolutionComboBox', SolutionComboBox );
export default SolutionComboBox;