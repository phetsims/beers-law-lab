// Copyright 2013-2023, University of Colorado Boulder

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
import ConcentrationMeter from '../model/ConcentrationMeter.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import Dropper from '../model/Dropper.js';
import BLLMovable from '../../common/model/BLLMovable.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';
import Multilink from '../../../../axon/js/Multilink.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';

// constants
const DECIMAL_PLACES_MOLES_PER_LITER = 3;
const DECIMAL_PLACES_PERCENT = 1;
const READOUT_NO_VALUE = MathSymbols.NO_VALUE; // displayed in the readout when the meter is not measuring anything
const BODY_X_MARGIN = 15;
const BODY_Y_MARGIN = 15;
const READOUT_X_MARGIN = 5;
const READOUT_Y_MARGIN = 4;
const PROBE_COLOR = 'rgb( 135, 4, 72 )';
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

    const wireNode = new WireNode( concentrationMeter.bodyPosition, concentrationMeter.probe, bodyNode, probeNode );

    // rendering order
    this.addChild( wireNode );
    this.addChild( bodyNode );
    this.addChild( probeNode );

    const updateValue = () => {
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        concentrationMeter.valueProperty.value = ( BLLPreferences.concentrationMeterUnitsProperty.value === 'molesPerLiter' ) ?
                                                 solution.concentrationProperty.value :
                                                 solution.percentConcentrationProperty.value;
      }
      else if ( probeNode.isInSolvent() ) {
        concentrationMeter.valueProperty.value = 0;
      }
      else if ( probeNode.isInStockSolution() ) {
        concentrationMeter.valueProperty.value = ( BLLPreferences.concentrationMeterUnitsProperty.value === 'molesPerLiter' ) ?
                                                 dropper.soluteProperty.value.stockSolutionConcentration :
                                                 dropper.soluteProperty.value.stockSolutionPercentConcentration;
      }
      else {
        concentrationMeter.valueProperty.value = null;
      }
    };

    Multilink.multilink( [
      BLLPreferences.concentrationMeterUnitsProperty,
      concentrationMeter.probe.positionProperty,
      solution.soluteProperty,
      solution.concentrationProperty,
      solution.percentConcentrationProperty,
      solutionNode.boundsProperty,
      stockSolutionNode.boundsProperty,
      solventFluidNode.boundsProperty,
      drainFluidNode.boundsProperty
    ], () => updateValue() );

    this.addLinkedElement( concentrationMeter, {
      tandem: options.tandem.createTandem( 'concentrationMeter' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
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
      phetioVisiblePropertyInstrumented: false
    };

    super( options );

    const labelText = new Text( BeersLawLabStrings.concentrationStringProperty, {
      font: new PhetFont( 18 ),
      fill: 'white',
      maxWidth: 125,
      tandem: tandem.createTandem( 'labelText' )
    } );

    // value + units
    const valueTextTandem = tandem.createTandem( 'valueText' );
    const valueStringProperty = new DerivedProperty(
      [
        BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ],
        BeersLawLabStrings.pattern[ '0percentStringProperty' ],
        concentrationMeter.valueProperty,
        BeersLawLabStrings.units.molesPerLiterStringProperty,
        BLLPreferences.concentrationMeterUnitsProperty
      ],
      ( patternValueUnits, patternValuePercent, value, molesPerLiterString, concentrationMeterUnits ) => {
        let text: string;
        if ( value === null ) {
          text = READOUT_NO_VALUE;
        }
        else {

          // display concentration as 'mol/L' or '%', see beers-law-lab#149
          if ( concentrationMeterUnits === 'molesPerLiter' ) {
            text = StringUtils.format( patternValueUnits, Utils.toFixed( value, DECIMAL_PLACES_MOLES_PER_LITER ), molesPerLiterString );
          }
          else {
            text = StringUtils.format( patternValuePercent, Utils.toFixed( value, DECIMAL_PLACES_PERCENT ) );
          }
        }
        return text;
      }, {
        tandem: valueTextTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
        phetioValueType: StringIO
      } );
    const valueText = new Text( valueStringProperty, {
      font: new PhetFont( 22 ),
      fill: 'black',
      maxWidth: 125,
      tandem: valueTextTandem,
      stringPropertyOptions: { phetioReadOnly: true }
    } );

    // background behind the value
    const backgroundWidth = Math.max( MIN_VALUE_SIZE.width, Math.max( labelText.width, valueText.width ) + ( 2 * READOUT_X_MARGIN ) );
    const backgroundHeight = Math.max( MIN_VALUE_SIZE.height, valueText.height + ( 2 * READOUT_Y_MARGIN ) );
    const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0, backgroundWidth, backgroundHeight ), {
      baseColor: 'white',
      lightSource: 'rightBottom'
    } );

    // vertical arrangement of stuff in the concentrationMeter
    const vBox = new VBox( {
      excludeInvisibleChildrenFromBounds: false,
      children: [ labelText, new Node( { children: [ backgroundNode, valueText ] } ) ],
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

    vBox.boundsProperty.link( bounds => {
      vBox.center = bodyNode.center;
    } );

    this.children = [ bodyNode, vBox ];

    // body position
    this.translation = modelViewTransform.modelToViewPosition( concentrationMeter.bodyPosition );

    // Keep the value properly justified on the background
    valueText.boundsProperty.link( bounds => {
      if ( concentrationMeter.valueProperty.value === null ) {

        // center justified
        valueText.centerX = backgroundNode.centerX;
      }
      else {
        // right justified
        valueText.right = backgroundNode.right - READOUT_X_MARGIN;
      }
      valueText.centerY = backgroundNode.centerY;
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
      phetioVisiblePropertyInstrumented: false
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

  public constructor( bodyPosition: Vector2, probe: BLLMovable, bodyNode: Node, probeNode: Node ) {

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
    probe.positionProperty.link( updateCurve );
  }
}

beersLawLab.register( 'ConcentrationMeterNode', ConcentrationMeterNode );