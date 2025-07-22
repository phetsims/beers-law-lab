// Copyright 2013-2025, University of Colorado Boulder

/**
 * WavelengthPanel is the panel that contains controls related to wavelength of the light.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import WavelengthNumberControl from '../../../../scenery-phet/js/WavelengthNumberControl.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node, { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLColors from '../../common/BLLColors.js';
import Light from '../model/Light.js';
import LightMode from '../model/LightMode.js';
import LightModeRadioButtonGroup from './LightModeRadioButtonGroup.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import BLLConstants from '../../common/BLLConstants.js';

const SLIDER_TRACK_SIZE = new Dimension2( 150, 30 );
const PATTERN_STRING_PROPERTY = BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ];
const UNITS_STRING_PROPERTY = BeersLawLabStrings.units.nmStringProperty;

type SelfOptions = EmptySelfOptions;

type WavelengthPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class WavelengthPanel extends Panel {

  public constructor( light: Light, providedOptions: WavelengthPanelOptions ) {

    const options = optionize<WavelengthPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      isDisposable: false,
      xMargin: 20,
      yMargin: 15,
      fill: BLLColors.panelFillProperty,
      stroke: 'gray',
      lineWidth: 1,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    const labelStringProperty = new DerivedStringProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.wavelengthStringProperty ],
      ( pattern, wavelengthString ) => StringUtils.format( pattern, wavelengthString ), {
        tandem: options.tandem.createTandem( 'labelStringProperty' )
      } );

    const numberDisplay = new NumberDisplay( light.wavelengthProperty, light.wavelengthProperty.range, {
      numberFormatter: wavelength =>
        StringUtils.format( PATTERN_STRING_PROPERTY.value, toFixed( wavelength, BLLConstants.WAVELENGTH_DECIMAL_PLACES ), UNITS_STRING_PROPERTY.value ),
      numberFormatterDependencies: [ PATTERN_STRING_PROPERTY, UNITS_STRING_PROPERTY ],
      xMargin: 7,
      yMargin: 3,
      textOptions: {
        maxWidth: 90
      },
      tandem: options.tandem.createTandem( 'numberDisplay' )
    } );

    const labelText = new Text( labelStringProperty, {
      font: new PhetFont( 20 ),
      fill: 'black',
      maxWidth: 150,
      visibleProperty: numberDisplay.visibleProperty
    } );

    // radio button group
    const radioButtonGroup = new LightModeRadioButtonGroup( light.modeProperty, options.tandem.createTandem( 'radioButtonGroup' ) );

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
      accessibleName: BeersLawLabStrings.wavelengthStringProperty,
      tandem: wavelengthNumberControlTandem
    } );

    // rendering order
    const vBox = new VBox( {
      spacing: 24,
      align: 'left',
      children: [
        new HBox( {
          spacing: 10,
          children: [ labelText, numberDisplay ]
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

    this.addLinkedElement( light.wavelengthProperty );
  }
}

beersLawLab.register( 'WavelengthPanel', WavelengthPanel );