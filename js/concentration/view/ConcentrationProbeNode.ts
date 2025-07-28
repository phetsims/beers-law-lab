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
import JumpPosition from '../../common/model/JumpPosition.js';
import JumpToPositionListener from '../../beerslaw/view/JumpToPositionListener.js';
import BLLConstants from '../../common/BLLConstants.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export class ConcentrationProbeNode extends InteractiveHighlighting( ProbeNode ) {

  public readonly isInSolution: () => boolean;
  public readonly isInSolvent: () => boolean;
  public readonly isInDrainFluid: () => boolean;
  public readonly isInStockSolution: () => boolean;

  public constructor( probe: BLLMovable,
                      jumpPositions: JumpPosition[],
                      jumpPositionIndexProperty: Property<number>,
                      modelViewTransform: ModelViewTransform2,
                      solutionNode: Path,
                      stockSolutionNode: Path,
                      solventFluidNode: Path,
                      drainFluidNode: Path,
                      tandem: Tandem ) {

    const options = combineOptions<ProbeNodeOptions>( {
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
      accessibleName: BeersLawLabStrings.a11y.concentrationProbeNode.accessibleNameStringProperty,
      accessibleHelpText: BeersLawLabStrings.a11y.concentrationProbeNode.accessibleHelpTextStringProperty,

      // phet-io
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true,
      phetioVisiblePropertyInstrumented: false
    }, AccessibleDraggableOptions );

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

    // Keyboard shortcut for jumping to useful positions.
    this.addInputListener( new JumpToPositionListener( this, BLLConstants.JUMP_TO_POSITION_HOTKEY_DATA,
      probe.positionProperty, jumpPositions, jumpPositionIndexProperty ) );

    // When the probe gets focus, reset the order of jump points.
    this.focusedProperty.lazyLink( focused => {
      focused && jumpPositionIndexProperty.reset();
    } );
  }
}

beersLawLab.register( 'ConcentrationProbeNode', ConcentrationProbeNode );