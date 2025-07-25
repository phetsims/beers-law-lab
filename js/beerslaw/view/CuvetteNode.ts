// Copyright 2013-2025, University of Colorado Boulder

/**
 * Visual representation of the cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawSolution from '../model/BeersLawSolution.js';
import Cuvette from '../model/Cuvette.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLColors from '../../common/BLLColors.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BLLConstants from '../../common/BLLConstants.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';

const PERCENT_FULL = 0.92;
const SOLUTION_ALPHA = 0.6;
const ARROW_LENGTH = 110;
const ARROW_HEAD_HEIGHT = 38;
const ARROW_HEAD_WIDTH = 45;
const ARROW_TAIL_WIDTH = 23;

type SelfOptions = EmptySelfOptions;

type CuvetteNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class CuvetteNode extends Node {

  public constructor( cuvette: Cuvette,
                      solutionProperty: Property<BeersLawSolution>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: CuvetteNodeOptions ) {

    const options = optionize<CuvetteNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    const cuvetteNode = new Path( null, {
      stroke: 'black',
      lineWidth: 3,
      pickable: false
    } );

    const solutionNode = new Rectangle( 0, 0, 1, 1, {
      stroke: BLLColors.solutionStrokeProperty,
      lineWidth: 0.5,
      pickable: false
    } );

    const arrowNode = new CuvetteArrowNode( options.tandem.createTandem( 'arrowNode' ) );

    // rendering order
    this.children = [ solutionNode, cuvetteNode, arrowNode ];

    // when the cuvette width changes ...
    cuvette.widthProperty.link( () => {
      const width = modelViewTransform.modelToViewDeltaX( cuvette.widthProperty.value );
      const height = modelViewTransform.modelToViewDeltaY( cuvette.height );
      cuvetteNode.setShape( new Shape().moveTo( 0, 0 ).lineTo( 0, height ).lineTo( width, height ).lineTo( width, 0 ) );
      solutionNode.setRect( 0, 0, width, PERCENT_FULL * height );
      solutionNode.left = cuvetteNode.left;
      solutionNode.bottom = cuvetteNode.bottom;
      arrowNode.x = cuvetteNode.right;
      arrowNode.bottom = cuvetteNode.bottom - 10;
    } );

    // when the fluid color changes ...
    const colorObserver = ( color: Color ) => {
      solutionNode.fill = color.withAlpha( SOLUTION_ALPHA );
    };

    // when the solution changes, rewire the color observer
    solutionProperty.link( ( newSolution, oldSolution ) => {
      if ( oldSolution ) {
        oldSolution.fluidColorProperty.unlink( colorObserver );
      }
      newSolution.fluidColorProperty.link( colorObserver );
    } );

    arrowNode.addInputListener( new CuvetteDragListener( cuvette, modelViewTransform,
      arrowNode, options.tandem.createTandem( 'cuvetteDragListener' ) ) );

    arrowNode.addInputListener( new SoundKeyboardDragListener( {
      transform: modelViewTransform,
      drag: ( event, listener ) => {
        // To support all arrow keys and WASD keys, use the modelDelta component that is non-zero.
        const delta = ( listener.modelDelta.x !== 0 ) ? listener.modelDelta.x : listener.modelDelta.y;
        const newWidth = cuvette.widthProperty.value + delta;
        cuvette.widthProperty.value = clamp( newWidth, cuvette.widthProperty.range.min, cuvette.widthProperty.range.max );
      },
      dragSpeed: 300,
      shiftDragSpeed: 20,
      tandem: options.tandem.createTandem( 'cuvetteKeyboardDragListener' )
    } ) );

    // position of the cuvette
    const position = modelViewTransform.modelToViewPosition( cuvette.position );
    this.x = position.x;
    this.y = position.y;

    this.addLinkedElement( cuvette );
  }
}

/**
 * Drag listener that is attached to the cuvette's handle.
 */
class CuvetteDragListener extends SoundDragListener {

  public constructor( cuvette: Cuvette, modelViewTransform: ModelViewTransform2, arrowNode: CuvetteArrowNode, tandem: Tandem ) {

    const widthRange = cuvette.widthProperty.range;

    let startX: number; // x coordinate of mouse click
    let startWidth: number; // width of the cuvette when the drag started

    super( {

      isDisposable: false,
      allowTouchSnag: true,

      start: event => {
        startX = event.pointer.point.x;
        startWidth = cuvette.widthProperty.value;
      },

      drag: event => {
        const dragX = event.pointer.point.x;
        const deltaWidth = modelViewTransform.viewToModelDeltaX( dragX - startX );
        cuvette.widthProperty.value = clamp( startWidth + deltaWidth, widthRange.min, widthRange.max );
        arrowNode.addAccessibleObjectResponse( StringUtils.format(
          BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ].value,
          // value
          toFixed( cuvette.widthProperty.value, BLLConstants.DECIMAL_PLACES_CUVETTE_WIDTH ),
          // units, singular or plural
          ( cuvette.widthProperty.value === 1 ) ?
          BeersLawLabStrings.a11y.unitsDescription.centimeterStringProperty.value :
          BeersLawLabStrings.a11y.unitsDescription.centimetersStringProperty.value
        ) );
      },

      end: () => {
        const snapInterval = cuvette.snapIntervalProperty.value;
        if ( snapInterval > 0 ) {
          cuvette.widthProperty.value = roundToInterval( cuvette.widthProperty.value, snapInterval );
        }
      },

      // phet-io
      tandem: tandem
    } );
  }
}

class CuvetteArrowNode extends InteractiveHighlighting( ArrowNode ) {

  public constructor( tandem: Tandem ) {

    super( -ARROW_LENGTH / 2, 0, ARROW_LENGTH / 2, 0, {
      cursor: 'pointer',
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH,
      headHeight: ARROW_HEAD_HEIGHT,
      doubleHead: true,
      fill: BLLColors.cuvetteArrowFillProperty,
      stroke: 'black',
      lineWidth: 1,
      tagName: 'div',
      focusable: true,
      accessibleName: BeersLawLabStrings.a11y.cuvetteArrowNode.accessibleNameStringProperty,
      accessibleHelpText: BeersLawLabStrings.a11y.cuvetteArrowNode.accessibleHelpTextStringProperty,
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    // Highlight when the pointer is over the arrow.
    const pressListener = new PressListener( {
      attach: false,
      tandem: Tandem.OPT_OUT
    } );
    this.addInputListener( pressListener );
    pressListener.isHighlightedProperty.link( isHighlighted => {
      this.fill = isHighlighted ? BLLColors.cuvetteArrowHighlightColorProperty : BLLColors.cuvetteArrowFillProperty;
    } );

    // Dilate the touch area.
    const dx = 0.25 * this.width;
    const dy = this.height;
    this.touchArea = this.localBounds.dilatedXY( dx, dy );
  }
}

beersLawLab.register( 'CuvetteNode', CuvetteNode );