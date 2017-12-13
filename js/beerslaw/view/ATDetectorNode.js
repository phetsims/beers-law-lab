// Copyright 2013-2017, University of Colorado Boulder

/**
 * Detector for absorbance (A) and percent transmittance (%T).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var ATDetector = require( 'BEERS_LAW_LAB/beerslaw/model/ATDetector' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ProbeNode = require( 'SCENERY_PHET/ProbeNode' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  //strings
  var absorbanceString = require( 'string!BEERS_LAW_LAB/absorbance' );
  var pattern0PercentString = require( 'string!BEERS_LAW_LAB/pattern.0percent' );
  var transmittanceString = require( 'string!BEERS_LAW_LAB/transmittance' );

  // constants
  var ABSORBANCE_DECIMAL_PLACES = 2;
  var TRANSMITTANCE_DECIMAL_PLACES = 2;
  var NO_VALUE = '-';
  var BODY_X_MARGIN = 15;
  var BODY_Y_MARGIN = 15;
  var VALUE_X_MARGIN = 6;
  var VALUE_Y_MARGIN = 4;
  var PROBE_COLOR = 'rgb( 8, 133, 54 )';
  var MIN_VALUE_SIZE = new Dimension2( 150, 36 );
  var MIN_BODY_SIZE = new Dimension2( 185, 140 );

  /**
   * @param {ATDetector} detector
   * @param {Light} light
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function ATDetectorNode( detector, light, modelViewTransform, tandem ) {

    Node.call( this );

    var bodyNode = new BodyNode( detector, modelViewTransform, tandem.createTandem( 'bodyNode' ) );
    var probeNode = new ATProbeNode( detector.probe, light, modelViewTransform, tandem.createTandem( 'probeNode' ) );
    var wireNode = new WireNode( detector.body, detector.probe, bodyNode, probeNode );

    this.addChild( wireNode );
    this.addChild( bodyNode );
    this.addChild( probeNode );
  }

  beersLawLab.register( 'ATDetectorNode', ATDetectorNode );

  /**
   * The body of the detector, where A and T values are displayed.
   * Note that while the body is a Movable, we have currently decided not to allow it to be moved,
   * so it has no drag handler
   * @param {ATDetector} detector
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function BodyNode( detector, modelViewTransform, tandem ) {

    var self = this;

    Node.call( this, { tandem: tandem } );

    // buttons for changing the detector 'mode'
    var textOptions = { font: new PhetFont( 18 ), fill: 'white' };
    var transmittanceRadioButton = new AquaRadioButton( detector.modeProperty, ATDetector.Mode.TRANSMITTANCE,
      new Text( transmittanceString, textOptions ), {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        tandem: tandem.createTandem( 'transmittanceRadioButton' )
      } );
    var absorbanceRadioButton = new AquaRadioButton( detector.modeProperty, ATDetector.Mode.ABSORBANCE,
      new Text( absorbanceString, textOptions ), {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        tandem: tandem.createTandem( 'absorbanceRadioButton' )
      } );

    // group the buttons
    var buttonGroup = new LayoutBox( {
      children: [ transmittanceRadioButton, absorbanceRadioButton ],
      orientation: 'vertical',
      align: 'left',
      spacing: 15,
      maxWidth: 260
    } );

    // value
    var maxValue = 100;
    var valueNode = new Text( StringUtils.format( pattern0PercentString, Util.toFixed( maxValue, TRANSMITTANCE_DECIMAL_PLACES ) ), {
      font: new PhetFont( 24 ),
      maxWidth: 150,
      tandem: tandem.createTandem( 'valueNode' )
    } );

    // display area for the value
    var valueWidth = Math.max( MIN_VALUE_SIZE.width, Math.max( buttonGroup.width, valueNode.width ) + ( 2 * VALUE_X_MARGIN ) );
    var valueHeight = Math.max( MIN_VALUE_SIZE.height, valueNode.height + ( 2 * VALUE_Y_MARGIN ) );
    var valueBackgroundNode = new ShadedRectangle( new Bounds2( 0, 0, valueWidth, valueHeight ), {
      baseColor: 'white',
      lightSource: 'rightBottom'
    } );
    valueNode.right = valueBackgroundNode.right - VALUE_X_MARGIN;
    valueNode.centerY = valueBackgroundNode.centerY;

    // vertical arrangement of stuff in the meter
    var vBox = new LayoutBox( {
      children: [ new Node( { children: [ valueBackgroundNode, valueNode ] } ), buttonGroup ],
      orientation: 'vertical',
      align: 'center',
      spacing: 12
    } );

    // meter body
    var bodyWidth = Math.max( MIN_BODY_SIZE.width, vBox.width + ( 2 * BODY_X_MARGIN ) );
    var bodyHeight = Math.max( MIN_BODY_SIZE.height, vBox.height + ( 2 * BODY_Y_MARGIN ) );
    var bodyNode = new ShadedRectangle( new Bounds2( 0, 0, bodyWidth, bodyHeight ), {
      baseColor: PROBE_COLOR,
      lightOffset: 0.95
    } );

    this.addChild( bodyNode );
    this.addChild( vBox );
    vBox.center = bodyNode.center;

    // body location
    detector.body.locationProperty.link( function( location ) {
      self.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // update the value display
    var valueUpdater = function() {
      var value = detector.valueProperty.get();
      if ( value === null ) {
        valueNode.text = NO_VALUE;
        valueNode.centerX = valueBackgroundNode.centerX; // centered
      }
      else {
        if ( detector.modeProperty.get() === ATDetector.Mode.TRANSMITTANCE ) {
          valueNode.text = StringUtils.format( pattern0PercentString, Util.toFixed( value, TRANSMITTANCE_DECIMAL_PLACES ) );
        }
        else {
          valueNode.text = Util.toFixed( value, ABSORBANCE_DECIMAL_PLACES );
        }
        valueNode.right = valueBackgroundNode.right - VALUE_X_MARGIN; // right justified
      }
      valueNode.centerY = valueBackgroundNode.centerY;
    };
    detector.valueProperty.link( valueUpdater );
    detector.modeProperty.link( valueUpdater );
  }

  beersLawLab.register( 'ATDetectorNode.BodyNode', BodyNode );

  inherit( Node, BodyNode );

  /**
   * The probe portion of the detector.
   * @param {Movable} probe
   * @param {Light} light
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function ATProbeNode( probe, light, modelViewTransform, tandem ) {

    var self = this;

    ProbeNode.call( this, {
      tandem: tandem,
      radius: 53,
      innerRadius: 40,
      handleWidth: 68,
      handleHeight: 60,
      handleCornerRadius: 22,
      lightAngle: 1.25 * Math.PI,
      color: PROBE_COLOR
    } );

    // location
    probe.locationProperty.link( function( location ) {
      self.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // interactivity
    this.cursor = 'pointer';

    var movableDragHandler = new MovableDragHandler( probe.locationProperty, {
      tandem: tandem.createTandem( 'movableDragHandler' ),
      dragBounds: probe.dragBounds,
      modelViewTransform: modelViewTransform,
      endDrag: function() {
        // If the light is on and the probe is close enough to the beam...
        if ( light.onProperty.get() && ( probe.locationProperty.get().x >= light.location.x ) && ( Math.abs( probe.locationProperty.get().y - light.location.y ) <= 0.5 * light.lensDiameter ) ) {
          // ... snap the probe to the center of beam.
          probe.locationProperty.set( new Vector2( probe.locationProperty.get().x, light.location.y ) );
        }
      }
    } );
    this.addInputListener( movableDragHandler );

    beersLawLab.register( 'ATDetectorNode.ATProbeNode', ATProbeNode );

    // touch area
    this.touchArea = this.localBounds.dilatedXY( 0.25 * this.width, 0 );
  }

  inherit( Node, ATProbeNode );

  /**
   * Wire that connects the body and probe.
   * @param {Movable} body
   * @param {Movable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   * @constructor
   */
  function WireNode( body, probe, bodyNode, probeNode ) {

    var self = this;

    Path.call( this, new Shape(), {
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
      self.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    body.locationProperty.link( updateCurve );
    probe.locationProperty.link( updateCurve );
  }

  beersLawLab.register( 'ATDetectorNode.WireNode', WireNode );

  inherit( Path, WireNode );

  return inherit( Node, ATDetectorNode );
} );

