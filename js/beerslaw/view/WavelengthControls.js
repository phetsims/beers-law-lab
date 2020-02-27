// Copyright 2013-2019, University of Colorado Boulder

/**
 * Control for wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButtonGroup = require( 'SUN/AquaRadioButtonGroup' );
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  // strings
  const pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );
  const pattern0Value1UnitsString = require( 'string!BEERS_LAW_LAB/pattern.0value.1units' );
  const presetString = require( 'string!BEERS_LAW_LAB/preset' );
  const unitsNmString = require( 'string!BEERS_LAW_LAB/units.nm' );
  const variableString = require( 'string!BEERS_LAW_LAB/variable' );
  const wavelengthString = require( 'string!BEERS_LAW_LAB/wavelength' );
  
  // constants
  const RADIO_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 18 ), fill: 'black' };

  class WavelengthControls extends Panel {

    /**
     * @param {Property.<BeersLawSolution>} solutionProperty
     * @param {Light} light
     * @param {Tandem} tandem
     */
    constructor( solutionProperty, light, tandem ) {

      // is the wavelength variable or fixed?
      const variableWavelengthProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'variableWavelengthProperty' )
      } );

      const xMargin = 7;
      const yMargin = 3;

      const label = new Text( StringUtils.format( pattern0LabelString, wavelengthString ), {
        font: new PhetFont( 20 ),
        fill: 'black',
        tandem: tandem.createTandem( 'label' )
      } );

      const valueDisplay = new Text( formatWavelength( light.wavelengthProperty.get() ), {
        font: new PhetFont( 20 ),
        fill: 'black',
        y: label.y, // align baselines
        tandem: tandem.createTandem( 'valueDisplay' )
      } );

      const valueBackground = new Rectangle( 0, 0, valueDisplay.width + xMargin + xMargin, valueDisplay.height + yMargin + yMargin, {
        fill: 'white',
        stroke: 'lightGray',
        left: label.right + 10,
        centerY: valueDisplay.centerY
      } );
      valueDisplay.right = valueBackground.right - xMargin; // right aligned

      const valueParent = new Node( {
        children: [ label, valueBackground, valueDisplay ],
        maxWidth: 250 // constrain width for i18n
      } );

      // radio button descriptions
      const radioButtonItems = [
        {
          value: false,
          node: new Text( presetString, RADIO_BUTTON_TEXT_OPTIONS ),
          tandemName: 'presetWavelengthRadioButton'
        },
        {
          value: true,
          node: new Text( variableString, RADIO_BUTTON_TEXT_OPTIONS ),
          tandemName: 'variableWavelengthRadioButton'
        }
      ];

      // radio button group
      const radioButtonGroup = new AquaRadioButtonGroup( variableWavelengthProperty, radioButtonItems, {
        radioButtonOptions: { radius: BLLConstants.RADIO_BUTTON_RADIUS },
        orientation: 'horizontal',
        spacing: 15,
        touchAreaYDilation: 8,
        maxWidth: 250, // constrain width for i18n
        tandem: tandem.createTandem( 'radioButtonGroup' )
      } );

      const wavelengthSlider = new WavelengthSlider( light.wavelengthProperty, {
        trackWidth: 150,
        trackHeight: 30,
        valueVisible: false,
        tweakersTouchAreaXDilation: 10,
        tweakersTouchAreaYDilation: 10,
        tandem: tandem.createTandem( 'wavelengthSlider' )
      } );

      // rendering order
      const content = new VBox( {
        spacing: 15,
        align: 'left',
        children: [ valueParent, radioButtonGroup, wavelengthSlider ]
      } );

      // add a horizontal strut to prevent width changes
      content.addChild( new HStrut( Math.max( content.width, wavelengthSlider.width ) ) );

      super( content, {
        xMargin: 20,
        yMargin: 20,
        fill: '#F0F0F0',
        stroke: 'gray',
        lineWidth: 1,
        tandem: tandem
      } );

      // When the radio button selection changes...
      variableWavelengthProperty.link( function( isVariable ) {

        // add/remove the slider so that the panel resizes
        if ( isVariable ) {
          !content.hasChild( wavelengthSlider ) && content.addChild( wavelengthSlider );
        }
        else {
          content.hasChild( wavelengthSlider ) && content.removeChild( wavelengthSlider );
        }

        if ( !isVariable ) {
          // Set the light to the current solution's lambdaMax wavelength.
          light.wavelengthProperty.set( solutionProperty.get().molarAbsorptivityData.lambdaMax );
        }
      } );

      // sync displayed value with model
      light.wavelengthProperty.link( function( wavelength ) {
        valueDisplay.text = formatWavelength( wavelength );
        valueDisplay.right = valueBackground.right - xMargin; // right aligned
      } );

      // @private
      this.variableWavelengthProperty = variableWavelengthProperty;
    }

    // @public
    reset() {
      this.variableWavelengthProperty.reset();
    }
  }

  function formatWavelength( wavelength ) {
    return StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( wavelength, 0 ), unitsNmString );
  }

  return beersLawLab.register( 'WavelengthControls', WavelengthControls );
} );