// Copyright 2013-2025, University of Colorado Boulder

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import shaker_png from '../../../images/shaker_png.js';
import beersLawLab from '../../beersLawLab.js';
import Shaker from '../model/Shaker.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import HighlightFromNode from '../../../../scenery/js/accessibility/HighlightFromNode.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

const DEBUG_ORIGIN = false;

type SelfOptions = EmptySelfOptions;

type ShakerNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ShakerNode extends InteractiveHighlighting( Node ) {

  public constructor( shaker: Shaker,
                      soluteLabelStringProperty: TReadOnlyProperty<string>,
                      soluteDescriptionStringProperty: TReadOnlyProperty<string>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: ShakerNodeOptions ) {

    const options = optionize4<ShakerNodeOptions, SelfOptions, NodeOptions>()( {}, AccessibleDraggableOptions, {

      // Performance optimization so Scenery won't fit blocks around this.
      // See https://github.com/phetsims/beers-law-lab/issues/113
      preventFit: true,

      visibleProperty: shaker.visibleProperty,
      cursor: 'pointer',
      isDisposable: false,
      accessibleName: new PatternStringProperty( BeersLawLabStrings.a11y.shakerNode.accessibleNameStringProperty, {
        soluteName: soluteDescriptionStringProperty
      } ),
      accessibleHelpText: BeersLawLabStrings.a11y.shakerNode.accessibleHelpTextStringProperty,
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
      maxWidth: 0.5 * imageNode.width // constrain width for i18n
    } );

    // Common parent, to simplify rotation and label alignment.
    const parentNode = new Node( {
      children: [ imageNode, labelText ]
    } );
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

    // Create and add focus highlight explicitly, instead of by using InteractiveHighlighting trait, so that it's
    // fitted to the rotated imageNode. This applies for both focus highlight and interactive highlight.
    // See https://github.com/phetsims/beers-law-lab/issues/344.
    this.focusHighlight = new HighlightFromNode( imageNode );

    // drag listener
    this.addInputListener( new SoundDragListener( {
      positionProperty: shaker.positionProperty,
      dragBoundsProperty: new Property( shaker.dragBounds ),
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // keyboard drag listener
    this.addInputListener( new SoundKeyboardDragListener( {
      positionProperty: shaker.positionProperty,
      dragBoundsProperty: new Property( shaker.dragBounds ),
      transform: modelViewTransform,
      dragSpeed: 200,
      shiftDragSpeed: 20,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } ) );

    this.addLinkedElement( shaker );
  }
}

beersLawLab.register( 'ShakerNode', ShakerNode );