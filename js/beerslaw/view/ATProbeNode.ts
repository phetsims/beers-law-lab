// Copyright 2025, University of Colorado Boulder

/**
 * ATProbeNode is the draggable probe for the AT detector.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import ProbeNode from '../../../../scenery-phet/js/ProbeNode.js';
import BLLMovable from '../../common/model/BLLMovable.js';
import Light from '../model/Light.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import beersLawLab from '../../beersLawLab.js';
import BLLColors from '../../common/BLLColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import { JumpPosition } from '../../common/model/JumpPosition.js';

export class ATProbeNode extends InteractiveHighlighting( ProbeNode ) {

  public static readonly JUMP_TO_POSITION_HOTKEY_DATA = new HotkeyData( {
    keyStringProperties: [ new Property( 'j' ) ],
    repoName: beersLawLab.name,
    keyboardHelpDialogLabelStringProperty: BeersLawLabStrings.keyboardHelpDialog.jumpToPositionStringProperty
  } );

  public constructor( probe: BLLMovable,
                      jumpPositions: JumpPosition[],
                      jumpPositionIndexProperty: Property<number>,
                      light: Light,
                      modelViewTransform: ModelViewTransform2,
                      tandem: Tandem ) {

    super( {
      cursor: 'pointer',
      radius: 53,
      innerRadius: 40,
      handleWidth: 68,
      handleHeight: 60,
      handleCornerRadius: 22,
      lightAngle: 1.25 * Math.PI,
      color: BLLColors.atDetectorColorProperty,
      tagName: 'div',
      focusable: true,
      accessibleName: BeersLawLabStrings.a11y.detectorProbeNode.accessibleNameStringProperty,
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true,
      phetioVisiblePropertyInstrumented: false
    } );

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
      tandem: tandem.createTandem( 'dragListener' )
    } ) );

    this.addInputListener( new SoundKeyboardDragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: new Property( probe.dragBounds ),
      transform: modelViewTransform,
      dragSpeed: 150,
      shiftDragSpeed: 20,
      tandem: tandem.createTandem( 'keyboardDragListener' )
    } ) );

    // touch area
    this.touchArea = this.localBounds.dilatedXY( 0.25 * this.width, 0 );

    // Keyboard shortcut for moving to useful positions, see https://github.com/phetsims/beers-law-lab/issues/352.
    const hotkeyListener = new KeyboardListener( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ ATProbeNode.JUMP_TO_POSITION_HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        if ( ATProbeNode.JUMP_TO_POSITION_HOTKEY_DATA.hasKeyStroke( keysPressed ) ) {
          phet.log && phet.log( `hotkey J, jumpPositionIndex=${jumpPositionIndexProperty.value}` );
          probe.positionProperty.value = jumpPositions[ jumpPositionIndexProperty.value ].positionProperty.value;
          this.addAccessibleObjectResponse( jumpPositions[ jumpPositionIndexProperty.value ].accessibleObjectResponseStringProperty );
          if ( jumpPositionIndexProperty.value < jumpPositions.length - 1 ) {
            jumpPositionIndexProperty.value++;
          }
          else {
            jumpPositionIndexProperty.value = 0;
          }
        }
      }
    } );
    this.addInputListener( hotkeyListener );
  }
}

beersLawLab.register( 'ATProbeNode', ATProbeNode );