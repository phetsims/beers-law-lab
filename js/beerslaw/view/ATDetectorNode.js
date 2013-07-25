// Copyright 2002-2013, University of Colorado Boulder

/**
 * Detector for absorbance (A) and percent transmittance (%T).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ATDetector = require( 'beerslaw/model/ATDetector' );
  var BLLImages = require( 'common/BLLImages' );
  var BLLStrings = require( 'common/BLLStrings' );
  var HorizontalTiledNode = require( 'SCENERY_PHET/HorizontalTiledNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'common/view/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BUTTONS_X_MARGIN = 25; // specific to image files
  var BUTTONS_Y_OFFSET = 66; // specific to image files
  var VALUE_X_MARGIN = 30; // specific to image files
  var VALUE_CENTER_Y = 24; // specific to image files
  var ABSORBANCE_DECIMAL_PLACES = 2;
  var TRANSMITTANCE_DECIMAL_PLACES = 2;
  var NO_VALUE = '-';
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

    // buttons for changing the detector 'mode'
    var textOptions = { font: new PhetFont( 18 ), fill: 'white' };
    var transmittanceButton = new AquaRadioButton( detector.mode, ATDetector.Mode.TRANSMITTANCE, new Text( BLLStrings.transmittance, textOptions ) );
    var absorbanceButton = new AquaRadioButton( detector.mode, ATDetector.Mode.ABSORBANCE, new Text( BLLStrings.absorbance, textOptions ) );

    // group the buttons
    var buttonGroup = new Node();
    buttonGroup.addChild( transmittanceButton );
    buttonGroup.addChild( absorbanceButton );
    absorbanceButton.x = transmittanceButton.x;
    absorbanceButton.top = transmittanceButton.bottom + 6;

    // value display
    var maxValue = 100;
    var valueNode = new Text( maxValue.toFixed( ABSORBANCE_DECIMAL_PLACES ), { font: new PhetFont( 24 ) } );

    // background image, sized to fit
    var bodyWidth = Math.max( buttonGroup.width, valueNode.width ) + ( 2 * BUTTONS_X_MARGIN );
    var backgroundNode = new HorizontalTiledNode( bodyWidth,
      BLLImages.getImage( 'at-detector-body-left.png' ),
      BLLImages.getImage( 'at-detector-body-center.png' ),
      BLLImages.getImage( 'at-detector-body-right.png' ) );

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

  inherit( Node, BodyNode );

  /**
   * The probe portion of the detector.
   * @param {Movable} probe
   * @param {Light} light
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ProbeNode( probe, light, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    var imageNode = new Image( BLLImages.getImage( 'at-detector-probe.png' ) );
    thisNode.addChild( imageNode );
    imageNode.x = -imageNode.width / 2;
    imageNode.y = -PROBE_CENTER_Y_OFFSET;

    // location
    probe.location.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // interactivity
    thisNode.cursor = 'pointer';
    thisNode.addInputListener( new MovableDragHandler( probe, mvt, {
      endDrag: function() {
        // If the light is on and the probe is close enough to the beam...
        if ( light.on.get() && ( probe.location.get().x >= light.location.x ) && ( Math.abs( probe.location.get().y - light.location.y ) <= 0.5 * light.lensDiameter ) ) {
           // ... snap the probe to the center of beam.
          probe.location.set( new Vector2( probe.location.get().x, light.location.y ) );
        }
      }
    } ) );

    // touch area
    var dx = 0.25 * imageNode.width;
    var dy = 0 * imageNode.height;
    thisNode.touchArea = Shape.rectangle( imageNode.x - dx, imageNode.y - dy, imageNode.width + dx + dx, imageNode.height + dy + dy );
  }

  inherit( Node, ProbeNode );

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
      stroke: 'gray',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false
    } );

    var updateCurve = function() {

      // connection points
      var bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom );
      var probeConnectionPoint = new Vector2( probeNode.centerX, probeNode.bottom );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      var c1Offset = new Vector2( 0, Util.linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
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

  inherit( Path, WireNode );

  /**
   * @param {ATDetector} detector
   * @param {Light} light
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ATDetectorNode( detector, light, mvt ) {

    Node.call( this );

    var bodyNode = new BodyNode( detector, mvt );
    var probeNode = new ProbeNode( detector.probe, light, mvt );
    var wireNode = new WireNode( detector.body, detector.probe, bodyNode, probeNode );

    this.addChild( wireNode );
    this.addChild( bodyNode );
    this.addChild( probeNode );
  }

  inherit( Node, ATDetectorNode );

  return ATDetectorNode;
} );