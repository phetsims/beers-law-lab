// Copyright 2013-2020, University of Colorado Boulder

/**
 * Detector for absorbance (A) and percent transmittance (%T).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MovableDragHandler from '../../../../scenery-phet/js/input/MovableDragHandler.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ProbeNode from '../../../../scenery-phet/js/ProbeNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import ATDetector from '../model/ATDetector.js';

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
const RADIO_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 18 ), fill: 'white' };

class ATDetectorNode extends Node {

  /**
   * @param {ATDetector} detector
   * @param {Light} light
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( detector, light, modelViewTransform, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    const bodyNode = new BodyNode( detector, modelViewTransform, {
      tandem: options.tandem.createTandem( 'bodyNode' )
    } );
    const probeNode = new ATProbeNode( detector.probe, light, modelViewTransform, {
      tandem: options.tandem.createTandem( 'probeNode' )
    } );
    const wireNode = new WireNode( detector.body, detector.probe, bodyNode, probeNode );

    this.addChild( wireNode );
    this.addChild( bodyNode );
    this.addChild( probeNode );
  }
}

/**
 * The body of the detector, where A and T values are displayed. Note that while the body is a BLLMovable,
 * we have currently decided not to allow it to be moved, so it has no drag handler
 */
class BodyNode extends Node {

  /**
   * @param {ATDetector} detector
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( detector, modelViewTransform, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // radio button descriptions
    const radioButtonItems = [
      {
        value: ATDetector.Mode.TRANSMITTANCE,
        node: new Text( beersLawLabStrings.transmittance, RADIO_BUTTON_TEXT_OPTIONS ),
        tandemName: 'transmittanceRadioButton'
      },
      {
        value: ATDetector.Mode.ABSORBANCE,
        node: new Text( beersLawLabStrings.absorbance, RADIO_BUTTON_TEXT_OPTIONS ),
        tandemName: 'absorbanceRadioButton'
      }
    ];

    // radio button group
    const radioButtonGroup = new AquaRadioButtonGroup( detector.modeProperty, radioButtonItems, {
      radioButtonOptions: {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        visiblePropertyOptions: { phetioReadOnly: true }
      },
      orientation: 'vertical',
      align: 'left',
      spacing: 15,
      maxWidth: 260,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    // value
    const maxValue = 100;
    const valueNode = new Text( StringUtils.format( beersLawLabStrings.pattern[ '0percent' ],
      Utils.toFixed( maxValue, TRANSMITTANCE_DECIMAL_PLACES ) ), {
      font: new PhetFont( 24 ),
      maxWidth: 150,
      tandem: options.tandem.createTandem( 'valueNode' )
    } );

    // display area for the value
    const valueWidth = Math.max( MIN_VALUE_SIZE.width, Math.max( radioButtonGroup.width, valueNode.width ) + ( 2 * VALUE_X_MARGIN ) );
    const valueHeight = Math.max( MIN_VALUE_SIZE.height, valueNode.height + ( 2 * VALUE_Y_MARGIN ) );
    const valueBackgroundNode = new ShadedRectangle( new Bounds2( 0, 0, valueWidth, valueHeight ), {
      baseColor: 'white',
      lightSource: 'rightBottom'
    } );
    valueNode.right = valueBackgroundNode.right - VALUE_X_MARGIN;
    valueNode.centerY = valueBackgroundNode.centerY;

    // vertical arrangement of stuff in the meter
    const vBox = new LayoutBox( {
      children: [ new Node( { children: [ valueBackgroundNode, valueNode ] } ), radioButtonGroup ],
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
    detector.body.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // update the value display
    const valueUpdater = () => {
      const value = detector.valueProperty.get();
      if ( value === null ) {
        valueNode.text = NO_VALUE;
        valueNode.centerX = valueBackgroundNode.centerX; // centered
      }
      else {
        if ( detector.modeProperty.get() === ATDetector.Mode.TRANSMITTANCE ) {
          valueNode.text = StringUtils.format( beersLawLabStrings.pattern[ '0percent' ],
            Utils.toFixed( value, TRANSMITTANCE_DECIMAL_PLACES ) );
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
}

/**
 *  The probe portion of the detector
 */
class ATProbeNode extends ProbeNode {

  /**
   * @param {Movable} probe
   * @param {Light} light
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( probe, light, modelViewTransform, options ) {

    options = merge( {
      radius: 53,
      innerRadius: 40,
      handleWidth: 68,
      handleHeight: 60,
      handleCornerRadius: 22,
      lightAngle: 1.25 * Math.PI,
      color: PROBE_COLOR,
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // position
    probe.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // interactivity
    this.cursor = 'pointer';

    const movableDragHandler = new MovableDragHandler( probe.positionProperty, {
      dragBounds: probe.dragBounds,
      modelViewTransform: modelViewTransform,
      endDrag: () => {
        // If the light is on and the probe is close enough to the beam...
        if ( light.onProperty.get() && ( probe.positionProperty.get().x >= light.position.x ) && ( Math.abs( probe.positionProperty.get().y - light.position.y ) <= 0.5 * light.lensDiameter ) ) {
          // ... snap the probe to the center of beam.
          probe.positionProperty.set( new Vector2( probe.positionProperty.get().x, light.position.y ) );
        }
      },
      tandem: options.tandem.createTandem( 'movableDragHandler' )
    } );
    this.addInputListener( movableDragHandler );

    // touch area
    this.touchArea = this.localBounds.dilatedXY( 0.25 * this.width, 0 );
  }
}

/**
 * Wire that connects the body and probe
 */
class WireNode extends Path {

  /**
   * @param {Movable} body
   * @param {Movable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   * @param {Object} [options]
   */
  constructor( body, probe, bodyNode, probeNode, options ) {

    options = merge( {
      stroke: 'gray',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false
    }, options );

    super( new Shape(), options );

    const updateCurve = () => {

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
      this.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    body.positionProperty.link( updateCurve );
    probe.positionProperty.link( updateCurve );
  }
}

beersLawLab.register( 'ATDetectorNode', ATDetectorNode );
export default ATDetectorNode;