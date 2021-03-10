// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of the ruler.
 * This is a wrapper around the common-code ruler node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';

// constants
const MAJOR_TICK_WIDTH = 0.5; // in model coordinate frame

class BLLRulerNode extends Node {

  /**
   * @param {Ruler} ruler
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( ruler, modelViewTransform, options ) {

    options = merge( {
      cursor: 'pointer',
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

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
    this.addChild( new RulerNode( width, height, majorTickWidth, majorTickLabels, beersLawLabStrings.units.centimeters, {
      minorTicksPerMajorTick: 4,
      insetsWidth: 0,
      tandem: options.tandem.createTandem( 'ruler' )
    } ) );

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

    this.addInputListener( new DragListener( {
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: new Property( ruler.dragBounds ),
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );
  }
}

beersLawLab.register( 'BLLRulerNode', BLLRulerNode );
export default BLLRulerNode;