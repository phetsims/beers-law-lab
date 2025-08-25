// Copyright 2025, University of Colorado Boulder

/**
 * DetectorProbeNode is the draggable probe for measuring transmittance and absorbance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLColors from '../../common/BLLColors.js';
import Detector from '../../beerslaw/model/Detector.js';
import JumpPosition from '../../common/model/JumpPosition.js';
import Light from '../model/Light.js';
import JumpToPositionListener from './JumpToPositionListener.js';
import BLLConstants from '../../common/BLLConstants.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import DetectorMode from '../model/DetectorMode.js';

export class DetectorProbeNode extends InteractiveHighlighting( ProbeNode ) {

  private readonly detector: Detector;

  public constructor( detector: Detector,
                      jumpPositions: JumpPosition[],
                      jumpPositionIndexProperty: Property<number>,
                      light: Light,
                      modelViewTransform: ModelViewTransform2,
                      tandem: Tandem ) {

    const options = combineOptions<ProbeNodeOptions>( {
      cursor: 'pointer',
      radius: 53,
      innerRadius: 40,
      handleWidth: 68,
      handleHeight: 60,
      handleCornerRadius: 22,
      lightAngle: 1.25 * Math.PI,
      color: BLLColors.atDetectorColorProperty,
      accessibleName: BeersLawLabStrings.a11y.detectorProbeNode.accessibleNameStringProperty,
      accessibleHelpText: BeersLawLabStrings.a11y.detectorProbeNode.accessibleHelpTextStringProperty,
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true,
      phetioVisiblePropertyInstrumented: false
    }, AccessibleDraggableOptions );

    super( options );

    this.detector = detector;

    const probe = detector.probe;

    // position
    probe.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // If the light is on and the probe is close enough to the beam, snap the probe to the center of beam.
    const snapToBeam = () => {
      if ( light.isOnProperty.value &&
           ( probe.positionProperty.value.x >= light.position.x ) &&
           ( Math.abs( probe.positionProperty.value.y - light.position.y ) <= 0.5 * light.lensDiameter ) ) {
        probe.positionProperty.value = new Vector2( probe.positionProperty.value.x, light.position.y );
        this.doAccessibleObjectResponse();
      }
    };

    this.addInputListener( new SoundDragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: new Property( probe.dragBounds ),
      transform: modelViewTransform,
      drag: () => this.doAccessibleObjectResponse(),
      end: snapToBeam,
      tandem: tandem.createTandem( 'dragListener' )
    } ) );

    this.addInputListener( new SoundKeyboardDragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: new Property( probe.dragBounds ),
      transform: modelViewTransform,
      drag: () => this.doAccessibleObjectResponse(),
      end: snapToBeam,
      dragSpeed: 150,
      shiftDragSpeed: 20,
      tandem: tandem.createTandem( 'keyboardDragListener' )
    } ) );

    // touch area
    this.touchArea = this.localBounds.dilatedXY( 0.25 * this.width, 0 );

    // Keyboard shortcut for jumping to useful positions.
    this.addInputListener( new JumpToPositionListener( this, BLLConstants.JUMP_TO_POSITION_HOTKEY_DATA,
      probe.positionProperty, jumpPositions, jumpPositionIndexProperty ) );

    // When the probe gets focus...
    this.focusedProperty.lazyLink( focused => {
      if ( focused ) {

        // Add an accessible object response for the current measurement.
        this.doAccessibleObjectResponse();

        // Reset the order of jump points
        focused && jumpPositionIndexProperty.reset();
      }
    } );
  }

  /**
   * Adds an accessible object response to report the value that the probe is reading.
   * This occurs on focus and drag.
   */
  private doAccessibleObjectResponse(): void {

    const mode = this.detector.modeProperty.value;
    const transmittance = this.detector.transmittanceProperty.value;
    const absorbance = this.detector.absorbanceProperty.value;

    let response;
    if ( mode === DetectorMode.TRANSMITTANCE ) {
      if ( transmittance === null ) {
        response = StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.accessibleObjectResponseUnknownStringProperty.value, {
          mode: BeersLawLabStrings.transmittanceStringProperty.value
        } );
      }
      else {
        response = StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.accessibleObjectResponseTransmittanceStringProperty.value, {
          mode: BeersLawLabStrings.transmittanceStringProperty.value,
          transmittance: toFixed( 100 * transmittance, BLLConstants.DECIMAL_PLACES_TRANSMITTANCE ),
          units: BeersLawLabStrings.a11y.unitsDescription.percentStringProperty.value
        } );
      }
    }
    else {
      if ( absorbance === null ) {
        response = StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.accessibleObjectResponseUnknownStringProperty.value, {
          mode: BeersLawLabStrings.absorbanceStringProperty.value
        } );
      }
      else {
        response = StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.accessibleObjectResponseAbsorbanceStringProperty.value, {
          mode: BeersLawLabStrings.absorbanceStringProperty.value,
          absorbance: toFixed( absorbance, BLLConstants.DECIMAL_PLACES_ABSORBANCE )
        } );
      }
    }
    this.addAccessibleObjectResponse( response );
  }
}

beersLawLab.register( 'DetectorProbeNode', DetectorProbeNode );