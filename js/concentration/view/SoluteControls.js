// Copyright 2013-2020, University of Colorado Boulder

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import SoluteComboBox from './SoluteComboBox.js';
import SoluteFormRadioButtonGroup from './SoluteFormRadioButtonGroup.js';

class SoluteControls extends Panel {
  /**
   * @param {Solute[]} solutes
   * @param {Property.<Solute>} currentSoluteProperty
   * @param {EnumerationProperty.<SoluteForm>} soluteFormProperty
   * @param {Shaker} shaker
   * @param {Dropper} dropper
   * @param {Node} soluteListParent
   * @param {Object} [options]
   */
  constructor( solutes, currentSoluteProperty, soluteFormProperty, shaker, dropper, soluteListParent, options ) {

    options = merge( {
      xMargin: 15,
      yMargin: 15,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: Tandem.REQUIRED
    }, options );

    // solute combo box
    const soluteComboBox = new SoluteComboBox( solutes, currentSoluteProperty, soluteListParent, {
      tandem: options.tandem.createTandem( 'soluteComboBox' )
    } );

    // radio buttons for solid vs solution
    const soluteFormRadioButtonGroup = new SoluteFormRadioButtonGroup(
      soluteFormProperty, shaker.visibleProperty, dropper.visibleProperty, {
        tandem: options.tandem.createTandem( 'soluteFormRadioButtonGroup' )
      } );

    const contentNode = new Node();
    contentNode.addChild( soluteFormRadioButtonGroup );
    contentNode.addChild( soluteComboBox ); // add last, so that dropdown is on top

    // layout
    soluteFormRadioButtonGroup.left = soluteComboBox.left;
    soluteFormRadioButtonGroup.top = soluteComboBox.bottom + 15;

    super( contentNode, options );
  }
}

beersLawLab.register( 'SoluteControls', SoluteControls );
export default SoluteControls;