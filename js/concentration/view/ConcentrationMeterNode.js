// Copyright 2013-2020, University of Colorado Boulder

/**
 * Concentration meter, with probe.
 * The probe registers the concentration of all possible fluids that it may contact, including:
 *
 * - solution in the beaker
 * - output of the solvent faucet
 * - output of the drain faucet
 * - output of the dropper
 *
 * Rather than trying to model the shapes of all of these fluids, we handle 'probe is in fluid'
 * herein via intersection of node shapes.
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
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import BLLQueryParameters from '../../common/BLLQueryParameters.js';

// constants
const BODY_IS_DRAGGABLE = true;
const DECIMAL_PLACES_MOLES_PER_LITER = 3;
const DECIMAL_PLACES_PERCENT = 1;
const READOUT_NO_VALUE = MathSymbols.NO_VALUE; // displayed in the readout when the meter is not measuring anything
const BODY_X_MARGIN = 15;
const BODY_Y_MARGIN = 15;
const READOUT_X_MARGIN = 15;
const READOUT_Y_MARGIN = 4;
const PROBE_COLOR = 'rgb( 135, 4, 72 )';
const DISPLAY_MOLES_PER_LITER = ( BLLQueryParameters.concentrationMeterUnits === 'molesPerLiter' );
const MIN_VALUE_SIZE = new Dimension2( 140, 35 );
const MIN_BODY_SIZE = new Dimension2( 170, 100 );

class ConcentrationMeterNode extends Node {

  /**
   * @param {ConcentrationMeter} meter
   * @param {ConcentrationSolution} solution
   * @param {Dropper} dropper
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( meter, solution, dropper, solutionNode, stockSolutionNode, solventFluidNode,
               drainFluidNode, modelViewTransform, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    const bodyNode = new BodyNode( meter, modelViewTransform, {
      tandem: options.tandem.createTandem( 'bodyNode' )
    } );
    const probeNode = new ConcentrationProbeNode( meter.probe, modelViewTransform, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, {
      tandem: options.tandem.createTandem( 'probeNode' )
    } );
    const wireNode = new WireNode( meter.body, meter.probe, bodyNode, probeNode );

    // rendering order
    this.addChild( wireNode );
    this.addChild( bodyNode );
    this.addChild( probeNode );

    const updateValue = () => {
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        meter.valueProperty.set( DISPLAY_MOLES_PER_LITER ?
                                 solution.concentrationProperty.get() :
                                 solution.percentConcentrationProperty.get() );
      }
      else if ( probeNode.isInSolvent() ) {
        meter.valueProperty.set( 0 );
      }
      else if ( probeNode.isInStockSolution() ) {
        meter.valueProperty.set( DISPLAY_MOLES_PER_LITER ?
                                 dropper.soluteProperty.get().stockSolutionConcentration :
                                 dropper.soluteProperty.get().stockSolutionPercentConcentration );
      }
      else {
        meter.valueProperty.set( null );
      }
    };

    meter.probe.positionProperty.link( updateValue );
    solution.soluteProperty.link( updateValue );
    if ( DISPLAY_MOLES_PER_LITER ) {
      solution.concentrationProperty.link( updateValue );
    }
    else {
      solution.percentConcentrationProperty.link( updateValue );
    }
    solutionNode.boundsProperty.lazyLink( updateValue );
    stockSolutionNode.boundsProperty.lazyLink( updateValue );
    solventFluidNode.boundsProperty.lazyLink( updateValue );
    drainFluidNode.boundsProperty.lazyLink( updateValue );
  }
}

/**
 * Meter body, origin at upper left. Note that while the body is a Movable, we have currently decided not to
 * allow it to be moved, so it has no drag handler.
 */
class BodyNode extends Node {

  /**
   * @param {ConcentrationMeter} meter
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( meter, modelViewTransform, options ) {

    options = merge( {
      cursor: 'pointer',
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    const maxTextWidth = 225; // constrain text width for i18n, determined empirically

    // title
    const titleNode = new Text( beersLawLabStrings.concentration,
      { font: new PhetFont( 18 ), fill: 'white', maxWidth: maxTextWidth } );

    // readout for the value + units
    const formattedText = StringUtils.format(
      beersLawLabStrings.pattern[ '0value' ][ '1units' ],
      Utils.toFixed( 1, DECIMAL_PLACES_MOLES_PER_LITER ),
      beersLawLabStrings.units.molesPerLiter
    );
    const readoutTextNode = new Text( formattedText, {
      font: new PhetFont( 24 ),
      fill: 'black',
      maxWidth: maxTextWidth,
      tandem: options.tandem.createTandem( 'readoutTextNode' )
    } );
    const readoutWidth = Math.max( MIN_VALUE_SIZE.width, Math.max( titleNode.width, readoutTextNode.width ) + ( 2 * READOUT_X_MARGIN ) );
    const readoutHeight = Math.max( MIN_VALUE_SIZE.height, readoutTextNode.height + ( 2 * READOUT_Y_MARGIN ) );
    const readoutBackgroundNode = new ShadedRectangle( new Bounds2( 0, 0, readoutWidth, readoutHeight ), {
      baseColor: 'white',
      lightSource: 'rightBottom'
    } );
    readoutTextNode.right = readoutBackgroundNode.right - READOUT_X_MARGIN;
    readoutTextNode.centerY = readoutBackgroundNode.centerY;

    // vertical arrangement of stuff in the meter
    const vBox = new LayoutBox( {
      children: [ titleNode, new Node( { children: [ readoutBackgroundNode, readoutTextNode ] } ) ],
      orientation: 'vertical',
      align: 'center',
      spacing: 18
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

    if ( BODY_IS_DRAGGABLE ) {
      const movableDragHandler = new MovableDragHandler( meter.body.positionProperty, {
        dragBounds: meter.body.dragBounds,
        modelViewTransform: modelViewTransform,
        tandem: options.tandem.createTandem( 'movableDragHandler' )
      } );
      this.addInputListener( movableDragHandler );
    }

    // body position
    meter.body.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // when the value changes, update the readout
    meter.valueProperty.link( value => {

      if ( value === null ) {
        readoutTextNode.setText( READOUT_NO_VALUE );
        readoutTextNode.centerX = readoutBackgroundNode.centerX; // center justified
      }
      else {

        // display concentration as 'mol/L' or '%', see beers-law-lab#149
        let readoutText = null;
        if ( DISPLAY_MOLES_PER_LITER ) {
          readoutText = StringUtils.format( beersLawLabStrings.pattern[ '0value' ][ '1units' ],
            Utils.toFixed( value, DECIMAL_PLACES_MOLES_PER_LITER ), beersLawLabStrings.units.molesPerLiter );
        }
        else {
          readoutText = StringUtils.format( beersLawLabStrings.pattern[ '0percent' ],
            Utils.toFixed( value, DECIMAL_PLACES_PERCENT ) );
        }
        readoutTextNode.setText( readoutText );
        readoutTextNode.right = readoutBackgroundNode.right - READOUT_X_MARGIN; // right justified
      }
      readoutTextNode.centerY = readoutBackgroundNode.centerY;
    } );
  }
}

/**
 * Meter probe, origin at center of crosshairs.
 */
class ConcentrationProbeNode extends ProbeNode {

  /**
   * @param {Movable} probe
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @param {Object} [options]
   */
  constructor( probe, modelViewTransform, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, options ) {

    options = merge( {
      sensorTypeFunction: ProbeNode.crosshairs( {
        intersectionRadius: 6
      } ),
      radius: 34,
      innerRadius: 26,
      handleWidth: 30,
      handleHeight: 25,
      handleCornerRadius: 12,
      lightAngle: 1.75 * Math.PI,
      color: PROBE_COLOR,
      rotation: -Math.PI / 2,
      cursor: 'pointer',
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // probe position
    probe.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // touch area
    this.touchArea = this.localBounds.dilatedXY( 0.25 * this.width, 0.25 * this.height );

    // drag handler
    const movableDragHandler = new MovableDragHandler( probe.positionProperty, {
      tandem: options.tandem.createTandem( 'movableDragHandler' ),
      dragBounds: probe.dragBounds,
      modelViewTransform: modelViewTransform
    } );
    this.addInputListener( movableDragHandler );

    const isInNode = node => {
      const localPoint = node.parentToLocalPoint( probe.positionProperty.get() );
      const nodeShape = node.getShape();
      const shapeBounds = nodeShape.bounds;
      return shapeBounds.getWidth() > 0 && shapeBounds.getHeight() > 0 && nodeShape.containsPoint( localPoint ); // see issue #65
    };

    // @public
    this.isInSolution = () => isInNode( solutionNode );
    this.isInSolvent = () => isInNode( solventFluidNode );
    this.isInDrainFluid = () => isInNode( drainFluidNode );
    this.isInStockSolution = () => isInNode( stockSolutionNode );
  }
}

class WireNode extends Path {

  /**
   * Wire that connects the body and probe.
   * @param {Movable} body
   * @param {Movable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   */
  constructor( body, probe, bodyNode, probeNode ) {

    const options = {
      stroke: 'gray',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false // no need to drag the wire, and we don't want to do cubic-curve intersection here, or have it get in the way
    };

    super( new Shape(), options );

    const updateCurve = () => {

      // Connect bottom-center of body to right-center of probe.
      const bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom - 10 );
      const probeConnectionPoint = new Vector2( probeNode.right, probeNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      const c1Offset = new Vector2( 0, Utils.linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      const c2Offset = new Vector2( 50, 0 );
      const c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      const c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      this.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    body.positionProperty.link( updateCurve );
    probe.positionProperty.link( updateCurve );
  }
}

beersLawLab.register( 'ConcentrationMeterNode', ConcentrationMeterNode );
export default ConcentrationMeterNode;