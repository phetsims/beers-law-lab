// Copyright 2013, University of Colorado

/**
 * Control for wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function ( require ) {

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var ControlPanelNode = require( "common/view/ControlPanelNode" );
  var Dimension2 = require( "DOT/Dimension2" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var RadioButtonNode = require( "common/view/RadioButtonNode" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var WavelengthSliderNode = require( "beerslaw/view/WavelengthSliderNode" );

  // constants
  var FONT = "18px Arial";
  var WAVELENGTH_CONTROL_TRACK_SIZE = new Dimension2( 150, 30 );

  /**
   * @param {Property} solution of type BeersLawSolution
   * @param {Light} light
   * @constructor
   */
  function WavelengthControlNode( solution, light ) {

    var variableWavelength = new Property( false ); // is the wavelength variable or fixed?

    var labelNode = new Text( StringUtils.format( BLLStrings.pattern_0label, [BLLStrings.wavelength] ), { font: FONT } );
    var fixedRadioButton = new RadioButtonNode( variableWavelength, false, BLLStrings.fixed, { font: FONT } );
    var variableRadioButton = new RadioButtonNode( variableWavelength, true, BLLStrings.variable, { font: FONT } );
    var wavelengthSlider = new WavelengthSliderNode( WAVELENGTH_CONTROL_TRACK_SIZE, light.wavelength );

    var contentNode = new Node();
    contentNode.addChild( labelNode );
    contentNode.addChild( fixedRadioButton );
    contentNode.addChild( variableRadioButton );
    contentNode.addChild( wavelengthSlider );

    // layout
    var ySpacing = 12;
    fixedRadioButton.left = labelNode.left;
    fixedRadioButton.top = labelNode.bottom + ySpacing;
    variableRadioButton.left = fixedRadioButton.left;
    variableRadioButton.top = fixedRadioButton.bottom + ySpacing;
    wavelengthSlider.left = variableRadioButton.left;
    wavelengthSlider.top = variableRadioButton.bottom + ySpacing;

    ControlPanelNode.call( this, contentNode, 20, 20 );

    // When the radio button selection changes...
    variableWavelength.addObserver( function ( isVariable ) {
      if ( isVariable ) {
        //TODO hide the wavelength slider
      }
      else {
        //TODO show the wavelength slider
        // Set the light to the current solution's lambdaMax wavelength.
        light.wavelength.set( solution.get().molarAbsorptivityData.lambdaMax );
      }
    } );

    this.reset = function () {
      variableWavelength.reset();
    }
  }

  inherit( WavelengthControlNode, ControlPanelNode );

  return WavelengthControlNode;
} );