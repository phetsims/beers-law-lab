// Copyright 2013-2020, University of Colorado Boulder

/**
 * WavelengthPanel is the panel that contains controls related to wavelength of the light.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import WavelengthSlider from '../../../../scenery-phet/js/WavelengthSlider.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import Light from '../model/Light.js';

// constants
const RADIO_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 18 ), fill: 'black' };

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
      yMargin: 20,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: Tandem.REQUIRED
    }, options );

    const labelNode = new Text( StringUtils.format( beersLawLabStrings.pattern[ '0label' ], beersLawLabStrings.wavelength ), {
      font: new PhetFont( 20 ),
      fill: 'black',
      tandem: options.tandem.createTandem( 'labelNode' )
    } );

    const numberDisplay = new NumberDisplay( light.wavelengthProperty, light.wavelengthProperty.range, {
      xMargin: 7,
      yMargin: 3,
      numberFormatter: wavelength => StringUtils.format( beersLawLabStrings.pattern[ '0value' ][ '1units' ],
        Utils.toFixed( wavelength, 0 ), beersLawLabStrings.units.nm ),
      tandem: options.tandem.createTandem( 'numberDisplay' )
    } );

    // radio button descriptions
    const radioButtonItems = [
      {
        value: Light.Mode.PRESET,
        node: new Text( beersLawLabStrings.preset, RADIO_BUTTON_TEXT_OPTIONS ),
        tandemName: 'presetWavelengthRadioButton'
      },
      {
        value: Light.Mode.VARIABLE,
        node: new Text( beersLawLabStrings.variable, RADIO_BUTTON_TEXT_OPTIONS ),
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

    const wavelengthSlider = new WavelengthSlider( light.wavelengthProperty, {
      trackWidth: 150,
      trackHeight: 30,
      valueVisible: false,
      tweakersTouchAreaXDilation: 10,
      tweakersTouchAreaYDilation: 10,
      tandem: options.tandem.createTandem( 'wavelengthSlider' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } );

    // rendering order
    const vBox = new VBox( {
      spacing: 15,
      align: 'left',
      children: [
        new HBox( {
          spacing: 10,
          children: [ labelNode, numberDisplay ],
          maxWidth: 250
        } ),
        radioButtonGroup,
        wavelengthSlider
      ]
    } );

    // add a horizontal strut to prevent width changes
    const content = new Node( {
      children: [ new HStrut( vBox.width ), vBox ]
    } );

    super( content, options );

    // When the radio button selection changes...
    light.modeProperty.link( mode => {
      wavelengthSlider.interruptSubtreeInput();
      wavelengthSlider.visible = ( mode === Light.Mode.VARIABLE );
    } );
  }
}

beersLawLab.register( 'WavelengthPanel', WavelengthPanel );
export default WavelengthPanel;