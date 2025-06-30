// Copyright 2025, University of Colorado Boulder

/**
 * ATProbeNode is the draggable probe for the AT detector.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import BLLMovable from '../../common/model/BLLMovable.js';
import Light from '../model/Light.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import beersLawLab from '../../beersLawLab.js';

type SelfOptions = EmptySelfOptions;

type ATProbeNodeOptions = SelfOptions & PickRequired<ProbeNodeOptions, 'tandem'>;

export class ATProbeNode extends InteractiveHighlighting( ProbeNode ) {

  public static readonly PROBE_COLOR = 'rgb( 8, 133, 54 )';

  public constructor( probe: BLLMovable, light: Light, modelViewTransform: ModelViewTransform2, providedOptions: ATProbeNodeOptions ) {

    const options = optionize<ATProbeNodeOptions, SelfOptions, ProbeNodeOptions>()( {
      cursor: 'pointer',
      radius: 53,
      innerRadius: 40,
      handleWidth: 68,
      handleHeight: 60,
      handleCornerRadius: 22,
      lightAngle: 1.25 * Math.PI,
      color: ATProbeNode.PROBE_COLOR,
      tagName: 'div',
      focusable: true,
      accessibleName: BeersLawLabStrings.a11y.detectorProbeNode.accessibleNameStringProperty,
      phetioInputEnabledPropertyInstrumented: true,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    // position
    probe.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    this.addInputListener( new SoundDragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: new Property( probe.dragBounds ),
      transform: modelViewTransform,
      end: () => {
        // If the light is on and the probe is close enough to the beam, snap the probe to the center of beam.
        if ( light.isOnProperty.value &&
             ( probe.positionProperty.value.x >= light.position.x ) &&
             ( Math.abs( probe.positionProperty.value.y - light.position.y ) <= 0.5 * light.lensDiameter ) ) {
          probe.positionProperty.value = new Vector2( probe.positionProperty.value.x, light.position.y );
        }
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    this.addInputListener( new SoundKeyboardDragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: new Property( probe.dragBounds ),
      transform: modelViewTransform,
      dragSpeed: 300,
      shiftDragSpeed: 20,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } ) );

    // touch area
    this.touchArea = this.localBounds.dilatedXY( 0.25 * this.width, 0 );
  }
}

beersLawLab.register( 'ATProbeNode', ATProbeNode );