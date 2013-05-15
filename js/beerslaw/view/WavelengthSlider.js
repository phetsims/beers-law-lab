// Copyright 2002-2013, University of Colorado

/**
 * WavelengthControl is a slider-like control used for setting visible wavelength.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var BLLStrings = require( "common/BLLStrings" );
  var Button = require( "SUN/Button" );
  var Dimension2 = require( "DOT/Dimension2" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Range = require( "DOT/Range" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var VisibleColor = require( "common/util/VisibleColor" );

  // features
  var SHOW_VALUE = false;

  /**
   * Slider track that displays the visible spectrum.
   * @param width
   * @param height
   * @param minWavelength
   * @param maxWavelength
   * @constructor
   */
  function Track( width, height, minWavelength, maxWavelength ) {

    var thisNode = this;
    Node.call( thisNode );

    // Draw the spectrum directly to a canvas, to improve performance.
    var canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( '2d' );
    canvas.width = width;
    canvas.height = height;
    var positionToWavelength = new LinearFunction( new Range( 0, width ), new Range( minWavelength, maxWavelength ) );
    for ( var i = 0; i < width; i++ ) {
      var wavelength = positionToWavelength.evaluate( i );
      context.fillStyle = VisibleColor.wavelengthToColor( wavelength ).toCSS();
      context.fillRect( i, 0, 1, 50 );
    }

    thisNode.addChild( new Image( canvas ) );
  }

  inherit( Track, Node );

  /**
   * The slider thumb (aka knob)
   * @param {Number} width
   * @param {Number} height
   * @constructor
   */
  function Thumb( width, height ) {
    var shape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( 0.5 * width, 0.3 * height )
        .lineTo( 0.5 * width, 1 * height )
        .lineTo( -0.5 * width, 1 * height )
        .lineTo( -0.5 * width, 0.3 * height )
        .close();
    Path.call( this, { shape: shape, stroke: "black", lineWidth: 1, fill: "black" } );
  }

  inherit( Thumb, Path );

  /**
   * Displays the value and units.
   * @param property
   * @param {String} font
   * @param {String} fill
   * @constructor
   */
  function ValueDisplay( property, font, fill ) {
    var thisNode = this;
    Text.call( this, "?", { font: font, fill: fill } );
    property.addObserver( function( value ) {
      thisNode.text = StringUtils.format( BLLStrings.pattern_0value_1units, [value.toFixed( 0 ), BLLStrings.units_nm] );
    } );
  }

  inherit( ValueDisplay, Text );

  /**
   * Rectangular "cursor" that appears in the track directly above the thumb. Origin is at top center of cursor.
   * @param {Number} width
   * @param {Number} height
   * @constructor
   */
  function Cursor( width, height ) {
    Rectangle.call( this, -width / 2, 0, width, height, { stroke: "black", lineWidth: 1 } );
  }

  inherit( Cursor, Rectangle );


  /**
   * @param {Property<Number>} wavelength
   * @param {object} options
   * @constructor
   */
  function WavelengthSlider( wavelength, options ) {

    var thisNode = this;
    Node.call( thisNode, options );

    // options
    options = options || {};
    var minWavelength = options.minWavelength || VisibleColor.MIN_WAVELENGTH;
    var maxWavelength = options.maxWavelength || VisibleColor.MAX_WAVELENGTH;
    assert && assert( minWavelength < maxWavelength );
    assert && assert( minWavelength >= VisibleColor.MIN_WAVELENGTH && minWavelength <= VisibleColor.MAX_WAVELENGTH );
    assert && assert( maxWavelength >= VisibleColor.MIN_WAVELENGTH && maxWavelength <= VisibleColor.MAX_WAVELENGTH );
    var trackWidth = options.trackWidth || 150;
    var trackHeight = options.trackHeight || 30;
    var thumbWidth = options.thumbWidth || 35;
    var thumbHeight = options.thumbHeight || 45;
    var valueFont = options.valueFont || "20px Arial";
    var valueFill = options.valueFill || "black";

    var thumb = new Thumb( thumbWidth, thumbHeight );
    var valueDisplay = new ValueDisplay( wavelength, valueFont, valueFill );
    var track = new Track( trackWidth, trackHeight, minWavelength, maxWavelength );
    var cursor = new Cursor( 3, track.height );

    // buttons for single-unit increments
    var arrowHeight = 20;
    var arrowWidth = arrowHeight * Math.sqrt( 3 ) / 2;
    var plusButton = new Button( new Path( { fill: "black", shape: new Shape().moveTo( 0, 0 ).lineTo( arrowWidth, arrowHeight / 2 ).lineTo( 0, arrowHeight ).close() } ),
                                 function() {
                                   wavelength.set( wavelength.get() + 1 );
                                 }, { cornerRadius: 4 } );
    var minusButton = new Button( new Path( { fill: "black", shape: new Shape().moveTo( 0, arrowHeight / 2 ).lineTo( arrowWidth, 0 ).lineTo( arrowWidth, arrowHeight ).close() } ),
                                  function() {
                                    wavelength.set( wavelength.get() - 1 );
                                  }, { cornerRadius: 4 } );

    /*
     * Put a border around the track.
     * We don't stroke the track itself because stroking the track will affect its bounds,
     * and will thus affect the drag handle behavior.
     * Having a separate border also gives subclasses a place to add markings (eg, tick marks)
     * without affecting the track's bounds.
     */
    var trackBorder = new Rectangle( 0, 0, track.width, track.height, { stroke: "black", lineWidth: 1, pickable: false } );

    // rendering order
    thisNode.addChild( track );
    thisNode.addChild( trackBorder );
    thisNode.addChild( thumb );
    if ( SHOW_VALUE ) {
      thisNode.addChild( valueDisplay );
    }
    thisNode.addChild( cursor );
    thisNode.addChild( plusButton );
    thisNode.addChild( minusButton );

    // layout
    cursor.top = track.top;
    thumb.top = track.bottom;
    valueDisplay.bottom = track.top - 2;
    plusButton.left = track.right + 3;
    plusButton.centerY = track.centerY;
    minusButton.right = track.left - 3;
    minusButton.centerY = track.centerY;

    // track interactivity
    track.cursor = "pointer";
    var positionToValue = new LinearFunction( new Range( 0, track.width ), new Range( minWavelength, maxWavelength ), true /* clamp */ );
    track.addInputListener(
        {
          down: function( event ) {
            var x = track.globalToParentPoint( event.pointer.point ).x;
            var value = positionToValue.evaluate( x );
            wavelength.set( value );
          }
        } );

    // thumb interactivity
    thumb.cursor = "pointer";
    var clickXOffset = 0; // x-offset between initial click and thumb's origin
    thumb.addInputListener( new SimpleDragHandler(
        {
          start: function( event ) {
            clickXOffset = thumb.globalToParentPoint( event.pointer.point ).x - thumb.x;
          },
          drag: function( event ) {
            var x = thumb.globalToParentPoint( event.pointer.point ).x - clickXOffset;
            wavelength.set( positionToValue.evaluate( x ) );
          },
          translate: function() {
            // do nothing, override default behavior
          }
        } ) );

    // sync with model
    var updateUI = function( wavelength ) {
      // positions
      var x = positionToValue.evaluateInverse( wavelength );
      thumb.centerX = x;
      cursor.centerX = x;
      valueDisplay.centerX = x;
      // thumb color
      thumb.fill = VisibleColor.wavelengthToColor( wavelength ).toCSS();
      // plus and minus buttons
      //TODO better to disable these button than hide them, but not supported by sun.Button yet
      plusButton.visible = ( wavelength < maxWavelength );
      minusButton.visible = ( wavelength > minWavelength );
    };
    wavelength.addObserver( function( wavelength ) {
      updateUI( wavelength );
    } );

    /*
     * The horizontal bounds of the wavelength control changes as the slider knob is dragged.
     * To prevent this, we determine the extents of the control's bounds at min and max values,
     * then add an invisible horizontal strut.
     */
    {
      // determine bounds at min and max wavelength settings
      updateUI( minWavelength );
      var minX = thisNode.left;
      updateUI( maxWavelength );
      var maxX = thisNode.right;

      // restore the wavelength
      updateUI( wavelength.get() );

      // add a horizontal strut
      var strut = new Rectangle( minX, 0, maxX - minX, 1, { pickable: false } );
      thisNode.addChild( strut );
      strut.moveToBack();
    }
  }

  inherit( WavelengthSlider, Node );

  return WavelengthSlider;
} );