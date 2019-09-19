// Copyright 2013-2019, University of Colorado Boulder

/**
 * Control for wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  // strings
  const pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );
  const pattern0Value1UnitsString = require( 'string!BEERS_LAW_LAB/pattern.0value.1units' );
  const presetString = require( 'string!BEERS_LAW_LAB/preset' );
  const unitsNmString = require( 'string!BEERS_LAW_LAB/units.nm' );
  const variableString = require( 'string!BEERS_LAW_LAB/variable' );
  const wavelengthString = require( 'string!BEERS_LAW_LAB/wavelength' );

  /**
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Light} light
   * @param {Tandem} tandem
   * @constructor
   */
  function WavelengthControls( solutionProperty, light, tandem ) {

    // @private is the wavelength variable or fixed?
    this.variableWavelengthProperty = new BooleanProperty( false, {
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

    // preset
    const presetRadioButton = new AquaRadioButton( this.variableWavelengthProperty, false,
      new Text( presetString, {
        font: new PhetFont( 18 ),
        fill: 'black'
      } ), {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        tandem: tandem.createTandem( 'presetWavelengthRadioButton' )
      } );
    presetRadioButton.touchArea = presetRadioButton.localBounds.dilatedXY( 6, 8 );

    // variable
    const variableRadioButton = new AquaRadioButton( this.variableWavelengthProperty, true,
      new Text( variableString, {
        font: new PhetFont( 18 ),
        fill: 'black'
      } ), {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        tandem: tandem.createTandem( 'variableWavelengthRadioButton' )
      } );
    variableRadioButton.touchArea = variableRadioButton.localBounds.dilatedXY( 6, 8 );

    const radioButtons = new HBox( {
      spacing: 18,
      maxWidth: 250, // constrain width for i18n
      children: [ presetRadioButton, variableRadioButton ]
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
      children: [ valueParent, radioButtons, wavelengthSlider ]
    } );

    // add a horizontal strut to prevent width changes
    content.addChild( new HStrut( Math.max( content.width, wavelengthSlider.width ) ) );

    Panel.call( this, content, {
      xMargin: 20,
      yMargin: 20,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: tandem
    } );

    // When the radio button selection changes...
    this.variableWavelengthProperty.link( function( isVariable ) {

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
  }

  beersLawLab.register( 'WavelengthControls', WavelengthControls );

  var formatWavelength = function( wavelength ) {
    return StringUtils.format( pattern0Value1UnitsString, Util.toFixed( wavelength, 0 ), unitsNmString );
  };

  return inherit( Panel, WavelengthControls, {

    // @public
    reset: function() {
      this.variableWavelengthProperty.reset();
    }
  } );
} );