// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of the ruler.
 * This is a wrapper around the common-code ruler node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import MovableDragHandler from '../../../../scenery-phet/js/input/MovableDragHandler.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import beersLawLabStrings from '../../beers-law-lab-strings.js';
import beersLawLab from '../../beersLawLab.js';

const unitsCentimetersString = beersLawLabStrings.units.centimeters;

// constants
const MAJOR_TICK_WIDTH = 0.5; // in model coordinate frame

class BLLRulerNode extends Node {

  /**
   * @param {Ruler} ruler
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( ruler, modelViewTransform, tandem ) {

    super( { tandem: tandem } );

    // Compute tick labels, 1 major tick for every 0.5 unit of length, labels on the ticks that correspond to integer values.
    const majorTickLabels = [];
    const numberOfTicks = Math.floor( ruler.length / MAJOR_TICK_WIDTH ) + 1;
    for ( let i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[ i ] = ( i % 2 === 0 ) ? ( i / 2 ) : '';
    }

    // use the common ruler node
    const width = modelViewTransform.modelToViewDeltaX( ruler.length );
    const height = modelViewTransform.modelToViewDeltaY( ruler.height );
    const majorTickWidth = modelViewTransform.modelToViewDeltaX( MAJOR_TICK_WIDTH );
    this.addChild( new RulerNode(
      width,
      height,
      majorTickWidth,
      majorTickLabels,
      unitsCentimetersString,
      { minorTicksPerMajorTick: 4, insetsWidth: 0, tandem: tandem.createTandem( 'ruler' ) } )
    );

    // touch area
    const dx = 0.05 * this.width;
    const dy = 0.5 * this.height;
    this.touchArea = Shape.rectangle( -dx, -dy, this.width + dx + dx, this.height + dy + dy );

    // sync with model
    ruler.positionProperty.link( position => {
      const viewPosition = modelViewTransform.modelToViewPosition( position );
      this.x = viewPosition.x;
      this.y = viewPosition.y;
    } );

    // interactivity
    this.cursor = 'pointer';

    // @private (phet-io)
    this.movableDragHandler = new MovableDragHandler( ruler.positionProperty, {
      tandem: tandem.createTandem( 'movableDragHandler' ),
      dragBounds: ruler.dragBounds,
      modelViewTransform: modelViewTransform
    } );
    this.addInputListener( this.movableDragHandler );
  }
}

export default beersLawLab.register( 'BLLRulerNode', BLLRulerNode );