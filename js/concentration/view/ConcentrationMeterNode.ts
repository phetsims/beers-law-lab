// Copyright 2013-2022, University of Colorado Boulder

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
 * herein via intersection of Path shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import { DragListener, Node, NodeOptions, Path, PathOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLQueryParameters from '../../common/BLLQueryParameters.js';
import ConcentrationMeter from '../model/ConcentrationMeter.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import Dropper from '../model/Dropper.js';
import BLLMovable from '../../common/model/BLLMovable.js';

// constants
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

type SelfOptions = EmptySelfOptions;

type ConcentrationMeterNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ConcentrationMeterNode extends Node {

  public constructor( concentrationMeter: ConcentrationMeter, solution: ConcentrationSolution, dropper: Dropper,
                      solutionNode: Path, stockSolutionNode: Path, solventFluidNode: Path, drainFluidNode: Path,
                      modelViewTransform: ModelViewTransform2, providedOptions: ConcentrationMeterNodeOptions ) {

    const options = providedOptions;

    super( options );

    const bodyNode = new BodyNode( concentrationMeter, modelViewTransform, options.tandem.createTandem( 'bodyNode' ) );

    const probeNode = new ConcentrationProbeNode( concentrationMeter.probe, modelViewTransform, solutionNode, stockSolutionNode,
      solventFluidNode, drainFluidNode, options.tandem.createTandem( 'probeNode' ) );

    const wireNode = new WireNode( concentrationMeter.body, concentrationMeter.probe, bodyNode, probeNode );

    // rendering order
    this.addChild( wireNode );
    this.addChild( bodyNode );
    this.addChild( probeNode );

    const updateValue = () => {
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        concentrationMeter.valueProperty.value = DISPLAY_MOLES_PER_LITER ?
                                                 solution.concentrationProperty.value :
                                                 solution.percentConcentrationProperty.value;
      }
      else if ( probeNode.isInSolvent() ) {
        concentrationMeter.valueProperty.value = 0;
      }
      else if ( probeNode.isInStockSolution() ) {
        concentrationMeter.valueProperty.value = DISPLAY_MOLES_PER_LITER ?
                                                 dropper.soluteProperty.value.stockSolutionConcentration :
                                                 dropper.soluteProperty.value.stockSolutionPercentConcentration;
      }
      else {
        concentrationMeter.valueProperty.value = null;
      }
    };

    concentrationMeter.probe.positionProperty.link( updateValue );
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

    this.addLinkedElement( concentrationMeter, {
      tandem: options.tandem.createTandem( 'concentrationMeter' )
    } );
  }
}

/**
 * Meter body, origin at upper left. Note that while the body is a BLLMovable, we have currently decided not to
 * allow it to be moved, so it has no drag handler.
 */
class BodyNode extends Node {

  public constructor( concentrationMeter: ConcentrationMeter, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    const options: NodeOptions = {
      cursor: 'pointer',
      tandem: tandem,
      visiblePropertyOptions: { phetioReadOnly: true }
    };

    super( options );

    // title
    const titleNode = new Text( BeersLawLabStrings.concentration, {
      font: new PhetFont( 18 ),
      fill: 'white',
      maxWidth: 150,
      tandem: tandem.createTandem( 'titleNode' )
    } );

    // value + units
    const valueString = StringUtils.format(
      BeersLawLabStrings.pattern[ '0value' ][ '1units' ],
      Utils.toFixed( 1, DECIMAL_PLACES_MOLES_PER_LITER ),
      BeersLawLabStrings.units.molesPerLiter
    );
    const valueNode = new Text( valueString, {
      font: new PhetFont( 24 ),
      fill: 'black',
      maxWidth: 150,
      tandem: tandem.createTandem( 'valueNode' ),
      textPropertyOptions: { phetioReadOnly: true }
    } );

    // background behind the value
    const backgroundWidth = Math.max( MIN_VALUE_SIZE.width, Math.max( titleNode.width, valueNode.width ) + ( 2 * READOUT_X_MARGIN ) );
    const backgroundHeight = Math.max( MIN_VALUE_SIZE.height, valueNode.height + ( 2 * READOUT_Y_MARGIN ) );
    const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0, backgroundWidth, backgroundHeight ), {
      baseColor: 'white',
      lightSource: 'rightBottom'
    } );
    valueNode.right = backgroundNode.right - READOUT_X_MARGIN;
    valueNode.centerY = backgroundNode.centerY;

    // vertical arrangement of stuff in the concentrationMeter
    const vBox = new VBox( {
      excludeInvisibleChildrenFromBounds: false,
      resize: false,
      children: [ titleNode, new Node( { children: [ backgroundNode, valueNode ] } ) ],
      align: 'center',
      spacing: 18
    } );

    // concentrationMeter body
    const bodyWidth = Math.max( MIN_BODY_SIZE.width, vBox.width + ( 2 * BODY_X_MARGIN ) );
    const bodyHeight = Math.max( MIN_BODY_SIZE.height, vBox.height + ( 2 * BODY_Y_MARGIN ) );
    const bodyNode = new ShadedRectangle( new Bounds2( 0, 0, bodyWidth, bodyHeight ), {
      baseColor: PROBE_COLOR,
      lightOffset: 0.95
    } );

    this.addChild( bodyNode );
    this.addChild( vBox );
    vBox.center = bodyNode.center;

    this.addInputListener( new DragListener( {
      positionProperty: concentrationMeter.body.positionProperty,
      dragBoundsProperty: new Property( concentrationMeter.body.dragBounds ),
      transform: modelViewTransform,
      tandem: tandem.createTandem( 'dragListener' )
    } ) );

    // body position
    concentrationMeter.body.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // when the value changes, update the readout
    concentrationMeter.valueProperty.link( value => {

      if ( value === null ) {
        valueNode.text = READOUT_NO_VALUE;
      }
      else {

        // display concentration as 'mol/L' or '%', see beers-law-lab#149
        if ( DISPLAY_MOLES_PER_LITER ) {
          valueNode.text = StringUtils.format( BeersLawLabStrings.pattern[ '0value' ][ '1units' ],
            Utils.toFixed( value, DECIMAL_PLACES_MOLES_PER_LITER ), BeersLawLabStrings.units.molesPerLiter );
        }
        else {
          valueNode.text = StringUtils.format( BeersLawLabStrings.pattern[ '0percent' ],
            Utils.toFixed( value, DECIMAL_PLACES_PERCENT ) );
        }
      }
    } );

    // Keep the value properly justified on the background
    valueNode.boundsProperty.link( bounds => {
      if ( concentrationMeter.valueProperty.value === null ) {

        // center justified
        valueNode.centerX = backgroundNode.centerX;
      }
      else {
        // right justified
        valueNode.right = backgroundNode.right - READOUT_X_MARGIN;
        valueNode.centerY = backgroundNode.centerY;
      }
    } );
  }
}

/**
 * Meter probe, origin at center of crosshairs.
 */
class ConcentrationProbeNode extends ProbeNode {

  public readonly isInSolution: () => boolean;
  public readonly isInSolvent: () => boolean;
  public readonly isInDrainFluid: () => boolean;
  public readonly isInStockSolution: () => boolean;

  public constructor( probe: BLLMovable, modelViewTransform: ModelViewTransform2, solutionNode: Path,
                      stockSolutionNode: Path, solventFluidNode: Path, drainFluidNode: Path,
                      tandem: Tandem ) {

    const options: ProbeNodeOptions = {
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

      // phet-io
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true,
      visiblePropertyOptions: { phetioReadOnly: true }
    };

    super( options );

    // probe position
    probe.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // touch area
    this.touchArea = this.localBounds.dilatedXY( 0.25 * this.width, 0.25 * this.height );

    // drag listener
    this.addInputListener( new DragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: new Property( probe.dragBounds ),
      transform: modelViewTransform,
      tandem: tandem.createTandem( 'dragListener' )
    } ) );

    const isInNode = ( node: Path ) => {
      const localPoint = node.parentToLocalPoint( probe.positionProperty.value );
      const nodeShape = node.getShape()!;
      assert && assert( nodeShape );
      const shapeBounds = nodeShape.bounds;
      return shapeBounds.getWidth() > 0 && shapeBounds.getHeight() > 0 && nodeShape.containsPoint( localPoint ); // see issue #65
    };

    this.isInSolution = () => isInNode( solutionNode );
    this.isInSolvent = () => isInNode( solventFluidNode );
    this.isInDrainFluid = () => isInNode( drainFluidNode );
    this.isInStockSolution = () => isInNode( stockSolutionNode );
  }
}

/**
 * Wire that connects the body and probe.
 */
class WireNode extends Path {

  public constructor( body: BLLMovable, probe: BLLMovable, bodyNode: Node, probeNode: Node ) {

    const options: PathOptions = {
      stroke: 'gray',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',

      // no need to drag the wire, and we don't want to do cubic-curve intersection here, or have it get in the way
      pickable: false
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