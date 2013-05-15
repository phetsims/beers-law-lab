// Copyright 2002-2013, University of Colorado

/**
 * Control for wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var Dimension2 = require( "DOT/Dimension2" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var PanelNode = require( "SUN/PanelNode" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var RadioButton = require( "SUN/RadioButton" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var WavelengthSlider = require( "beerslaw/view/WavelengthSlider" );

  /**
   * @param {Property} solution of type BeersLawSolution
   * @param {Light} light
   * @constructor
   */
  function WavelengthControls( solution, light ) {

    var thisNode = this;

    var variableWavelength = new Property( false ); // is the wavelength variable or fixed?

    // nodes
    var label = new Text( StringUtils.format( BLLStrings.pattern_0label, [BLLStrings.wavelength] ), { font: "22px Arial", fill: "black" } );
    var valueDisplay = new Text( "?", { font: "22px Arial", fill: "black" } );
    var fixedRadioButton = new RadioButton( variableWavelength, false, new Text( BLLStrings.fixed, { font: "18px Arial", fill: "black" } ) );
    var variableRadioButton = new RadioButton( variableWavelength, true, new Text( BLLStrings.variable, { font: "18px Arial", fill: "black" } ) );
    var wavelengthSlider = new WavelengthSlider( light.wavelength, { trackWidth: 150, trackHeight: 30 } );

    // rendering order
    var content = new Node();
    content.addChild( label );
    content.addChild( valueDisplay );
    content.addChild( fixedRadioButton );
    content.addChild( variableRadioButton );
    content.addChild( wavelengthSlider );

    // layout
    var ySpacing = 20;
    valueDisplay.left = label.right + 10;
    valueDisplay.y = label.y; // align baselines
    fixedRadioButton.left = label.left;
    fixedRadioButton.top = label.bottom + ySpacing;
    variableRadioButton.left = fixedRadioButton.right + 15;
    variableRadioButton.centerY = fixedRadioButton.centerY;
    wavelengthSlider.left = fixedRadioButton.left;
    wavelengthSlider.top = fixedRadioButton.bottom + ySpacing;

    PanelNode.call( thisNode, content,
                    { xMargin: 20, yMargin: 20, fill: "#F0F0F0", stroke: "gray", lineWidth: 1 } );

    // When the radio button selection changes...
    variableWavelength.addObserver( function( isVariable ) {
      wavelengthSlider.visible = isVariable;
      if ( !isVariable ) {
        // Set the light to the current solution's lambdaMax wavelength.
        light.wavelength.set( solution.get().molarAbsorptivityData.lambdaMax );
      }
    } );

    this.reset = function() {
      variableWavelength.reset();
    };

    // sync displayed value with model
    light.wavelength.addObserver( function( wavelength ) {
      valueDisplay.text = StringUtils.format( BLLStrings.pattern_0value_1units, [wavelength.toFixed( 0 ), BLLStrings.units_nm] );
    } );
  }

  inherit( WavelengthControls, PanelNode );

  return WavelengthControls;
} );