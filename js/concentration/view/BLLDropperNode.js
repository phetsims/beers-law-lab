// Copyright 2013-2020, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import EyeDropperNode from '../../../../scenery-phet/js/EyeDropperNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';

class BLLDropperNode extends EyeDropperNode {

  /**
   * @param {Dropper} dropper
   * @param {Solvent} solvent
   * @param {Property.<Solute>} soluteProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( dropper, solvent, soluteProperty, modelViewTransform, options ) {

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
    const label = new RichText( '', {
      maxWidth: 80, // determined empirically, to cover only the glass portion of the dropper
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      fill: 'black',
      tandem: options.tandem.createTandem( 'label' )
    } );
    this.addChild( label );

    // position
    dropper.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // visibility
    dropper.visibleProperty.link( visible => {
      this.visible = visible;
      if ( !visible ) { dropper.flowRateProperty.set( 0 ); }
    } );

    // Change the label and color when the solute changes.
    soluteProperty.link( solute => {

      // fluid color
      this.setFluidColor( ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration ) );

      // label, centered in the dropper's glass
      label.text = solute.formula;

      // rotate to vertical, center the label in the dropper's glass
      label.rotation = -Math.PI / 2;
      label.centerX = 0;
      label.centerY = EyeDropperNode.GLASS_MAX_Y - ( EyeDropperNode.GLASS_MAX_Y - EyeDropperNode.GLASS_MIN_Y ) / 2;

      // translucent background for the label, so that it's visible on all solution colors
      const width = 0.75 * EyeDropperNode.GLASS_WIDTH;
      const height = 1.2 * label.height;
      const x = label.centerX - ( width / 2 );
      const y = label.centerY - ( height / 2 );
      labelBackground.shape = Shape.roundRect( x, y, width, height, 5, 5 );
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
  }
}

beersLawLab.register( 'BLLDropperNode', BLLDropperNode );
export default BLLDropperNode;