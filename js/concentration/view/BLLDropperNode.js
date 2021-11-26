// Copyright 2013-2021, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import EyeDropperNode from '../../../../scenery-phet/js/EyeDropperNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import { RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import Solvent from '../../common/model/Solvent.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import Dropper from '../model/Dropper.js';

class BLLDropperNode extends EyeDropperNode {

  /**
   * @param {Dropper} dropper
   * @param {Solvent} solvent
   * @param {Property.<Solute>} soluteProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( dropper, solvent, soluteProperty, modelViewTransform, options ) {
    assert && assert( dropper instanceof Dropper );
    assert && assert( solvent instanceof Solvent );
    assert && assert( soluteProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {

      // EyeDropperNode options
      isDispensingProperty: dropper.isDispensingProperty,
      isEmptyProperty: dropper.isEmptyProperty,
      buttonOptions: {
        enabledProperty: dropper.enabledProperty
      },

      // Node options
      visibleProperty: dropper.visibleProperty,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // label background, so the label shows up on various fluid colors
    const labelBackground = new Path( null, {
      fill: 'rgba( 240, 240, 240, 0.6 )' // translucent gray
    } );
    this.addChild( labelBackground );

    // label
    const labelNode = new RichText( '', {
      maxWidth: 80, // determined empirically, to cover only the glass portion of the dropper
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      fill: 'black',
      tandem: options.tandem.createTandem( 'labelNode' ),
      textPropertyOptions: { phetioReadOnly: true }
    } );
    this.addChild( labelNode );

    // Background is visible only when label is visible.
    // This is in case labelNode.visibleProperty is changed via PhET-iO.
    labelNode.visibleProperty.link( visible => {
      labelBackground.visible = visible;
    } );

    // position
    dropper.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // visibility
    dropper.visibleProperty.link( visible => {
      this.visible = visible;
      if ( !visible ) {
        dropper.flowRateProperty.value = 0;
      }
    } );

    // Label the dropper with the solute formula. If formula is null, default to the solute name.
    let multilink;
    dropper.soluteProperty.link( solute => {
      multilink && multilink.dispose();
      multilink = new Multilink( [ solute.nameProperty, solute.formulaProperty ],
        ( name, formula ) => {
          labelNode.text = ( formula === null ) ? name : formula;
        } );
    } );

    // Position the label on the dropper, and resize it's translucent background to fit.
    labelNode.boundsProperty.link( () => {

      // rotate to vertical, center the label in the dropper's glass
      labelNode.rotation = -Math.PI / 2;
      labelNode.centerX = 0;
      labelNode.centerY = EyeDropperNode.GLASS_MAX_Y - ( EyeDropperNode.GLASS_MAX_Y - EyeDropperNode.GLASS_MIN_Y ) / 2;

      // Resize the translucent background.
      const width = 0.75 * EyeDropperNode.GLASS_WIDTH;
      const height = 1.2 * labelNode.height;
      const x = labelNode.centerX - ( width / 2 );
      const y = labelNode.centerY - ( height / 2 );
      labelBackground.shape = Shape.roundRect( x, y, width, height, 5, 5 );
    } );

    // Change color when the solute changes.
    soluteProperty.link( solute => {
      this.setFluidColor( ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration ) );
    } );

    // dilate touch area
    this.touchArea = this.localBounds.dilatedX( 0.25 * this.width );

    // move the dropper
    const dragListener = new DragListener( {
      positionProperty: dropper.positionProperty,
      dragBoundsProperty: new Property( dropper.dragBounds ),
      modelViewTransform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    this.addLinkedElement( dropper, {
      tandem: options.tandem.createTandem( 'dropper' )
    } );
  }
}

beersLawLab.register( 'BLLDropperNode', BLLDropperNode );
export default BLLDropperNode;