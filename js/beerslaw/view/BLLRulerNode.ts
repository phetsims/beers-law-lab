// Copyright 2013-2025, University of Colorado Boulder

/**
 * Visual representation of the ruler.
 * This is a wrapper around the common-code ruler node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import RulerNode, { RulerNodeOptions } from '../../../../scenery-phet/js/RulerNode.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Ruler from '../model/Ruler.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';

const MAJOR_TICK_WIDTH = 0.5; // in model coordinate frame

type SelfOptions = EmptySelfOptions;

type BLLRulerNodeOptions = SelfOptions & PickRequired<RulerNodeOptions, 'tandem'>;

export default class BLLRulerNode extends InteractiveHighlighting( RulerNode ) {

  public constructor( ruler: Ruler, modelViewTransform: ModelViewTransform2, providedOptions: BLLRulerNodeOptions ) {

    const options = optionize<BLLRulerNodeOptions, SelfOptions, RulerNodeOptions>()( {

      //  RulerNodeOptions
      cursor: 'pointer',
      minorTicksPerMajorTick: 4,
      insetsWidth: 0,
      isDisposable: false,
      tagName: 'div',
      focusable: true,
      phetioInputEnabledPropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    // Compute tick labels, 1 major tick for every 0.5 unit of length, labels on the ticks that correspond to integer values.
    const majorTickLabels: string[] = [];
    const numberOfTicks = Math.floor( ruler.length / MAJOR_TICK_WIDTH ) + 1;
    for ( let i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[ i ] = ( i % 2 === 0 ) ? `${i / 2}` : '';
    }

    const width = modelViewTransform.modelToViewDeltaX( ruler.length );
    const height = modelViewTransform.modelToViewDeltaY( ruler.height );
    const majorTickWidth = modelViewTransform.modelToViewDeltaX( MAJOR_TICK_WIDTH );

    super( width, height, majorTickWidth, majorTickLabels, BeersLawLabStrings.units.centimetersStringProperty, options );

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

    this.addInputListener( new SoundDragListener( {
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: new Property( ruler.dragBounds ),
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    this.addLinkedElement( ruler, {
      tandemName: 'ruler'
    } );
  }
}

beersLawLab.register( 'BLLRulerNode', BLLRulerNode );