// Copyright 2013-2022, University of Colorado Boulder

/**
 * Visual representation of the cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Color, DragListener, Node, Path, PressListener, Rectangle } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import Cuvette from '../model/Cuvette.js';

// constants
const PERCENT_FULL = 0.92;
const SOLUTION_ALPHA = 0.6;
const ARROW_LENGTH = 110;
const ARROW_HEAD_HEIGHT = 38;
const ARROW_HEAD_WIDTH = 45;
const ARROW_TAIL_WIDTH = 23;
const ARROW_FILL = Color.ORANGE;

class CuvetteNode extends Node {

  /**
   * @param {Cuvette} cuvette
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} snapInterval
   * @param {Object} [options]
   */
  constructor( cuvette, solutionProperty, modelViewTransform, snapInterval, options ) {
    assert && assert( cuvette instanceof Cuvette );
    assert && assert( solutionProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );
    assert && assert( typeof snapInterval === 'number' );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    const cuvetteNode = new Path( null, {
      stroke: 'black',
      lineWidth: 3,
      pickable: false
    } );

    const solutionNode = new Rectangle( 0, 0, 1, 1, {
      lineWidth: 0.5,
      pickable: false
    } );

    const arrowNode = new ArrowNode( -ARROW_LENGTH / 2, 0, ARROW_LENGTH / 2, 0, {
      cursor: 'pointer',
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH,
      headHeight: ARROW_HEAD_HEIGHT,
      doubleHead: true,
      fill: ARROW_FILL,
      stroke: 'black',
      lineWidth: 1,
      tandem: options.tandem.createTandem( 'arrowNode' )
    } );

    // rendering order
    this.addChild( solutionNode );
    this.addChild( cuvetteNode );
    this.addChild( arrowNode );

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
    const colorObserver = color => {
      solutionNode.fill = color.withAlpha( SOLUTION_ALPHA );
      solutionNode.stroke = color.darkerColor();
    };

    // when the solution changes, rewire the color observer
    solutionProperty.link( ( newSolution, oldSolution ) => {
      if ( oldSolution ) {
        oldSolution.fluidColorProperty.unlink( colorObserver );
      }
      newSolution.fluidColorProperty.link( colorObserver );
    } );

    // Highlight the arrow
    const pressListener = new PressListener( {
      attach: false,
      tandem: Tandem.OPT_OUT
    } );
    arrowNode.addInputListener( pressListener );
    pressListener.isHighlightedProperty.link( isHighlighted => {
      arrowNode.fill = isHighlighted ? ARROW_FILL.brighterColor() : ARROW_FILL;
    } );

    const cuvetteDragListener = new CuvetteDragListener( cuvette, modelViewTransform, snapInterval, {
      tandem: options.tandem.createTandem( 'cuvetteDragListener' )
    } );
    arrowNode.addInputListener( cuvetteDragListener );

    // adjust touch area for the arrow
    const dx = 0.25 * arrowNode.width;
    const dy = arrowNode.height;
    arrowNode.touchArea = arrowNode.localBounds.dilatedXY( dx, dy );

    // position of the cuvette
    const position = modelViewTransform.modelToViewPosition( cuvette.position );
    this.x = position.x;
    this.y = position.y;

    this.addLinkedElement( cuvette, {
      tandem: options.tandem.createTandem( 'cuvette' )
    } );
  }
}

/**
 * Drag listener that is attached to the cuvette's handle.
 */
class CuvetteDragListener extends DragListener {

  /**
   * @param {Cuvette} cuvette
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} snapInterval
   * @param {Object} [options]
   */
  constructor( cuvette, modelViewTransform, snapInterval, options ) {
    assert && assert( cuvette instanceof Cuvette );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );
    assert && assert( typeof snapInterval === 'number' );

    const widthRange = cuvette.widthProperty.range;
    let startX; // x coordinate of mouse click
    let startWidth; // width of the cuvette when the drag started

    super( merge( {

      allowTouchSnag: true,

      start: event => {
        startX = event.pointer.point.x;
        startWidth = cuvette.widthProperty.value;
      },

      drag: event => {
        const dragX = event.pointer.point.x;
        const deltaWidth = modelViewTransform.viewToModelDeltaX( dragX - startX );
        cuvette.widthProperty.value = Utils.clamp( startWidth + deltaWidth, widthRange.min, widthRange.max );
      },

      end: () => {

        // snapInterval can be customized via query parameter
        if ( snapInterval > 0 ) {
          const numberOfIntervals = Math.floor( ( cuvette.widthProperty.value + ( snapInterval / 2 ) ) / snapInterval );
          cuvette.widthProperty.value = numberOfIntervals * snapInterval;
        }
      },

      // phet-io
      tandem: Tandem.REQUIRED
    }, options ) );
  }
}

beersLawLab.register( 'CuvetteNode', CuvetteNode );
export default CuvetteNode;