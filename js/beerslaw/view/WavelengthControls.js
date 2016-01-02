// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control for wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  // strings
  var pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );
  var pattern0Value1UnitsString = require( 'string!BEERS_LAW_LAB/pattern.0value.1units' );
  var fixedString = require( 'string!BEERS_LAW_LAB/fixed' );
  var unitsNmString = require( 'string!BEERS_LAW_LAB/units.nm' );
  var variableString = require( 'string!BEERS_LAW_LAB/variable' );
  var wavelengthString = require( 'string!BEERS_LAW_LAB/wavelength' );

  /**
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Light} light
   * @param {Tandem} tandem
   * @constructor
   */
  function WavelengthControls( solutionProperty, light, tandem ) {

    var thisNode = this;

    // @private is the wavelength variable or fixed?
    this.variableWavelengthProperty = new Property( false, { tandem: tandem.createTandem( 'variableWavelengthProperty' ) } );

    var xMargin = 7;
    var yMargin = 3;

    var label = new Text( StringUtils.format( pattern0LabelString, wavelengthString ), {
      font: new PhetFont( 20 ),
      fill: 'black'
    } );

    var valueDisplay = new Text( formatWavelength( light.wavelengthProperty.get() ), {
      font: new PhetFont( 20 ),
      fill: 'black',
      y: label.y // align baselines
    } );

    var valueBackground = new Rectangle( 0, 0, valueDisplay.width + xMargin + xMargin, valueDisplay.height + yMargin + yMargin, {
      fill: 'white',
      stroke: 'lightGray',
      left: label.right + 10,
      centerY: valueDisplay.centerY
    } );
    valueDisplay.right = valueBackground.right - xMargin; // right aligned

    var valueParent = new Node( {
      children: [ label, valueBackground, valueDisplay ],
      maxWidth: 250 // constrain width for i18n
    } );

    var radioButtons = new HBox( {
      spacing: 15,
      maxWidth: 250, // constrain width for i18n
      children: [
        // fixed
        new AquaRadioButton( this.variableWavelengthProperty, false,
          new Text( fixedString, {
            font: new PhetFont( 18 ),
            fill: 'black'
          } ), {
            radius: BLLConstants.RADIO_BUTTON_RADIUS,
            tandem: tandem.createTandem( 'presetWavelengthRadioButton' )
          } ),
        // variable
        new AquaRadioButton( this.variableWavelengthProperty, true,
          new Text( variableString, {
            font: new PhetFont( 18 ),
            fill: 'black'
          } ), {
            radius: BLLConstants.RADIO_BUTTON_RADIUS,
            tandem: tandem.createTandem( 'variableWavelengthRadioButton' )
          } )
      ]
    } );

    var wavelengthSlider = new WavelengthSlider( light.wavelengthProperty, {
      trackWidth: 150,
      trackHeight: 30,
      valueVisible: false,
      tandem: tandem.createTandem( 'wavelengthSlider' )
    } );

    // rendering order
    var content = new VBox( {
      spacing: 15,
      align: 'left',
      children: [ valueParent, radioButtons, wavelengthSlider ]
    } );

    // add a horizontal strut to prevent width changes
    content.addChild( new HStrut( Math.max( content.width, wavelengthSlider.width ) ) );

    Panel.call( thisNode, content, {
      xMargin: 20,
      yMargin: 20,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1
    } );

    // When the radio button selection changes...
    this.variableWavelengthProperty.link( function( isVariable ) {
      if ( isVariable ) {
        content.addChild( wavelengthSlider );
      }
      else {
        content.removeChild( wavelengthSlider );
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