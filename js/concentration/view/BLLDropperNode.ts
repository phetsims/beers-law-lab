// Copyright 2013-2022, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import EyeDropperNode, { EyeDropperNodeOptions } from '../../../../scenery-phet/js/EyeDropperNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { DragListener, Path, RichText } from '../../../../scenery/js/imports.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import Solvent from '../../common/model/Solvent.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import Dropper from '../model/Dropper.js';

type SelfOptions = EmptySelfOptions;

type BLLDropperNodeOptions = SelfOptions & PickRequired<EyeDropperNodeOptions, 'tandem'>;

export default class BLLDropperNode extends EyeDropperNode {

  public constructor( dropper:Dropper, solvent: Solvent, soluteProperty: Property<Solute>,
               modelViewTransform: ModelViewTransform2, providedOptions: BLLDropperNodeOptions ) {

    const options = optionize<BLLDropperNodeOptions, SelfOptions, EyeDropperNodeOptions>()( {

      // EyeDropperNodeOptions
      isDispensingProperty: dropper.isDispensingProperty,
      isEmptyProperty: dropper.isEmptyProperty,
      buttonOptions: {
        enabledProperty: dropper.enabledProperty
      },
      visibleProperty: dropper.visibleProperty
    }, providedOptions );

    super( options );

    // label background, so the label shows up on various fluid colors
    const labelBackground = new Path( null, {
      fill: 'rgba( 240, 240, 240, 0.6 )' // translucent gray
    } );
    this.addChild( labelBackground );

    // label
    const labelText = new RichText( '', {
      maxWidth: 80, // determined empirically, to cover only the glass portion of the dropper
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      fill: 'black',
      tandem: options.tandem.createTandem( 'labelText' ),
      textPropertyOptions: { phetioReadOnly: true }
    } );
    this.addChild( labelText );

    // Background is visible only when label is visible.
    // This is in case labelText.visibleProperty is changed via PhET-iO.
    labelText.visibleProperty.link( visible => {
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
    let multilink: { dispose: () => void };
    dropper.soluteProperty.link( solute => {
      multilink && multilink.dispose();
      multilink = new Multilink( [ solute.nameProperty, solute.formulaProperty ],
        ( name, formula ) => {
          labelText.text = ( formula === null ) ? name : formula;
        } );
    } );

    // Position the label on the dropper, and resize it's translucent background to fit.
    labelText.boundsProperty.link( () => {

      // rotate to vertical, center the label in the dropper's glass
      labelText.rotation = -Math.PI / 2;
      labelText.centerX = 0;
      labelText.centerY = EyeDropperNode.GLASS_MAX_Y - ( EyeDropperNode.GLASS_MAX_Y - EyeDropperNode.GLASS_MIN_Y ) / 2;

      // Resize the translucent background.
      const width = 0.75 * EyeDropperNode.GLASS_WIDTH;
      const height = 1.2 * labelText.height;
      const x = labelText.centerX - ( width / 2 );
      const y = labelText.centerY - ( height / 2 );
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
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    this.addLinkedElement( dropper, {
      tandem: options.tandem.createTandem( 'dropper' )
    } );
  }
}

beersLawLab.register( 'BLLDropperNode', BLLDropperNode );