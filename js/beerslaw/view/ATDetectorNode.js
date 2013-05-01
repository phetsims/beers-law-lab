// Copyright 2013, University of Colorado

/**
 * Detector for absorbance (A) and percent transmittance (%T).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var ATDetector = require( "beerslaw/model/ATDetector" );
  var BLLStrings = require( "common/BLLStrings" );
  var HorizontalTiledNode = require( "common/view/HorizontalTiledNode" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var RadioButton = require( "SUN/RadioButton" );
  var Range = require( "DOT/Range" );
  var Shape = require( "KITE/Shape" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var BUTTONS_X_MARGIN = 25; // specific to image files
  var BUTTONS_Y_OFFSET = 17; // specific to image files
  var VALUE_X_MARGIN = 30; // specific to image files
  var VALUE_Y_OFFSET = 90; // specific to image files
  var ABSORBANCE_DECIMAL_PLACES = 2;
  var TRANSMITTANCE_DECIMAL_PLACES = 2;
  var NO_VALUE = "-";
  var PROBE_CENTER_Y_OFFSET = 55; // specific to image file

  // images
  var bodyLeftImage = require( "image!images/at-detector-body-left.png" );
  var bodyRightImage = require( "image!images/at-detector-body-right.png" );
  var bodyCenterImage = require( "image!images/at-detector-body-center.png" );
  var probeImage = require( "image!images/at-detector-probe.png" );

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
    var textOptions = { font: "18px Arial", fill: "white" };
    var transmittanceButton = new RadioButton( detector.mode, ATDetector.Mode.TRANSMITTANCE, new Text( BLLStrings.transmittance, textOptions ) );
    var absorbanceButton = new RadioButton( detector.mode, ATDetector.Mode.ABSORBANCE, new Text( BLLStrings.absorbance, textOptions ) );

    // group the buttons
    var buttonGroup = new Node();
    buttonGroup.addChild( transmittanceButton );
    buttonGroup.addChild( absorbanceButton );
    absorbanceButton.x = transmittanceButton.x;
    absorbanceButton.top = transmittanceButton.bottom + 6;

    // value display
    var maxValue = 100;
    var valueNode = new Text( maxValue.toFixed( ABSORBANCE_DECIMAL_PLACES ), { font: "24px Arial" } );

    // background image, sized to fit
    var bodyWidth = Math.max( buttonGroup.width, valueNode.width ) + ( 2 * BUTTONS_X_MARGIN );
    var backgroundNode = new HorizontalTiledNode( bodyWidth, new Image( bodyLeftImage ), new Image( bodyCenterImage ), new Image( bodyRightImage ) );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( buttonGroup );
    thisNode.addChild( valueNode );

    // layout
    buttonGroup.left = BUTTONS_X_MARGIN;
    buttonGroup.top = BUTTONS_Y_OFFSET;
    valueNode.x = VALUE_X_MARGIN;
    valueNode.top = VALUE_Y_OFFSET;

    // body location
    detector.body.location.addObserver( function ( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // update the value display
    var valueUpdater = function () {
      var value = detector.value.get();
      if ( isNaN( value ) ) {
        valueNode.text = NO_VALUE;
        valueNode.centerX = backgroundNode.centerX;
      }
      else {
        if ( detector.mode.get() === ATDetector.Mode.TRANSMITTANCE ) {
          valueNode.text = StringUtils.format( BLLStrings.pattern_0percent, [value.toFixed( TRANSMITTANCE_DECIMAL_PLACES )] );
        }
        else {
          valueNode.text = value.toFixed( ABSORBANCE_DECIMAL_PLACES );
        }
        valueNode.right = backgroundNode.right - VALUE_X_MARGIN; // right justified
      }
    };
    detector.value.addObserver( valueUpdater );
    detector.mode.addObserver( valueUpdater );
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

    var imageNode = new Image( probeImage );
    thisNode.addChild( imageNode );
    imageNode.x = -imageNode.width / 2;
    imageNode.y = -PROBE_CENTER_Y_OFFSET;

    // location
    probe.location.addObserver( function ( location ) {
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

     // The y coordinate of the body's control point varies with the x distance between the body and probe.
    var BODY_CTRL_Y = new LinearFunction( new Range( 0, 800 ), new Range( 0, 200 ) ); // x distance -> y coordinate

    var updateCurve = function () {

      // connection points
      var bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom );
      var probeConnectionPoint = new Vector2( probeNode.centerX, probeNode.bottom );

      // control points
      var c1Offset = new Vector2( 0, BODY_CTRL_Y.evaluate( bodyNode.centerX - probeNode.left ) );
      var c2Offset = new Vector2( 50, 150 );
      var c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      // cubic curve
      thisNode.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    body.location.addObserver( updateCurve );
    probe.location.addObserver( updateCurve );
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