// Copyright 2013-2021, University of Colorado Boulder

/**
 * Visual representation of the ruler.
 * This is a wrapper around the common-code ruler node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import Ruler from '../model/Ruler.js';

// constants
const MAJOR_TICK_WIDTH = 0.5; // in model coordinate frame

class BLLRulerNode extends RulerNode {

  /**
   * @param {Ruler} ruler
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( ruler, modelViewTransform, options ) {
    assert && assert( ruler instanceof Ruler );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      cursor: 'pointer',
      minorTicksPerMajorTick: 4,
      insetsWidth: 0,
      tandem: Tandem.REQUIRED,
      phetioInputEnabledPropertyInstrumented: true
    }, options );

    // Compute tick labels, 1 major tick for every 0.5 unit of length, labels on the ticks that correspond to integer values.
    const majorTickLabels = [];
    const numberOfTicks = Math.floor( ruler.length / MAJOR_TICK_WIDTH ) + 1;
    for ( let i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[ i ] = ( i % 2 === 0 ) ? ( i / 2 ) : '';
    }

    const width = modelViewTransform.modelToViewDeltaX( ruler.length );
    const height = modelViewTransform.modelToViewDeltaY( ruler.height );
    const majorTickWidth = modelViewTransform.modelToViewDeltaX( MAJOR_TICK_WIDTH );

    super( width, height, majorTickWidth, majorTickLabels, beersLawLabStrings.units.centimeters, options );

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

    this.addLinkedElement( ruler, {
      tandem: options.tandem.createTandem( 'ruler' )
    } );
  }
}

beersLawLab.register( 'BLLRulerNode', BLLRulerNode );
export default BLLRulerNode;