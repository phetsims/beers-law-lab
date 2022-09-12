// Copyright 2013-2022, University of Colorado Boulder

/**
 * Evaporation control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Evaporator from '../model/Evaporator.js';

type SelfOptions = EmptySelfOptions;

type EvaporationPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class EvaporationPanel extends Panel {

  public constructor( evaporator: Evaporator, providedOptions: EvaporationPanelOptions ) {

    const options = optionize<EvaporationPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      xMargin: 15,
      yMargin: 8,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      maxWidth: 410
    }, providedOptions );

    const labelStringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.evaporationStringProperty ],
      ( pattern: string, evaporationString: string ) => StringUtils.format( pattern, evaporationString )
    );

    const labelText = new Text( labelStringProperty, {
      font: new PhetFont( 22 ),
      maxWidth: 130,
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    const slider = new HSlider( evaporator.evaporationRateProperty, new Range( 0, evaporator.maxEvaporationRate ), {
      trackSize: new Dimension2( 150, 6 ),
      thumbSize: new Dimension2( 22, 45 ),
      enabledProperty: evaporator.enabledProperty,

      // at end of drag, snap evaporation rate back to zero
      endDrag: () => {
        evaporator.evaporationRateProperty.value = 0;
      },
      tandem: options.tandem.createTandem( 'slider' )
    } );

    // Tick marks
    const tickOptions = {
      font: new PhetFont( 16 ),
      maxWidth: 80
    };
    slider.addMajorTick( 0, new Text( BeersLawLabStrings.noneStringProperty, tickOptions ) );
    slider.addMajorTick( evaporator.maxEvaporationRate, new Text( BeersLawLabStrings.lotsStringProperty, tickOptions ) );

    const content = new HBox( {
      spacing: 10,
      children: [ labelText, slider ]
    } );

    super( content, options );
  }
}

beersLawLab.register( 'EvaporationPanel', EvaporationPanel );