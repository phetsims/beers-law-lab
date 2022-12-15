// Copyright 2013-2022, University of Colorado Boulder

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, DragListener, Image, Node, NodeOptions, RichText } from '../../../../scenery/js/imports.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import shaker_png from '../../../images/shaker_png.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import Shaker from '../model/Shaker.js';

// constants
const DEBUG_ORIGIN = false;

type SelfOptions = EmptySelfOptions;

type ShakerNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ShakerNode extends Node {

  public constructor( shaker: Shaker, solutes: Solute[], modelViewTransform: ModelViewTransform2,
                      providedOptions: ShakerNodeOptions ) {

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

    const labelTextTandem = options.tandem.createTandem( 'labelText' );

    const labelStringProperty = DerivedProperty.deriveAny( [
      shaker.soluteProperty,
      ...solutes.map( solute => solute.formulaProperty ),
      ...solutes.map( solute => solute.nameProperty )
    ], () => {
      const formula = shaker.soluteProperty.value.formulaProperty.value;
      const name = shaker.soluteProperty.value.nameProperty.value;
      return formula ? formula : name;
    }, {
      tandem: labelTextTandem.createTandem( RichText.STRING_PROPERTY_TANDEM_NAME ),
      phetioValueType: StringIO
    } );

    // label
    const labelText = new RichText( labelStringProperty, {
      font: new PhetFont( { size: 22, weight: 'bold' } ),
      fill: 'black',
      maxWidth: 0.5 * imageNode.width, // constrain width for i18n
      tandem: labelTextTandem
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