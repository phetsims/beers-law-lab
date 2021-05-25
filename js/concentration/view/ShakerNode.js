// Copyright 2013-2021, University of Colorado Boulder

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import shakerImage from '../../../images/shaker_png.js';
import beersLawLab from '../../beersLawLab.js';
import Shaker from '../model/Shaker.js';

// constants
const DEBUG_ORIGIN = false;

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
      tandem: Tandem.REQUIRED,
      phetioInputEnabledPropertyInstrumented: true
    }, options );

    super( options );

    // shaker image
    const imageNode = new Image( shakerImage );
    imageNode.setScaleMagnitude( 0.75 );

    // label
    const labelNode = new RichText( '', {
      font: new PhetFont( { size: 22, weight: 'bold' } ),
      fill: 'black',
      maxWidth: 0.5 * imageNode.width, // constrain width for i18n
      tandem: options.tandem.createTandem( 'labelNode' ),
      textPropertyOptions: { phetioReadOnly: true }
    } );

    // common parent, to simplify rotation and label alignment.
    const parentNode = new Node( { children: [ imageNode, labelNode ] } );
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

    // sync visibility with model
    shaker.visibleProperty.link( visible => {
      this.setVisible( visible );
    } );

    // Label the shaker with the solute formula. If formula is null, default to the solute name.
    let multilink;
    shaker.soluteProperty.link( solute => {
      multilink && multilink.dispose();
      multilink = new Multilink( [ solute.nameProperty, solute.formulaProperty ],
        ( name, formula ) => {
          labelNode.text = ( formula === null ) ? name : formula;
        } );
    } );

    // Center the label on the shaker.
    labelNode.boundsProperty.link( () => {
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

    this.addLinkedElement( shaker, {
      tandem: options.tandem.createTandem( 'shaker' )
    } );
  }
}

beersLawLab.register( 'ShakerNode', ShakerNode );
export default ShakerNode;