// Copyright 2025, University of Colorado Boulder

/**
 * ConcentrationProbeNode is the draggable probe for the Concentration meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import BLLMovable from '../../common/model/BLLMovable.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import Property from '../../../../axon/js/Property.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import beersLawLab from '../../beersLawLab.js';
import BLLColors from '../../common/BLLColors.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import { JumpPosition } from '../../common/model/JumpPosition.js';

export class ConcentrationProbeNode extends InteractiveHighlighting( ProbeNode ) {

  public static readonly JUMP_TO_POSITION_HOTKEY_DATA = new HotkeyData( {
    keyStringProperties: [ new Property( 'j' ) ],
    repoName: beersLawLab.name,
    keyboardHelpDialogLabelStringProperty: BeersLawLabStrings.keyboardHelpDialog.jumpToPositionStringProperty
  } );

  public readonly isInSolution: () => boolean;
  public readonly isInSolvent: () => boolean;
  public readonly isInDrainFluid: () => boolean;
  public readonly isInStockSolution: () => boolean;

  public constructor( probe: BLLMovable,
                      probeJumpPositions: JumpPosition[],
                      probeJumpPositionIndexProperty: Property<number>,
                      modelViewTransform: ModelViewTransform2,
                      solutionNode: Path,
                      stockSolutionNode: Path,
                      solventFluidNode: Path,
                      drainFluidNode: Path,
                      tandem: Tandem ) {

    const options: ProbeNodeOptions = {
      sensorTypeFunction: ProbeNode.crosshairs( {
        intersectionRadius: 6
      } ),
      radius: 34,
      innerRadius: 26,
      handleWidth: 30,
      handleHeight: 25,
      handleCornerRadius: 12,
      lightAngle: 1.75 * Math.PI,
      color: BLLColors.concentrationMeterColorProperty,
      rotation: -Math.PI / 2,
      cursor: 'pointer',
      tagName: 'div',
      focusable: true,
      accessibleName: BeersLawLabStrings.a11y.concentrationProbeNode.accessibleNameStringProperty,

      // phet-io
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true,
      phetioVisiblePropertyInstrumented: false
    };

    super( options );

    // probe position
    probe.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // touch area
    this.touchArea = this.localBounds.dilatedXY( 0.25 * this.width, 0.25 * this.height );

    // drag listener
    this.addInputListener( new SoundDragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: new Property( probe.dragBounds ),
      transform: modelViewTransform,
      tandem: tandem.createTandem( 'dragListener' )
    } ) );

    // keyboard drag listener
    this.addInputListener( new SoundKeyboardDragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: new Property( probe.dragBounds ),
      transform: modelViewTransform,
      dragSpeed: 300,
      shiftDragSpeed: 20,
      tandem: tandem.createTandem( 'keyboardDragListener' )
    } ) );

    const isInNode = ( node: Path ) => {
      const localPoint = node.parentToLocalPoint( probe.positionProperty.value );
      const nodeShape = node.getShape()!;
      assert && assert( nodeShape );
      const shapeBounds = nodeShape.bounds;
      return shapeBounds.getWidth() > 0 && shapeBounds.getHeight() > 0 && nodeShape.containsPoint( localPoint ); // see issue #65
    };

    this.isInSolution = () => isInNode( solutionNode );
    this.isInSolvent = () => isInNode( solventFluidNode );
    this.isInDrainFluid = () => isInNode( drainFluidNode );
    this.isInStockSolution = () => isInNode( stockSolutionNode );

    // Keyboard shortcut for moving to useful positions, see https://github.com/phetsims/beers-law-lab/issues/351.
    const hotkeyListener = new KeyboardListener( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ ConcentrationProbeNode.JUMP_TO_POSITION_HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        if ( ConcentrationProbeNode.JUMP_TO_POSITION_HOTKEY_DATA.hasKeyStroke( keysPressed ) ) {
          phet.log && phet.log( `hotkey J, probeJumpPositionIndex=${probeJumpPositionIndexProperty.value}` );
          probe.positionProperty.value = probeJumpPositions[ probeJumpPositionIndexProperty.value ].position;
          this.addAccessibleObjectResponse( probeJumpPositions[ probeJumpPositionIndexProperty.value ].accessibleObjectResponseStringProperty );
          if ( probeJumpPositionIndexProperty.value < probeJumpPositions.length - 1 ) {
            probeJumpPositionIndexProperty.value++;
          }
          else {
            probeJumpPositionIndexProperty.value = 0;
          }
        }
      }
    } );
    this.addInputListener( hotkeyListener );
  }
}

beersLawLab.register( 'ConcentrationProbeNode', ConcentrationProbeNode );