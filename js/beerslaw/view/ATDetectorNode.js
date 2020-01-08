// Copyright 2013-2020, University of Colorado Boulder

/**
 * Detector for absorbance (A) and percent transmittance (%T).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const ATDetector = require( 'BEERS_LAW_LAB/beerslaw/model/ATDetector' );
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ProbeNode = require( 'SCENERY_PHET/ProbeNode' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );

  //strings
  const absorbanceString = require( 'string!BEERS_LAW_LAB/absorbance' );
  const pattern0PercentString = require( 'string!BEERS_LAW_LAB/pattern.0percent' );
  const transmittanceString = require( 'string!BEERS_LAW_LAB/transmittance' );

  // constants
  const ABSORBANCE_DECIMAL_PLACES = 2;
  const TRANSMITTANCE_DECIMAL_PLACES = 2;
  const NO_VALUE = MathSymbols.NO_VALUE;
  const BODY_X_MARGIN = 15;
  const BODY_Y_MARGIN = 15;
  const VALUE_X_MARGIN = 6;
  const VALUE_Y_MARGIN = 4;
  const PROBE_COLOR = 'rgb( 8, 133, 54 )';
  const MIN_VALUE_SIZE = new Dimension2( 150, 36 );
  const MIN_BODY_SIZE = new Dimension2( 185, 140 );

  /**
   * @param {ATDetector} detector
   * @param {Light} light
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function ATDetectorNode( detector, light, modelViewTransform, tandem ) {

    Node.call( this );

    const bodyNode = new BodyNode( detector, modelViewTransform, tandem.createTandem( 'bodyNode' ) );
    const probeNode = new ATProbeNode( detector.probe, light, modelViewTransform, tandem.createTandem( 'probeNode' ) );
    const wireNode = new WireNode( detector.body, detector.probe, bodyNode, probeNode );

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

    const self = this;

    Node.call( this, { tandem: tandem } );

    // buttons for changing the detector 'mode'
    const textOptions = { font: new PhetFont( 18 ), fill: 'white' };
    const transmittanceRadioButton = new AquaRadioButton( detector.modeProperty, ATDetector.Mode.TRANSMITTANCE,
      new Text( transmittanceString, textOptions ), {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        tandem: tandem.createTandem( 'transmittanceRadioButton' )
      } );
    const absorbanceRadioButton = new AquaRadioButton( detector.modeProperty, ATDetector.Mode.ABSORBANCE,
      new Text( absorbanceString, textOptions ), {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        tandem: tandem.createTandem( 'absorbanceRadioButton' )
      } );

    // group the buttons
    const buttonGroup = new LayoutBox( {
      children: [ transmittanceRadioButton, absorbanceRadioButton ],
      orientation: 'vertical',
      align: 'left',
      spacing: 15,
      maxWidth: 260
    } );

    // value
    const maxValue = 100;
    const valueNode = new Text( StringUtils.format( pattern0PercentString, Utils.toFixed( maxValue, TRANSMITTANCE_DECIMAL_PLACES ) ), {
      font: new PhetFont( 24 ),
      maxWidth: 150,
      tandem: tandem.createTandem( 'valueNode' )
    } );

    // display area for the value
    const valueWidth = Math.max( MIN_VALUE_SIZE.width, Math.max( buttonGroup.width, valueNode.width ) + ( 2 * VALUE_X_MARGIN ) );
    const valueHeight = Math.max( MIN_VALUE_SIZE.height, valueNode.height + ( 2 * VALUE_Y_MARGIN ) );
    const valueBackgroundNode = new ShadedRectangle( new Bounds2( 0, 0, valueWidth, valueHeight ), {
      baseColor: 'white',
      lightSource: 'rightBottom'
    } );
    valueNode.right = valueBackgroundNode.right - VALUE_X_MARGIN;
    valueNode.centerY = valueBackgroundNode.centerY;

    // vertical arrangement of stuff in the meter
    const vBox = new LayoutBox( {
      children: [ new Node( { children: [ valueBackgroundNode, valueNode ] } ), buttonGroup ],
      orientation: 'vertical',
      align: 'center',
      spacing: 12
    } );

    // meter body
    const bodyWidth = Math.max( MIN_BODY_SIZE.width, vBox.width + ( 2 * BODY_X_MARGIN ) );
    const bodyHeight = Math.max( MIN_BODY_SIZE.height, vBox.height + ( 2 * BODY_Y_MARGIN ) );
    const bodyNode = new ShadedRectangle( new Bounds2( 0, 0, bodyWidth, bodyHeight ), {
      baseColor: PROBE_COLOR,
      lightOffset: 0.95
    } );

    this.addChild( bodyNode );
    this.addChild( vBox );
    vBox.center = bodyNode.center;

    // body position
    detector.body.positionProperty.link( function( position ) {
      self.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // update the value display
    const valueUpdater = function() {
      const value = detector.valueProperty.get();
      if ( value === null ) {
        valueNode.text = NO_VALUE;
        valueNode.centerX = valueBackgroundNode.centerX; // centered
      }
      else {
        if ( detector.modeProperty.get() === ATDetector.Mode.TRANSMITTANCE ) {
          valueNode.text = StringUtils.format( pattern0PercentString, Utils.toFixed( value, TRANSMITTANCE_DECIMAL_PLACES ) );
        }
        else {
          valueNode.text = Utils.toFixed( value, ABSORBANCE_DECIMAL_PLACES );
        }
        valueNode.right = valueBackgroundNode.right - VALUE_X_MARGIN; // right justified
      }
      valueNode.centerY = valueBackgroundNode.centerY;
    };
    detector.valueProperty.link( valueUpdater );
    detector.modeProperty.link( valueUpdater );
  }

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

    const self = this;

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

    // position
    probe.positionProperty.link( function( position ) {
      self.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // interactivity
    this.cursor = 'pointer';

    const movableDragHandler = new MovableDragHandler( probe.positionProperty, {
      tandem: tandem.createTandem( 'movableDragHandler' ),
      dragBounds: probe.dragBounds,
      modelViewTransform: modelViewTransform,
      endDrag: function() {
        // If the light is on and the probe is close enough to the beam...
        if ( light.onProperty.get() && ( probe.positionProperty.get().x >= light.position.x ) && ( Math.abs( probe.positionProperty.get().y - light.position.y ) <= 0.5 * light.lensDiameter ) ) {
          // ... snap the probe to the center of beam.
          probe.positionProperty.set( new Vector2( probe.positionProperty.get().x, light.position.y ) );
        }
      }
    } );
    this.addInputListener( movableDragHandler );

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

    const self = this;

    Path.call( this, new Shape(), {
      stroke: 'gray',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false
    } );

    const updateCurve = function() {

      // connection points
      const bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom );
      const probeConnectionPoint = new Vector2( probeNode.centerX, probeNode.bottom );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      const c1Offset = new Vector2( 0, Utils.linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      const c2Offset = new Vector2( 50, 150 );
      const c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      const c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      // cubic curve
      self.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    body.positionProperty.link( updateCurve );
    probe.positionProperty.link( updateCurve );
  }

  inherit( Path, WireNode );

  return inherit( Node, ATDetectorNode );
} );

