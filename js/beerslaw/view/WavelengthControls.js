// Copyright 2002-2013, University of Colorado Boulder

/**
 * Control for wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );
  var Util = require( 'DOT/Util' );

  // strings
  var pattern_0label = require( 'string!BEERS_LAW_LAB/pattern.0label' );
  var pattern_0value1units = require( 'string!BEERS_LAW_LAB/pattern.0value.1units' );
  var fixedString = require( 'string!BEERS_LAW_LAB/fixed' );
  var units_nmString = require( 'string!BEERS_LAW_LAB/units.nm' );
  var variableString = require( 'string!BEERS_LAW_LAB/variable' );
  var wavelengthString = require( 'string!BEERS_LAW_LAB/wavelength' );

  /**
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Light} light
   * @constructor
   */
  function WavelengthControls( solutionProperty, light ) {

    var thisNode = this;

    this.variableWavelengthProperty = new Property( false ); // @private is the wavelength variable or fixed?

    // nodes
    var label = new Text( StringUtils.format( pattern_0label, wavelengthString ), { font: new PhetFont( 20 ), fill: 'black' } );
    var valueDisplay = new Text( thisNode.formatWavelength( light.wavelengthProperty.get() ), { font: new PhetFont( 20 ), fill: 'black' } );
    var xMargin = 0.1 * valueDisplay.width;
    var yMargin = 0.1 * valueDisplay.height;
    var valueBackground = new Rectangle( 0, 0, valueDisplay.width + xMargin + xMargin, valueDisplay.height + yMargin + yMargin,
      { fill: 'white', stroke: 'lightGray' } );
    var presetRadioButton = new AquaRadioButton( this.variableWavelengthProperty, false, new Text( fixedString, { font: new PhetFont( 18 ), fill: 'black' } ) );
    var variableRadioButton = new AquaRadioButton( this.variableWavelengthProperty, true, new Text( variableString, {
      font: new PhetFont( 18 ),
      fill: 'black'
    } ) );
    var wavelengthSlider = new WavelengthSlider( light.wavelengthProperty, { trackWidth: 150, trackHeight: 30, valueVisible: false } );

    // rendering order
    var content = new Node();
    content.addChild( label );
    content.addChild( valueBackground );
    content.addChild( valueDisplay );
    content.addChild( presetRadioButton );
    if ( !this.variableWavelengthProperty.get() ) { // opposite of initial state, so variableWavelengthProperty.link doesn't fail on add/removeChild
      content.addChild( variableRadioButton );
    }
    content.addChild( wavelengthSlider );

    // add a horizontal strut to prevent width changes
    content.addChild( new Rectangle( 0, 0, content.width, 1, { pickable: false } ) );

    // layout
    var ySpacing = 20;
    valueBackground.left = label.right + 10;
    valueDisplay.right = valueBackground.right - xMargin; // right aligned
    valueDisplay.y = label.y; // align baselines
    valueBackground.centerY = valueDisplay.centerY;
    presetRadioButton.left = label.left;
    presetRadioButton.top = label.bottom + ySpacing;
    variableRadioButton.left = presetRadioButton.right + 15;
    variableRadioButton.centerY = presetRadioButton.centerY;
    wavelengthSlider.left = presetRadioButton.left;
    wavelengthSlider.top = presetRadioButton.bottom + ySpacing;

    Panel.call( thisNode, content,
      { xMargin: 20, yMargin: 20, fill: '#F0F0F0', stroke: 'gray', lineWidth: 1 } );

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
      valueDisplay.text = thisNode.formatWavelength( wavelength );
      valueDisplay.right = valueBackground.right - xMargin; // right aligned
    } );
  }

  return inherit( Panel, WavelengthControls, {

    reset: function() {
      this.variableWavelengthProperty.reset();
    },

    formatWavelength: function( wavelength ) {
      return StringUtils.format( pattern_0value1units, Util.toFixed( wavelength, 0 ), units_nmString );
    }
  } );
} );