// Copyright 2013-2021, University of Colorado Boulder

/**
 * Combo box for selecting solutions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import BeersLawSolution from '../model/BeersLawSolution.js';

class SolutionComboBox extends ComboBox {

  /**
   * @param {BeersLawSolution[]} solutions
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Node} solutionListParent
   * @param {Object} [options]
   */
  constructor( solutions, solutionProperty, solutionListParent, options ) {
    assert && assert( Array.isArray( solutions ) );
    assert && assert( _.every( solutions, solution => solution instanceof BeersLawSolution ) );
    assert && assert( solutionProperty instanceof Property );
    assert && assert( solutionListParent instanceof Node );

    options = merge( {
      listPosition: 'above',
      xMargin: 12,
      yMargin: 12,
      highlightFill: 'rgb( 218, 255, 255 )',
      cornerRadius: 8,
      tandem: Tandem.REQUIRED
    }, options );

    // 'Solution' label
    assert && assert( !options.labelNode, 'SolutionComboBox sets labelNode' );
    options.labelNode = new Text( StringUtils.format( beersLawLabStrings.pattern[ '0label' ], beersLawLabStrings.solution ), {
      font: new PhetFont( 20 ),
      maxWidth: 85,
      tandem: options.tandem.createTandem( 'labelNode' )
    } );

    // items
    const items = solutions.map( createItem );

    super( items, solutionProperty, solutionListParent, options );
  }
}

/**
 * Creates a combo box item.
 * @private
 * @param {BeersLawSolution} solution
 * @returns {ComboBoxItem}
 */
function createItem( solution ) {
  assert && assert( solution instanceof BeersLawSolution );

  const colorSquare = new Rectangle( 0, 0, 20, 20, {
    fill: solution.saturatedColor,
    stroke: solution.saturatedColor.darkerColor()
  } );

  const labelNode = new RichText( solution.labelProperty.value, {
    textProperty: solution.labelProperty,
    maxWidth: 305, // determined empirically, so that English strings are not scaled down
    font: new PhetFont( 20 )
  } );

  const hBox = new HBox( {
    spacing: 5,
    children: [ colorSquare, labelNode ]
  } );

  return new ComboBoxItem( hBox, solution, {
    tandemName: `${solution.tandemName}Item` // Item suffix is required by ComboBoxItem
  } );
}

beersLawLab.register( 'SolutionComboBox', SolutionComboBox );
export default SolutionComboBox;