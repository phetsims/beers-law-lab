// Copyright 2013-2022, University of Colorado Boulder

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, DragListener, Image, Node, NodeOptions, RichText } from '../../../../scenery/js/imports.js';
import shaker_png from '../../../images/shaker_png.js';
import beersLawLab from '../../beersLawLab.js';
import Shaker from '../model/Shaker.js';

// constants
const DEBUG_ORIGIN = false;

type SelfOptions = EmptySelfOptions;

type ShakerNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ShakerNode extends Node {

  public constructor( shaker: Shaker, soluteLabelStringProperty: TReadOnlyProperty<string>,
                      modelViewTransform: ModelViewTransform2, providedOptions: ShakerNodeOptions ) {

    const options = optionize<ShakerNodeOptions, SelfOptions, NodeOptions>()( {

      // Performance optimization so Scenery won't fit blocks around this.
      // See https://github.com/phetsims/beers-law-lab/issues/113
      preventFit: true,

      visibleProperty: shaker.visibleProperty,
      cursor: 'pointer',
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    // shaker image
    const imageNode = new Image( shaker_png );
    imageNode.setScaleMagnitude( 0.75 );

    // label
    const labelText = new RichText( soluteLabelStringProperty, {
      font: new PhetFont( { size: 22, weight: 'bold' } ),
      fill: 'black',
      maxWidth: 0.5 * imageNode.width, // constrain width for i18n
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    // common parent, to simplify rotation and label alignment.
    const parentNode = new Node( { children: [ imageNode, labelText ] } );
    this.addChild( parentNode );
    parentNode.rotate( shaker.orientation - Math.PI ); // assumes that shaker points to the left in the image file

    // Manually adjust these values until the origin is in the middle hole of the shaker.
    parentNode.translate( -12, -imageNode.height / 2 );

    // origin
    if ( DEBUG_ORIGIN ) {
      this.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    // sync position with model
    shaker.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // Center the label on the shaker.
    labelText.boundsProperty.link( () => {
      const capWidth = 0.3 * imageNode.width; // multiplier is dependent on image file
      labelText.centerX = capWidth + ( imageNode.width - capWidth ) / 2;
      labelText.centerY = imageNode.centerY;
    } );

    // drag listener
    this.addInputListener( new DragListener( {
      positionProperty: shaker.positionProperty,
      dragBoundsProperty: new Property( shaker.dragBounds ),
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    this.addLinkedElement( shaker, {
      tandem: options.tandem.createTandem( 'shaker' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'ShakerNode', ShakerNode );