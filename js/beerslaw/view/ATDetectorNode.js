// Copyright 2002-2013, University of Colorado

/**
 * Detector for absorbance (A) and percent transmittance (%T).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var ATDetector = require( "beerslaw/model/ATDetector" );
  var BLLFont = require( "common/BLLFont" );
  var BLLImages = require( "common/BLLImages" );
  var BLLStrings = require( "common/BLLStrings" );
  var HorizontalTiledNode = require( "common/view/HorizontalTiledNode" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var linear = require( "DOT/Util" ).linear;
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var RadioButton = require( "SUN/RadioButton" );
  var Range = require( "DOT/Range" );
  var Shape = require( "KITE/Shape" );
  var StringUtils = require( "PHETCOMMON/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var BUTTONS_X_MARGIN = 25; // specific to image files
  var BUTTONS_Y_OFFSET = 66; // specific to image files
  var VALUE_X_MARGIN = 30; // specific to image files
  var VALUE_CENTER_Y = 24; // specific to image files
  var ABSORBANCE_DECIMAL_PLACES = 2;
  var TRANSMITTANCE_DECIMAL_PLACES = 2;
  var NO_VALUE = "-";
  var PROBE_CENTER_Y_OFFSET = 55; // specific to image file

  /**
   * The body of the detector, where A and T values are displayed.
   * Note that while the body is a Movable, we have currently decided not to allow it to be moved,
   * so it has no drag handler
   * @param {ATDetector} detector
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BodyNode( detector, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // buttons for changing the detector "mode"
    var textOptions = { font: new BLLFont( 18 ), fill: "white" };
    var transmittanceButton = new RadioButton( detector.mode, ATDetector.Mode.TRANSMITTANCE, new Text( BLLStrings.transmittance, textOptions ), { radius: 12 } );
    var absorbanceButton = new RadioButton( detector.mode, ATDetector.Mode.ABSORBANCE, new Text( BLLStrings.absorbance, textOptions ), { radius: 12 } );

    // group the buttons
    var buttonGroup = new Node();
    buttonGroup.addChild( transmittanceButton );
    buttonGroup.addChild( absorbanceButton );
    absorbanceButton.x = transmittanceButton.x;
    absorbanceButton.top = transmittanceButton.bottom + 6;

    // value display
    var maxValue = 100;
    var valueNode = new Text( maxValue.toFixed( ABSORBANCE_DECIMAL_PLACES ), { font: new BLLFont( 24 ) } );

    // background image, sized to fit
    var bodyWidth = Math.max( buttonGroup.width, valueNode.width ) + ( 2 * BUTTONS_X_MARGIN );
    var backgroundNode = new HorizontalTiledNode( bodyWidth,
                                                  new Image( BLLImages.getImage( "at-detector-body-left.png" ) ),
                                                  new Image( BLLImages.getImage( "at-detector-body-center.png" ) ),
                                                  new Image( BLLImages.getImage( "at-detector-body-right.png" ) ) );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( buttonGroup );
    thisNode.addChild( valueNode );

    // layout
    buttonGroup.left = BUTTONS_X_MARGIN;
    buttonGroup.top = BUTTONS_Y_OFFSET;
    valueNode.x = VALUE_X_MARGIN;
    valueNode.top = VALUE_CENTER_Y;

    // body location
    detector.body.location.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // update the value display
    var valueUpdater = function() {
      var value = detector.value.get();
      if ( isNaN( value ) ) {
        valueNode.text = NO_VALUE;
        valueNode.centerX = backgroundNode.centerX;
      }
      else {
        if ( detector.mode.get() === ATDetector.Mode.TRANSMITTANCE ) {
          valueNode.text = StringUtils.format( BLLStrings.pattern_0percent, value.toFixed( TRANSMITTANCE_DECIMAL_PLACES ) );
        }
        else {
          valueNode.text = value.toFixed( ABSORBANCE_DECIMAL_PLACES );
        }
        valueNode.right = backgroundNode.right - VALUE_X_MARGIN; // right justified
      }
    };
    detector.value.link( valueUpdater );
    detector.mode.link( valueUpdater );
  }

  inherit( BodyNode, Node );

  /**
   * The probe portion of the detector.
   * @param {Movable} probe
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ProbeNode( probe, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    var imageNode = new Image( BLLImages.getImage( "at-detector-probe.png" ) );
    thisNode.addChild( imageNode );
    imageNode.x = -imageNode.width / 2;
    imageNode.y = -PROBE_CENTER_Y_OFFSET;

    // location
    probe.location.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // interactivity
    thisNode.cursor = "pointer";
    thisNode.addInputListener( new MovableDragHandler( probe, mvt ) );
  }

  inherit( ProbeNode, Node );

  /**
   * Wire that connects the body and probe.
   * @param {Movable} body
   * @param {Movable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   * @constructor
   */
  function WireNode( body, probe, bodyNode, probeNode ) {

    var thisNode = this;
    Path.call( this, {
      shape: new Shape(),
      stroke: "gray",
      lineWidth: 8,
      lineCap: "square",
      lineJoin: "round"
    } );

    var updateCurve = function() {

      // connection points
      var bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom );
      var probeConnectionPoint = new Vector2( probeNode.centerX, probeNode.bottom );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      var c1Offset = new Vector2( 0, linear( 0, 0, 800, 200, bodyNode.centerX - probeNode.left ) );
      var c2Offset = new Vector2( 50, 150 );
      var c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      // cubic curve
      thisNode.shape = new Shape()
          .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
          .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    body.location.link( updateCurve );
    probe.location.link( updateCurve );
  }

  inherit( WireNode, Path );

  /**
   * @param {ATDetector} detector
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ATDetectorNode( detector, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    var bodyNode = new BodyNode( detector, mvt );
    var probeNode = new ProbeNode( detector.probe, mvt );
    var wireNode = new WireNode( detector.body, detector.probe, bodyNode, probeNode );

    thisNode.addChild( wireNode );
    thisNode.addChild( bodyNode );
    thisNode.addChild( probeNode );
  }

  inherit( ATDetectorNode, Node );

  return ATDetectorNode;
} );