// Copyright 2013-2025, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import EyeDropperNode, { EyeDropperNodeOptions } from '../../../../scenery-phet/js/EyeDropperNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from '../../common/model/Solute.js';
import Solvent from '../../common/model/Solvent.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import Dropper from '../model/Dropper.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

type SelfOptions = EmptySelfOptions;

type BLLDropperNodeOptions = SelfOptions & PickRequired<EyeDropperNodeOptions, 'tandem'>;

export default class BLLDropperNode extends InteractiveHighlighting( EyeDropperNode ) {

  public constructor( dropper: Dropper,
                      soluteLabelStringProperty: TReadOnlyProperty<string>,
                      soluteDescriptionStringProperty: TReadOnlyProperty<string>,
                      solvent: Solvent,
                      soluteProperty: Property<Solute>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: BLLDropperNodeOptions ) {

    const options = optionize<BLLDropperNodeOptions, SelfOptions, EyeDropperNodeOptions>()( {

      // EyeDropperNodeOptions
      isDisposable: false,
      isDispensingProperty: dropper.isDispensingProperty,
      isEmptyProperty: dropper.isEmptyProperty,
      buttonOptions: {
        enabledProperty: dropper.enabledProperty,
        accessibleName: new PatternStringProperty( BeersLawLabStrings.a11y.dropperButton.accessibleNameStringProperty, {
          soluteName: soluteDescriptionStringProperty
        } ),
        accessibleHelpText: BeersLawLabStrings.a11y.dropperButton.accessibleHelpTextStringProperty,
        accessibleContextResponseValueOn: BeersLawLabStrings.a11y.dropperButton.accessibleContextResponsePressedStringProperty
      },
      visibleProperty: dropper.visibleProperty
    }, providedOptions );

    super( options );

    // label
    const labelText = new RichText( soluteLabelStringProperty, {
      maxWidth: 80, // determined empirically, to cover only the glass portion of the dropper
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      fill: 'black',
      stringPropertyOptions: { phetioReadOnly: true }
    } );

    // label background, so the label shows up on various fluid colors
    const labelBackground = new Path( null, {
      fill: 'rgba( 240, 240, 240, 0.6 )', // translucent gray
      visibleProperty: labelText.visibleProperty
    } );

    this.addChild( labelBackground );
    this.addChild( labelText );

    // position
    this.translation = modelViewTransform.modelToViewPosition( dropper.position );

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

    this.addLinkedElement( dropper );
  }
}

beersLawLab.register( 'BLLDropperNode', BLLDropperNode );