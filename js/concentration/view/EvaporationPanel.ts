// Copyright 2013-2025, University of Colorado Boulder

/**
 * Evaporation control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLColors from '../../common/BLLColors.js';
import Evaporator from '../model/Evaporator.js';
import EvaporationSlider from './EvaporationSlider.js';

type SelfOptions = EmptySelfOptions;

type EvaporationPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class EvaporationPanel extends Panel {

  public constructor( evaporator: Evaporator, providedOptions: EvaporationPanelOptions ) {

    const options = optionize<EvaporationPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      isDisposable: false,
      fill: BLLColors.panelFillProperty,
      stroke: 'gray',
      xMargin: 15,
      yMargin: 8,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    const labelStringProperty = new DerivedStringProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.evaporationStringProperty ],
      ( pattern, evaporationString ) => StringUtils.format( pattern, evaporationString ), {
        tandem: options.tandem.createTandem( 'labelStringProperty' )
      }
    );

    const labelText = new Text( labelStringProperty, {
      font: new PhetFont( 22 ),
      maxWidth: 130
    } );

    const slider = new EvaporationSlider( evaporator, options.tandem.createTandem( 'slider' ) );

    const content = new HBox( {
      children: [ labelText, slider ],
      spacing: 10
    } );

    super( content, options );
  }
}

beersLawLab.register( 'EvaporationPanel', EvaporationPanel );