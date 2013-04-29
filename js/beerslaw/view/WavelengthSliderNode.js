// Copyright 2013, University of Colorado

/**
 * WavelengthControl is a slider-like control used for setting wavelength.
 * It handles visible wavelengths, plus optional UV and IR wavelengths.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {

  // imports
  var assert = require( 'ASSERT/assert' )( 'beers-law-lab' );
  var BLLStrings = require( "common/BLLStrings" );
  var Dimension2 = require( "DOT/Dimension2" );
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
  var Util = require( "DOT/Util" );
  var VisibleColor = require( "common/util/VisibleColor" );

  // constants
  var VALUE_DECIMAL_PLACES = 0;
  var VALUE_Y_OFFSET = 2;
  var LABEL_TRACK_RATIO = 0.70 // how tall the UV/IR labels should be relative to the track height

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
    Path.call( this, { shape: shape, stroke: 'black', lineWidth: 1, fill: 'black' } );
  }

  inherit( Thumb, Path );

  //TODO add a background
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
    property.addObserver( function ( value ) {
      thisNode.text = StringUtils.format( BLLStrings.pattern_0value_1units, [value.toFixed( VALUE_DECIMAL_PLACES ), BLLStrings.units_nm] );
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
    Rectangle.call( this, -width / 2, 0, width, height, { stroke: 'black', lineWidth: 1 } );
  }

  inherit( Cursor, Rectangle );

  /**
   * @param {Property} wavelength of type Number
   * @param {object} options
   * @constructor
   */
  function WavelengthSliderNode( wavelength, options ) {

    var thisNode = this;
    Node.call( thisNode, options );

    // options
    options = options || {};
    var minWavelength = options.minWavelength || VisibleColor.MIN_WAVELENGTH;
    var maxWavelength = options.maxWavelength || VisibleColor.MAX_WAVELENGTH;
    assert && assert( minWavelength < maxWavelength );
    var trackWidth = options.trackWidth || 150;
    var trackHeight = options.trackHeight || 30;
    var thumbWidth = options.thumbWidth || 20;
    var thumbHeight = options.thumbHeight || 20;
    var uvTrackColor = options.uvTrackColor || 'rgb(192,192,192)';
    var uvLabelColor = options.uvLabelColor || 'black';
    var irTrackColor = options.irTrackColor || 'rgb(192,192,192)';
    var irLabelColor = options.irLabelColor || 'black';
    var valueFont = options.valueFont || "14px Arial";
    var valueFill = options.valueFill || 'black';

    var thumb = new Thumb( thumbWidth, thumbHeight );
    var valueDisplay = new ValueDisplay( wavelength, valueFont, valueFill );
    var track = new Rectangle( 0, 0, trackWidth, trackHeight, { fill: 'red' } ); //XXX
    var cursor = new Cursor( 3, track.height );

    /*
     * Put a border around the track.
     * We don't stroke the track itself because stroking the track will affect its bounds,
     * and will thus affect the drag handle behavior.
     * Having a separate border also gives subclasses a place to add markings (eg, tick marks)
     * without affecting the track's bounds.
     */
    var trackBorder = new Rectangle( 0, 0, track.width, track.height, { stroke: 'black', lineWidth: 1, pickable: false } );

    // rendering order
    thisNode.addChild( track );
    thisNode.addChild( trackBorder );
    thisNode.addChild( thumb );
    thisNode.addChild( valueDisplay );
    thisNode.addChild( cursor );

    // layout
    cursor.top = track.top;
    thumb.top = track.bottom;
    valueDisplay.bottom = track.top - 4;

    // track interactivity
    track.cursor = 'pointer';
    var positionToValue = new LinearFunction( new Range( 0, track.width ), new Range( minWavelength, maxWavelength ) );
    track.addInputListener(
      {
        down: function ( event ) {
          //TODO handleTrackClick
          var x = track.globalToParentPoint( event.pointer.point ).x;
          var value = Util.clamp( positionToValue.evaluate( x ), minWavelength, maxWavelength )
          wavelength.set( value );
        }
      } );

    // thumb interactivity
    thumb.cursor = 'pointer';
    thumb.addInputListener( new SimpleDragHandler(
      {
        drag: function ( event, trail ) {
          var x = thumb.globalToParentPoint( event.pointer.point ).x;
          wavelength.set( Util.clamp( positionToValue.evaluate( x ), minWavelength, maxWavelength ) );
        },
        translate: function () {
          // do nothing, override default behavior
        }
      } ) );

    // sync with model
    var updateUI = function ( wavelength ) {
      // positions
      var x = Util.clamp( positionToValue.evaluateInverse( wavelength ), 0, track.width );
      thumb.centerX = x;
      cursor.centerX = x;
      valueDisplay.centerX = x;

      // thumb color
      thumb.fill = VisibleColor.wavelengthToColor( wavelength ).toCSS();
    };
    wavelength.addObserver( function ( wavelength ) {
      updateUI( wavelength );
    } );

    /*
     * WORKAROUND for Unfuddle #3327:
     * The horizontal bounds of the wavelength control changes as the slider knob is dragged.
     * To prevent this, we determine the extents of the control's bounds, then add an invisible horizontal strut.
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
      var strutNode = new Rectangle( minX, 0, maxX - minX, 1, { pickable: false } );
      thisNode.addChild( strutNode );
      strutNode.moveToBack();
    }
  }

  inherit( WavelengthSliderNode, Node );

  return WavelengthSliderNode;
} );

//
//    //----------------------------------------------------------------------------
//    // Inner classes
//    //----------------------------------------------------------------------------
//
//    // The track that the slider thumb moves in.
//    private static class Track extends PComposite {
//
//        // Constructor
//        public Track( int trackWidth, int trackHeight,
//                      double minWavelength, double maxWavelength,
//                      Color uvTrackColor, Color uvLabelColor,
//                      Color irTrackColor, Color irLabelColor ) {
//            super();
//
//            final double totalBandwidth = maxWavelength - minWavelength;
//            final double uvBandwidth = VisibleColor.MIN_WAVELENGTH - minWavelength;
//            final double irBandwidth = maxWavelength - VisibleColor.MAX_WAVELENGTH;
//            final double uvTrackWidth = ( uvBandwidth / totalBandwidth ) * trackWidth;
//            final double irTrackWidth = ( irBandwidth / totalBandwidth ) * trackWidth;
//
//            // Track image for the entire spectrum
//            Image trackImage = new LinearSpectrumImageFactory().createHorizontalSpectrum( trackWidth, trackHeight, minWavelength, maxWavelength, uvTrackColor, irTrackColor );
//            PImage trackNode = new PImage( trackImage );
//            trackNode.setOffset( 0, 0 );
//            addChild( trackNode );
//
//            // Label the UV portion of the track
//            if ( uvTrackWidth > 0 ) {
//
//                PText uvLabel = new PText( UV_STRING );
//                uvLabel.setTextPaint( uvLabelColor );
//
//                // Scale to fit the track height
//                uvLabel.scale( ( trackHeight * LABEL_TRACK_RATIO ) / uvLabel.getFullBounds().getHeight() );
//
//                // Add the UV label if the UV portion of the track is wide enough
//                if ( uvTrackWidth > uvLabel.getFullBounds().getWidth() ) {
//
//                    addChild( uvLabel );
//
//                    // center in the UV portion of the track
//                    uvLabel.setOffset( ( uvTrackWidth - uvLabel.getFullBounds().getWidth() ) / 2,
//                                       ( trackHeight - uvLabel.getFullBounds().getHeight() ) / 2 );
//                }
//            }
//
//            // Label the IR portion of the track
//            if ( irTrackWidth > 0 ) {
//
//                PText irLabel = new PText( IR_STRING );
//                irLabel.setTextPaint( irLabelColor );
//
//                // Scale label to fit the track height
//                irLabel.scale( ( trackHeight * LABEL_TRACK_RATIO ) / irLabel.getFullBounds().getHeight() );
//
//                // Add the IR label if the IR portion of the track is wide enough
//                if ( irTrackWidth > irLabel.getFullBounds().getWidth() ) {
//
//                    addChild( irLabel );
//
//                    // center in the IR portion of the track
//                    irLabel.setOffset( trackWidth - irTrackWidth + ( ( irTrackWidth - irLabel.getFullBounds().getWidth() ) / 2 ),
//                                       ( trackHeight - irLabel.getFullBounds().getHeight() ) / 2 );
//                }
//            }
//        }
//    }