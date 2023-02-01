// Copyright 2013-2023, University of Colorado Boulder

/**
 * Evaporation control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Text, TextOptions } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Evaporator from '../model/Evaporator.js';

type SelfOptions = EmptySelfOptions;

type EvaporationPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class EvaporationPanel extends Panel {

  public constructor( evaporator: Evaporator, providedOptions: EvaporationPanelOptions ) {

    const options = optionize<EvaporationPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      fill: '#F0F0F0',
      stroke: 'gray',
      xMargin: 15,
      yMargin: 8
    }, providedOptions );

    const labelTextTandem = options.tandem.createTandem( 'labelText' );

    const stringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.evaporationStringProperty ],
      ( pattern, evaporationString ) => StringUtils.format( pattern, evaporationString ), {
        tandem: labelTextTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
        phetioValueType: StringIO
      }
    );

    const labelText = new Text( stringProperty, {
      font: new PhetFont( 22 ),
      maxWidth: 130,
      tandem: labelTextTandem
    } );

    const sliderTandem = options.tandem.createTandem( 'slider' );

    const slider = new HSlider( evaporator.evaporationRateProperty, evaporator.evaporationRateProperty.range, {
      trackSize: new Dimension2( 150, 6 ),
      thumbSize: new Dimension2( 22, 45 ),
      enabledProperty: evaporator.enabledProperty,

      // at end of drag, snap evaporation rate back to zero
      endDrag: () => {
        evaporator.evaporationRateProperty.value = 0;
      },
      tandem: sliderTandem
    } );

    // Tick marks
    const tickOptions = {
      font: new PhetFont( 16 ),
      maxWidth: 50
    };
    slider.addMajorTick( 0, new Text( BeersLawLabStrings.noneStringProperty,
      combineOptions<TextOptions>( {
        tandem: sliderTandem.createTandem( 'minTickLabelText' )
      }, tickOptions ) ) );
    slider.addMajorTick( evaporator.maxEvaporationRate, new Text( BeersLawLabStrings.lotsStringProperty,
      combineOptions<TextOptions>( {
        tandem: sliderTandem.createTandem( 'maxTickLabelText' )
      }, tickOptions ) ) );

    const content = new HBox( {
      children: [ labelText, slider ],
      spacing: 10
    } );

    super( content, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'EvaporationPanel', EvaporationPanel );