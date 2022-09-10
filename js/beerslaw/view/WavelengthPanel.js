// Copyright 2013-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * WavelengthPanel is the panel that contains controls related to wavelength of the light.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import WavelengthNumberControl from '../../../../scenery-phet/js/WavelengthNumberControl.js';
import { HBox, HStrut, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import Light from '../model/Light.js';
import LightMode from '../model/LightMode.js';

// constants
const RADIO_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 18 ), fill: 'black' };
const SLIDER_TRACK_SIZE = new Dimension2( 150, 30 );

class WavelengthPanel extends Panel {

  /**
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Light} light
   * @param {Object} [options]
   */
  constructor( solutionProperty, light, options ) {
    assert && assert( solutionProperty instanceof Property );
    assert && assert( light instanceof Light );

    options = merge( {
      xMargin: 20,
      yMargin: 15,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: Tandem.REQUIRED
    }, options );

    const labelNode = new Text( StringUtils.format( BeersLawLabStrings.pattern[ '0label' ], BeersLawLabStrings.wavelength ), {
      font: new PhetFont( 20 ),
      fill: 'black',
      tandem: options.tandem.createTandem( 'labelNode' )
    } );

    const numberDisplay = new NumberDisplay( light.wavelengthProperty, light.wavelengthProperty.range, {
      xMargin: 7,
      yMargin: 3,
      numberFormatter: wavelength => StringUtils.format( BeersLawLabStrings.pattern[ '0value' ][ '1units' ],
        Utils.toFixed( wavelength, 0 ), BeersLawLabStrings.units.nm ),
      tandem: options.tandem.createTandem( 'numberDisplay' )
    } );

    // radio button descriptions
    const radioButtonItems = [
      {
        value: LightMode.PRESET,
        node: new Text( BeersLawLabStrings.preset, RADIO_BUTTON_TEXT_OPTIONS ),
        tandemName: 'presetWavelengthRadioButton'
      },
      {
        value: LightMode.VARIABLE,
        node: new Text( BeersLawLabStrings.variable, RADIO_BUTTON_TEXT_OPTIONS ),
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
      layoutFunction: ( titleNode, numberDisplay, slider, decrementButton, incrementButton ) =>
        new HBox( {
          align: 'top',
          spacing: -10,
          resize: false, // prevent slider from causing a resize when thumb is at min or max
          children: [ decrementButton, slider, incrementButton ]
        } ),
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
          children: [ labelNode, numberDisplay ],
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
export default WavelengthPanel;