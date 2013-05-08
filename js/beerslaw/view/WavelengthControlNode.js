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
  var ControlPanelNode = require( "common/view/ControlPanelNode" );
  var Dimension2 = require( "DOT/Dimension2" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var RadioButton = require( "SUN/RadioButton" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var WavelengthSliderNode = require( "beerslaw/view/WavelengthSliderNode" );

  /**
   * @param {Property} solution of type BeersLawSolution
   * @param {Light} light
   * @constructor
   */
  function WavelengthControlNode( solution, light ) {

    var thisNode = this;

    var variableWavelength = new Property( false ); // is the wavelength variable or fixed?

    // nodes
    var labelNode = new Text( StringUtils.format( BLLStrings.pattern_0label, [BLLStrings.wavelength] ), { font: "22px Arial", fill: "black" } );
    var valueNode = new Text( "?", { font: "22px Arial", fill: "black" } );
    var fixedRadioButton = new RadioButton( variableWavelength, false, new Text( BLLStrings.fixed, { font: "18px Arial", fill: "black" } ) );
    var variableRadioButton = new RadioButton( variableWavelength, true, new Text( BLLStrings.variable, { font: "18px Arial", fill: "black" } ) );
    var wavelengthSlider = new WavelengthSliderNode( light.wavelength, { trackWidth: 150, trackHeight: 30 } );

    // rendering order
    var contentNode = new Node();
    contentNode.addChild( labelNode );
    contentNode.addChild( valueNode );
    contentNode.addChild( fixedRadioButton );
    contentNode.addChild( variableRadioButton );
    contentNode.addChild( wavelengthSlider );

    // layout
    var ySpacing = 20;
    valueNode.left = labelNode.right + 10;
    valueNode.y = labelNode.y; // align baselines
    fixedRadioButton.left = labelNode.left;
    fixedRadioButton.top = labelNode.bottom + ySpacing;
    variableRadioButton.left = fixedRadioButton.right + 15;
    variableRadioButton.centerY = fixedRadioButton.centerY;
    wavelengthSlider.left = fixedRadioButton.left;
    wavelengthSlider.top = fixedRadioButton.bottom + ySpacing;

    ControlPanelNode.call( thisNode, contentNode, 20, 20 );

    //TODO controlPanel doesn't resize because bounds of contentNode don't change, why?
    // When the radio button selection changes...
    variableWavelength.addObserver( function( isVariable ) {
      wavelengthSlider.visible = isVariable;
      if ( !isVariable ) {
        // Set the light to the current solution's lambdaMax wavelength.
        light.wavelength.set( solution.get().molarAbsorptivityData.lambdaMax );
      }
      thisNode.resize();
    } );

    this.reset = function() {
      variableWavelength.reset();
    };

    // sync displayed value with model
    light.wavelength.addObserver( function( wavelength ) {
      valueNode.text = StringUtils.format( BLLStrings.pattern_0value_1units, [wavelength.toFixed( 0 ), BLLStrings.units_nm] );
    } );
  }

  inherit( WavelengthControlNode, ControlPanelNode );

  return WavelengthControlNode;
} );