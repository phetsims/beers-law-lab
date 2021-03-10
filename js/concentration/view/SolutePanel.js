// Copyright 2013-2020, University of Colorado Boulder

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import Dropper from '../model/Dropper.js';
import Shaker from '../model/Shaker.js';
import Solute from '../model/Solute.js';
import SoluteComboBox from './SoluteComboBox.js';
import SoluteFormRadioButtonGroup from './SoluteFormRadioButtonGroup.js';

class SolutePanel extends Panel {
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
    assert && assert( Array.isArray( solutes ) );
    assert && assert( _.every( solutes, solute => solute instanceof Solute ) );
    assert && assert( currentSoluteProperty instanceof Property );
    assert && assert( soluteFormProperty instanceof Property );
    assert && assert( shaker instanceof Shaker );
    assert && assert( dropper instanceof Dropper );
    assert && assert( soluteListParent instanceof Node );

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

beersLawLab.register( 'SolutePanel', SolutePanel );
export default SolutePanel;