// Copyright 2013-2020, University of Colorado Boulder

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import shakerImage from '../../../images/shaker_png.js';
import beersLawLab from '../../beersLawLab.js';
import Shaker from '../model/Shaker.js';

// constants
const DEBUG_ORIGIN = false;
const ARROW_LENGTH = 40;
const ARROW_OPTIONS = {
  tailWidth: 23,
  headWidth: 40,
  headHeight: 30,
  fill: 'yellow',
  stroke: 'rgb(160,160,160)'
};

class ShakerNode extends Node {

  /**
   * @param {Shaker} shaker
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( shaker, modelViewTransform, options ) {
    assert && assert( shaker instanceof Shaker );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {

      // Performance optimization so Scenery won't fit blocks around this.
      // See https://github.com/phetsims/beers-law-lab/issues/113
      preventFit: true,

      // Node options
      visibleProperty: shaker.visibleProperty,
      cursor: 'pointer',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // shaker image
    const imageNode = new Image( shakerImage );
    imageNode.setScaleMagnitude( 0.75 );

    // label
    const labelNode = new RichText( shaker.soluteProperty.value.formula, {
      font: new PhetFont( { size: 22, weight: 'bold' } ),
      fill: 'black',
      maxWidth: 0.5 * imageNode.width, // constrain width for i18n
      tandem: options.tandem.createTandem( 'labelNode' ),
      textPropertyOptions: { phetioReadOnly: true }
    } );

    // hint arrows
    const downArrowNode = new ArrowNode( 0, 0, 0, ARROW_LENGTH, ARROW_OPTIONS );
    const upArrowNode = new ArrowNode( 0, 0, 0, -ARROW_LENGTH, ARROW_OPTIONS );

    // Set visibility of this Node programmatically to show/hide the hint arrows.
    const arrowsParent = new VBox( {
      spacing: imageNode.height + 8,
      children: [ upArrowNode, downArrowNode ],
      center: imageNode.center,
      pickable: false,
      visible: false
    } );

    // Set visibility of this Node to totally hide the hint arrows via PhET-iO.
    const hintArrowsNode = new Node( {
      children: [ arrowsParent ],
      tandem: options.tandem.createTandem( 'hintArrowsNode' )
    } );

    // common parent, to simplify rotation and label alignment.
    const parentNode = new Node( { children: [ imageNode, labelNode, hintArrowsNode ] } );
    this.addChild( parentNode );
    parentNode.rotate( shaker.orientation - Math.PI ); // assumes that shaker points to the left in the image file

    // Manually adjust these values until the origin is in the middle hole of the shaker.
    parentNode.translate( -12, -imageNode.height / 2 );

    // origin
    if ( DEBUG_ORIGIN ) {
      this.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    // sync position with model
    let shakerWasMoved = false;
    shaker.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
      shakerWasMoved = true;
      arrowsParent.visible = false;
    } );
    shakerWasMoved = false; // reset to false, because function is fired when link is performed

    // sync visibility with model
    shaker.visibleProperty.link( visible => {
      this.setVisible( visible );
    } );

    // sync solute with model
    shaker.soluteProperty.link( solute => {

      // label the shaker with the solute formula
      labelNode.setText( solute.formula );

      // center the label on the shaker
      const capWidth = 0.3 * imageNode.width; // multiplier is dependent on image file
      labelNode.centerX = capWidth + ( imageNode.width - capWidth ) / 2;
      labelNode.centerY = imageNode.centerY;
    } );

    // drag listener
    this.addInputListener( new DragListener( {
      positionProperty: shaker.positionProperty,
      dragBoundsProperty: new Property( shaker.dragBounds ),
      modelViewTransform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // Make the arrows visible when pointer is over this Node, until the shaker is moved.
    this.addInputListener( {
      enter: () => {
        arrowsParent.visible = !shakerWasMoved;
      },
      exit: () => {
        arrowsParent.visible = false;
      }
    } );
  }
}

beersLawLab.register( 'ShakerNode', ShakerNode );
export default ShakerNode;