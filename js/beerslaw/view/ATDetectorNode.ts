// Copyright 2013-2023, University of Colorado Boulder

/**
 * Detector for absorbance (A) and percent transmittance (%T).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import { DragListener, Node, NodeOptions, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLConstants from '../../common/BLLConstants.js';
import BLLMovable from '../../common/model/BLLMovable.js';
import ATDetector from '../model/ATDetector.js';
import ATDetectorMode from '../model/ATDetectorMode.js';
import Light from '../model/Light.js';

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

type SelfOptions = EmptySelfOptions;

type ATDetectorNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ATDetectorNode extends Node {

  public constructor( detector: ATDetector, light: Light, modelViewTransform: ModelViewTransform2,
                      providedOptions: ATDetectorNodeOptions ) {

    super( providedOptions );

    const bodyNode = new BodyNode( detector, modelViewTransform, {
      tandem: providedOptions.tandem.createTandem( 'bodyNode' )
    } );

    const probeNode = new ATProbeNode( detector.probe, light, modelViewTransform, {
      tandem: providedOptions.tandem.createTandem( 'probeNode' )
    } );

    const wireNode = new WireNode( detector.body, detector.probe, bodyNode, probeNode );

    this.children = [ wireNode, bodyNode, probeNode ];

    this.addLinkedElement( detector, {
      tandem: providedOptions.tandem.createTandem( 'detector' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * The body of the detector, where A and T values are displayed. Note that while the body is a BLLMovable,
 * we have currently decided not to allow it to be moved, so it has no drag handler
 */
type BodyNodeSelfOptions = EmptySelfOptions;
type BodyNodeOptions = BodyNodeSelfOptions & PickRequired<NodeOptions, 'tandem'>;

class BodyNode extends Node {

  public constructor( detector: ATDetector, modelViewTransform: ModelViewTransform2, providedOptions: BodyNodeOptions ) {

    const options = optionize<BodyNodeOptions, BodyNodeSelfOptions, NodeOptions>()( {

      // NodeOptions
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    function createRadioButtonLabel( text: TReadOnlyProperty<string>, radioButtonTandem: Tandem ): Node {
      return new Text( text, {
        font: new PhetFont( 18 ),
        fill: 'white',
        maxWidth: 120,
        tandem: radioButtonTandem.createTandem( 'labelText' ),
        phetioVisiblePropertyInstrumented: false
      } );
    }

    // radio button descriptions
    const radioButtonItems: AquaRadioButtonGroupItem<ATDetectorMode>[] = [
      {
        value: ATDetectorMode.TRANSMITTANCE,
        createNode: tandem => createRadioButtonLabel( BeersLawLabStrings.transmittanceStringProperty, tandem ),
        tandemName: 'transmittanceRadioButton'
      },
      {
        value: ATDetectorMode.ABSORBANCE,
        createNode: tandem => createRadioButtonLabel( BeersLawLabStrings.absorbanceStringProperty, tandem ),
        tandemName: 'absorbanceRadioButton'
      }
    ];

    // radio button group
    const radioButtonGroup = new AquaRadioButtonGroup( detector.modeProperty, radioButtonItems, {
      radioButtonOptions: {
        radius: BLLConstants.RADIO_BUTTON_RADIUS
      },
      orientation: 'vertical',
      align: 'left',
      spacing: 15,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    const valueTextTandem = options.tandem.createTandem( 'valueText' );

    // value + units
    const valueStringProperty = new DerivedProperty(
      [
        BeersLawLabStrings.pattern[ '0percentStringProperty' ],
        detector.modeProperty,
        detector.absorbanceProperty,
        detector.transmittanceProperty
      ],
      ( pattern, mode, absorbance, transmittance ) => {
        let valueString: string;
        if ( mode === ATDetectorMode.TRANSMITTANCE ) {
          valueString = ( transmittance === null ) ?
                        NO_VALUE :
                        StringUtils.format( pattern, Utils.toFixed( 100 * transmittance, TRANSMITTANCE_DECIMAL_PLACES ) );
        }
        else {
          valueString = ( absorbance === null ) ?
                        NO_VALUE :
                        Utils.toFixed( absorbance, ABSORBANCE_DECIMAL_PLACES );
        }
        return valueString;
      }, {
        tandem: valueTextTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
        phetioValueType: StringIO
      } );

    const valueText = new Text( valueStringProperty, {
      font: new PhetFont( 22 ),
      maxWidth: 125,
      tandem: valueTextTandem
    } );

    // background behind the value
    const backgroundWidth = Math.max( MIN_VALUE_SIZE.width, Math.max( radioButtonGroup.width, valueText.width ) + ( 2 * VALUE_X_MARGIN ) );
    const backgroundHeight = Math.max( MIN_VALUE_SIZE.height, valueText.height + ( 2 * VALUE_Y_MARGIN ) );
    const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0, backgroundWidth, backgroundHeight ), {
      baseColor: 'white',
      lightSource: 'rightBottom'
    } );

    // vertical arrangement of stuff in the meter
    const vBox = new VBox( {
      children: [ new Node( { children: [ backgroundNode, valueText ] } ), radioButtonGroup ],
      align: 'left',
      spacing: 12
    } );

    // meter body
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
    detector.body.positionProperty.link( ( position: Vector2 ) => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    valueText.boundsProperty.link( bounds => {
      if ( valueStringProperty.value === NO_VALUE ) {
        // centered
        valueText.centerX = backgroundNode.centerX;
      }
      else {
        // right justified
        valueText.right = backgroundNode.right - VALUE_X_MARGIN;
      }
      valueText.centerY = backgroundNode.centerY;
    } );
  }
}

/**
 *  The probe portion of the detector
 */
type ATProbeNodeSelfOptions = EmptySelfOptions;
type ATProbeNodeOptions = ATProbeNodeSelfOptions & PickRequired<ProbeNodeOptions, 'tandem'>;

class ATProbeNode extends ProbeNode {

  public constructor( probe: BLLMovable, light: Light, modelViewTransform: ModelViewTransform2, providedOptions: ATProbeNodeOptions ) {

    const options = optionize<ATProbeNodeOptions, ATProbeNodeSelfOptions, ProbeNodeOptions>()( {
      cursor: 'pointer',
      radius: 53,
      innerRadius: 40,
      handleWidth: 68,
      handleHeight: 60,
      handleCornerRadius: 22,
      lightAngle: 1.25 * Math.PI,
      color: PROBE_COLOR,
      phetioInputEnabledPropertyInstrumented: true,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    // position
    probe.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    this.addInputListener( new DragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: new Property( probe.dragBounds ),
      transform: modelViewTransform,
      end: () => {
        // If the light is on and the probe is close enough to the beam, snap the probe to the center of beam.
        if ( light.isOnProperty.value &&
             ( probe.positionProperty.value.x >= light.position.x ) &&
             ( Math.abs( probe.positionProperty.value.y - light.position.y ) <= 0.5 * light.lensDiameter ) ) {
          probe.positionProperty.value = new Vector2( probe.positionProperty.value.x, light.position.y );
        }
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // touch area
    this.touchArea = this.localBounds.dilatedXY( 0.25 * this.width, 0 );
  }
}

/**
 * Wire that connects the body and probe
 */
class WireNode extends Path {

  public constructor( body: BLLMovable, probe: BLLMovable, bodyNode: Node, probeNode: Node ) {

    super( new Shape(), {

      // PathOptions
      stroke: 'gray',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false
    } );

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