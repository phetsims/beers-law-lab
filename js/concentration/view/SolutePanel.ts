// Copyright 2013-2025, University of Colorado Boulder

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import beersLawLab from '../../beersLawLab.js';
import BLLColors from '../../common/BLLColors.js';
import Solute from '../../common/model/Solute.js';
import SoluteForm from '../model/SoluteForm.js';
import SoluteControl from './SoluteControl.js';
import SoluteFormRadioButtonGroup from './SoluteFormRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;

type SolutePanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class SolutePanel extends Panel {

  public constructor( solutes: Solute[],
                      currentSoluteProperty: Property<Solute>,
                      soluteFormProperty: EnumerationProperty<SoluteForm>,
                      soluteListParent: Node,
                      providedOptions: SolutePanelOptions ) {

    const options = optionize<SolutePanelOptions, SelfOptions, PanelOptions>()( {
      xMargin: 15,
      yMargin: 15,
      fill: BLLColors.panelFillProperty,
      stroke: 'gray',
      lineWidth: 1,
      maxWidth: 480,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    // solute combo box
    const soluteComboBox = new SoluteControl( currentSoluteProperty, solutes, soluteListParent, {
      comboBoxOptions: {
        tandem: options.tandem.createTandem( 'soluteComboBox' )
      }
    } );

    // radio buttons for solid vs solution
    const soluteFormRadioButtonGroup = new SoluteFormRadioButtonGroup( soluteFormProperty, {
      tandem: options.tandem.createTandem( 'soluteFormRadioButtonGroup' )
    } );

    const contentNode = new VBox( {
      isDisposable: false,
      align: 'left',
      spacing: 15,
      children: [ soluteComboBox, soluteFormRadioButtonGroup ]
    } );

    super( contentNode, options );
  }
}

beersLawLab.register( 'SolutePanel', SolutePanel );