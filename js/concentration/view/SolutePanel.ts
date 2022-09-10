// Copyright 2013-2022, University of Colorado Boulder

/**
 * Control panel for selecting the solute and changing its form (solid or solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { Node } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import Dropper from '../model/Dropper.js';
import Shaker from '../model/Shaker.js';
import SoluteComboBox from './SoluteComboBox.js';
import SoluteFormRadioButtonGroup from './SoluteFormRadioButtonGroup.js';
import SoluteForm from '../model/SoluteForm.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type SolutePanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class SolutePanel extends Panel {

  public constructor( solutes: Solute[], currentSoluteProperty: Property<Solute>,
                      soluteFormProperty: EnumerationProperty<SoluteForm>, shaker: Shaker, dropper: Dropper,
                      soluteListParent: Node, providedOptions: SolutePanelOptions ) {

    const options = optionize<SolutePanelOptions, SelfOptions, PanelOptions>()( {
      xMargin: 15,
      yMargin: 15,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      maxWidth: 480
    }, providedOptions );

    // solute combo box
    const soluteComboBox = new SoluteComboBox( currentSoluteProperty, solutes, soluteListParent, {
      tandem: options.tandem.createTandem( 'soluteComboBox' )
    } );

    // radio buttons for solid vs solution
    const soluteFormRadioButtonGroup = new SoluteFormRadioButtonGroup(
      soluteFormProperty, shaker.visibleProperty, dropper.visibleProperty, {
        tandem: options.tandem.createTandem( 'soluteFormRadioButtonGroup' )
      } );

    //TODO https://github.com/phetsims/beers-law-lab/issues/290 use VBox here when ComboBox layout has been fixed
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