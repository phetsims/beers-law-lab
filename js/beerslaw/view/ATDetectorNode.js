// Copyright 2013, University of Colorado

/**
 * Detector for absorbance (A) and percent transmittance (%T).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var ATDetector = require( "beerslaw/model/ATDetector" );
  var BLLStrings = require( "common/BLLStrings" );
  var HorizontalTiledNode = require( "common/view/HorizontalTiledNode" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MovableDragHandler = require( "common/view/MovableDragHandler" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var RadioButtonNode = require( "common/view/RadioButtonNode" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var WireNode = require( "common/view/WireNode" );

  // constants
  var BUTTONS_X_MARGIN = 25; // specific to image files
  var BUTTONS_Y_OFFSET = 17; // specific to image files
  var VALUE_X_MARGIN = 25; // specific to image files
  var VALUE_Y_OFFSET = 87; // specific to image files
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
   * @param {ATDetector} detector
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BodyNode( detector, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // buttons for changing the detector "mode"
    var textOptions = { font: "22px Arial" };
    var transmittanceButton = new RadioButtonNode( detector.mode, ATDetector.Mode.TRANSMITTANCE, BLLStrings.transmittance, textOptions );
    var absorbanceButton = new RadioButtonNode( detector.mode, ATDetector.Mode.ABSORBANCE,  BLLStrings.absorbance, textOptions );

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