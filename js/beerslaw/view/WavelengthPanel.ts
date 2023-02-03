// Copyright 2013-2023, University of Colorado Boulder

/**
 * WavelengthPanel is the panel that contains controls related to wavelength of the light.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
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
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
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

    const labelTextTandem = options.tandem.createTandem( 'labelText' );

    const stringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.wavelengthStringProperty ],
      ( pattern, wavelengthString ) => StringUtils.format( pattern, wavelengthString ), {
        tandem: labelTextTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
        phetioValueType: StringIO
      } );

    const labelText = new Text( stringProperty, {
      font: new PhetFont( 20 ),
      fill: 'black',
      tandem: labelTextTandem
    } );

    const numberDisplay = new NumberDisplay( light.wavelengthProperty, light.wavelengthProperty.range, {
      xMargin: 7,
      yMargin: 3,
      tandem: options.tandem.createTandem( 'numberDisplay' )
    } );

    // Whenever one of the strings used to format the NumberDisplay changes, call setNumberFormatter with a
    // new formatting function.
    Multilink.multilink(
      [ BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ], BeersLawLabStrings.units.nmStringProperty ],
      ( pattern, nmString ) => numberDisplay.setNumberFormatter( wavelength => StringUtils.format( pattern, Utils.toFixed( wavelength, 0 ), nmString ) )
    );

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
        radius: BLLConstants.RADIO_BUTTON_RADIUS
      },
      orientation: 'horizontal',
      spacing: 15,
      touchAreaYDilation: 8,
      maxWidth: 250,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    const wavelengthNumberControlTandem = options.tandem.createTandem( 'wavelengthNumberControl' );
    const wavelengthNumberControl = new WavelengthNumberControl( light.wavelengthProperty, {
      titleNodeOptions: {
        tandem: Tandem.OPT_OUT // because our title is not part of WavelengthNumberControl
      },
      visibleProperty: new DerivedProperty( [ light.modeProperty ], mode => ( mode === LightMode.VARIABLE ), {
        tandem: wavelengthNumberControlTandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
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
      tandem: wavelengthNumberControlTandem
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

    this.addLinkedElement( light.wavelengthProperty, {
      tandem: options.tandem.createTandem( light.wavelengthProperty.tandem.name )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'WavelengthPanel', WavelengthPanel );