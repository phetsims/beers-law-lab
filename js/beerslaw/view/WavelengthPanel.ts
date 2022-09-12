// Copyright 2013-2022, University of Colorado Boulder

/**
 * WavelengthPanel is the panel that contains controls related to wavelength of the light.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import WavelengthNumberControl from '../../../../scenery-phet/js/WavelengthNumberControl.js';
import { HBox, HStrut, Node, NodeTranslationOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import BeersLawSolution from '../model/BeersLawSolution.js';
import Light from '../model/Light.js';
import LightMode from '../model/LightMode.js';

// constants
const SLIDER_TRACK_SIZE = new Dimension2( 150, 30 );

type SelfOptions = EmptySelfOptions;

type WavelengthPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class WavelengthPanel extends Panel {

  public constructor( solutionProperty: Property<BeersLawSolution>, light: Light, providedOptions: WavelengthPanelOptions ) {

    const options = optionize<WavelengthPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      xMargin: 20,
      yMargin: 15,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1
    }, providedOptions );

    const labelStringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.wavelengthStringProperty ],
      ( pattern: string, wavelengthString: string ) => StringUtils.format( pattern, wavelengthString )
    );

    const labelText = new Text( labelStringProperty, {
      font: new PhetFont( 20 ),
      fill: 'black',
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    assert && assert( light.wavelengthProperty.range );
    const numberDisplay = new NumberDisplay( light.wavelengthProperty, light.wavelengthProperty.range!, {
      xMargin: 7,
      yMargin: 3,

      //TODO https://github.com/phetsims/beers-law-lab/issues/288 support for dynamic locale
      numberFormatter: wavelength => StringUtils.format( BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ].value,
        Utils.toFixed( wavelength, 0 ), BeersLawLabStrings.units.nmStringProperty ),
      tandem: options.tandem.createTandem( 'numberDisplay' )
    } );

    function createRadioButtonLabel( text: TReadOnlyProperty<string>, radioButtonTandem: Tandem ): Node {
      return new Text( text, {
        font: new PhetFont( 18 ),
        fill: 'black',
        tandem: radioButtonTandem.createTandem( 'labelText' )
      } );
    }

    // radio button descriptions
    const radioButtonItems: AquaRadioButtonGroupItem<LightMode>[] = [
      {
        value: LightMode.PRESET,
        createNode: tandem => createRadioButtonLabel( BeersLawLabStrings.presetStringProperty, tandem ),
        tandemName: 'presetWavelengthRadioButton'
      },
      {
        value: LightMode.VARIABLE,
        createNode: tandem => createRadioButtonLabel( BeersLawLabStrings.variableStringProperty, tandem ),
        tandemName: 'variableWavelengthRadioButton'
      }
    ];

    // radio button group
    const radioButtonGroup = new AquaRadioButtonGroup( light.modeProperty, radioButtonItems, {
      radioButtonOptions: {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        visiblePropertyOptions: { phetioReadOnly: true }
      },
      orientation: 'horizontal',
      spacing: 15,
      touchAreaYDilation: 8,
      maxWidth: 250,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    const wavelengthNumberControl = new WavelengthNumberControl( light.wavelengthProperty, {
      spectrumSliderTrackOptions: {
        size: SLIDER_TRACK_SIZE
      },
      spectrumSliderThumbOptions: {
        width: 35,
        height: 45,
        cursorHeight: SLIDER_TRACK_SIZE.height
      },
      arrowButtonOptions: {
        scale: 1,
        touchAreaXDilation: 5,
        touchAreaYDilation: 10
      },
      layoutFunction: ( titleNode, numberDisplay, slider, decrementButton, incrementButton ) => {
        assert && assert( decrementButton && incrementButton );
        return new HBox( {
          align: 'top',
          spacing: -10,
          resize: false, // prevent slider from causing a resize when thumb is at min or max
          children: [ decrementButton!, slider, incrementButton! ]
        } );
      },
      tandem: options.tandem.createTandem( 'wavelengthNumberControl' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } );

    // rendering order
    const vBox = new VBox( {
      spacing: 24,
      align: 'left',
      children: [
        new HBox( {
          spacing: 10,
          children: [ labelText, numberDisplay ],
          maxWidth: 250
        } ),
        radioButtonGroup,
        wavelengthNumberControl
      ]
    } );

    // add a horizontal strut to prevent width changes
    const content = new Node( {
      children: [ new HStrut( vBox.width ), vBox ]
    } );

    super( content, options );

    // When the radio button selection changes...
    light.modeProperty.link( mode => {
      wavelengthNumberControl.interruptSubtreeInput();
      wavelengthNumberControl.visible = ( mode === LightMode.VARIABLE );
    } );
  }
}

beersLawLab.register( 'WavelengthPanel', WavelengthPanel );