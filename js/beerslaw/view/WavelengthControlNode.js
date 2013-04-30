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
    var labelNode = new Text( StringUtils.format( BLLStrings.pattern_0label, [BLLStrings.wavelength] ), { font: '22px Arial', fill: 'black' } );
    var textOptions = { font: '18px Arial', fill: 'black' };
    var fixedRadioButton = new RadioButton( variableWavelength, false, new Text( BLLStrings.fixed, textOptions ) );
    var variableRadioButton = new RadioButton( variableWavelength, true, new Text( BLLStrings.variable, textOptions ) );
    var wavelengthSlider = new WavelengthSliderNode( light.wavelength, { trackWidth: 150, trackHeight: 30 } );

    // rendering order
    var contentNode = new Node();
    contentNode.addChild( labelNode );
    contentNode.addChild( fixedRadioButton );
    contentNode.addChild( variableRadioButton );
    contentNode.addChild( wavelengthSlider );

    // layout
    var ySpacing = 12;
    fixedRadioButton.left = labelNode.left;
    fixedRadioButton.top = labelNode.bottom + ySpacing;
    variableRadioButton.left = fixedRadioButton.right + 15;
    variableRadioButton.centerY = fixedRadioButton.centerY;
    wavelengthSlider.left = fixedRadioButton.left;
    wavelengthSlider.top = fixedRadioButton.bottom + ySpacing;

    ControlPanelNode.call( thisNode, contentNode, 20, 20 );

    //TODO controlPanel doesn't resize because bounds of contentNode don't change, why?
    // When the radio button selection changes...
    variableWavelength.addObserver( function ( isVariable ) {
      wavelengthSlider.visible = isVariable;
      if ( !isVariable ) {
        // Set the light to the current solution's lambdaMax wavelength.
        light.wavelength.set( solution.get().molarAbsorptivityData.lambdaMax );
      }
      thisNode.resize();
    } );

    this.reset = function () {
      variableWavelength.reset();
    }
  }

  inherit( WavelengthControlNode, ControlPanelNode );

  return WavelengthControlNode;
} );