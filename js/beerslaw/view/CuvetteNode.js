// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of the cuvette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import FillHighlightListener from '../../../../scenery-phet/js/input/FillHighlightListener.js';
import SimpleDragHandler from '../../../../scenery/js/input/SimpleDragHandler.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import beersLawLab from '../../beersLawLab.js';

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
   * @param {Tandem} tandem
   */
  constructor( cuvette, solutionProperty, modelViewTransform, snapInterval, tandem ) {

    // nodes
    const cuvetteNode = new Path( null, { stroke: 'black', lineWidth: 3 } );
    const solutionNode = new Rectangle( 0, 0, 1, 1, { lineWidth: 0.5 } );
    const arrowNode = new ArrowNode( -ARROW_LENGTH / 2, 0, ARROW_LENGTH / 2, 0, {
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH,
      headHeight: ARROW_HEAD_HEIGHT,
      doubleHead: true,
      fill: ARROW_FILL,
      stroke: 'black',
      lineWidth: 1,
      tandem: tandem.createTandem( 'arrowNode' )
    } );

    super( { tandem: tandem } );

    // rendering order
    this.addChild( solutionNode );
    this.addChild( cuvetteNode );
    this.addChild( arrowNode );

    // when the cuvette width changes ...
    cuvette.widthProperty.link( () => {
      const width = modelViewTransform.modelToViewDeltaX( cuvette.widthProperty.get() );
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

    // interactivity
    cuvetteNode.pickable = false;
    solutionNode.pickable = false;
    arrowNode.cursor = 'pointer';
    arrowNode.addInputListener( new FillHighlightListener( ARROW_FILL, ARROW_FILL.brighterColor() ) );

    const cuvetteDragHandler = new CuvetteDragHandler( cuvette, modelViewTransform, snapInterval,
      tandem.createTandem( 'cuvetteDragHandler' ) );
    arrowNode.addInputListener( cuvetteDragHandler );

    // adjust touch area for the arrow
    const dx = 0.25 * arrowNode.width;
    const dy = 1 * arrowNode.height;
    arrowNode.touchArea = arrowNode.localBounds.dilatedXY( dx, dy );

    // position of the cuvette
    const position = modelViewTransform.modelToViewPosition( cuvette.position );
    this.x = position.x;
    this.y = position.y;
  }
}

beersLawLab.register( 'CuvetteNode', CuvetteNode );

/**
 * Drag handler that is attached to the cuvette's handle.
 */
class CuvetteDragHandler extends SimpleDragHandler {

  /**
   * @param {Cuvette} cuvette
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} snapInterval
   * @param {Tandem} tandem
   */
  constructor( cuvette, modelViewTransform, snapInterval, tandem ) {

    let startX; // x coordinate of mouse click
    let startWidth; // width of the cuvette when the drag started

    super( {

      tandem: tandem,
      allowTouchSnag: true,

      start: event => {
        startX = event.pointer.point.x;
        startWidth = cuvette.widthProperty.get();
      },

      drag: event => {
        const dragX = event.pointer.point.x;
        const deltaWidth = modelViewTransform.viewToModelDeltaX( dragX - startX );
        const cuvetteWidth = Utils.clamp( startWidth + deltaWidth, cuvette.widthRange.min, cuvette.widthRange.max );

        cuvette.widthProperty.set( cuvetteWidth );
      },

      end: () => {

        // snapInterval can be customized via query parameter
        if ( snapInterval > 0 ) {
          const numberOfIntervals = Math.floor( ( cuvette.widthProperty.get() + ( snapInterval / 2 ) ) / snapInterval );
          const newWidth = numberOfIntervals * snapInterval;
          cuvette.widthProperty.set( newWidth );
        }
      }
    } );
  }
}

export default CuvetteNode;