// Copyright 2002-2013, University of Colorado

/**
 * Control for wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLFont = require( "common/BLLFont" );
  var BLLStrings = require( "common/BLLStrings" );
  var Dimension2 = require( "DOT/Dimension2" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var PanelNode = require( "SUN/PanelNode" );
  var Property = require( "AXON/Property" );
  var RadioButton = require( "SUN/RadioButton" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var StringUtils = require( "PHETCOMMON/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var WavelengthSlider = require( "beerslaw/view/WavelengthSlider" );

  /**
   * @param {Property<BeersLawSolution>} solution
   * @param {Light} light
   * @constructor
   */
  function WavelengthControls( solution, light ) {

    var thisNode = this;

    var variableWavelength = new Property( false ); // is the wavelength variable or fixed?

    // nodes
    var label = new Text( StringUtils.format( BLLStrings.pattern_0label, BLLStrings.wavelength ), { font: new BLLFont( 22 ), fill: "black" } );
    var valueDisplay = new Text( "?", { font: "22px Arial", fill: "black" } );
    var presetRadioButton = new RadioButton( variableWavelength, false, new Text( BLLStrings.preset, { font: new BLLFont( 18 ), fill: "black" } ) );
    var variableRadioButton = new RadioButton( variableWavelength, true, new Text( BLLStrings.variable, { font: new BLLFont( 18 ), fill: "black" } ) );
    var wavelengthSlider = new WavelengthSlider( light.wavelength, { trackWidth: 150, trackHeight: 30 } );

    // rendering order
    var content = new Node();
    content.addChild( label );
    content.addChild( valueDisplay );
    content.addChild( presetRadioButton );
    content.addChild( variableRadioButton );
    content.addChild( wavelengthSlider );

    // add a horizontal strut to prevent width changes
    content.addChild( new Rectangle( 0, 0, content.width, 1, { pickable: false } ) );

    // layout
    var ySpacing = 20;
    valueDisplay.left = label.right + 10;
    valueDisplay.y = label.y; // align baselines
    presetRadioButton.left = label.left;
    presetRadioButton.top = label.bottom + ySpacing;
    variableRadioButton.left = presetRadioButton.right + 15;
    variableRadioButton.centerY = presetRadioButton.centerY;
    wavelengthSlider.left = presetRadioButton.left;
    wavelengthSlider.top = presetRadioButton.bottom + ySpacing;

    PanelNode.call( thisNode, content,
                    { xMargin: 20, yMargin: 20, fill: "#F0F0F0", stroke: "gray", lineWidth: 1 } );

    // When the radio button selection changes...
    variableWavelength.link( function( isVariable ) {
      //TODO when bounds means "visible bounds", replace this if-else statement with: wavelengthSlider.visible = isVariable;
      if ( isVariable ) {
        if ( !content.isChild( wavelengthSlider ) ) {
           content.addChild( wavelengthSlider );
        }
      }
      else {
        if ( content.isChild( wavelengthSlider ) ) {
          content.removeChild( wavelengthSlider );
        }
      }
      if ( !isVariable ) {
        // Set the light to the current solution's lambdaMax wavelength.
        light.wavelength.set( solution.get().molarAbsorptivityData.lambdaMax );
      }
    } );

    this.reset = function() {
      variableWavelength.reset();
    };

    // sync displayed value with model
    light.wavelength.link( function( wavelength ) {
      valueDisplay.text = StringUtils.format( BLLStrings.pattern_0value_1units, wavelength.toFixed( 0 ), BLLStrings.units_nm );
    } );
  }

  inherit( PanelNode, WavelengthControls );

  return WavelengthControls;
} );