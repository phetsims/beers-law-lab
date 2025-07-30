// Copyright 2025, University of Colorado Boulder

/**
 * DetectorProbeJumpPositions is the set of jump positions for the detector probe, used by the 'J' shortcut.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import JumpPosition from '../../common/model/JumpPosition.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawModel from './BeersLawModel.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Detector from './Detector.js';
import DetectorMode from './DetectorMode.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import BLLConstants from '../../common/BLLConstants.js';

export default class DetectorProbeJumpPositions extends Array<JumpPosition> {
  
  public constructor( model: BeersLawModel ) {

    // Model Properties that are used by all derivations of descriptions for jump positions.
    const modelDependencies = [
      model.detector.modeProperty,
      model.detector.transmittanceProperty,
      model.detector.absorbanceProperty
    ];

    // Localized strings used by getDetectorValueSentence
    const getDetectorValueSentenceDependencies = [
      BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.transmittanceValueUnitsStringProperty,
      BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.transmittanceUnknownStringProperty,
      BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.absorbanceValueStringProperty,
      BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.absorbanceUnknownStringProperty,
      BeersLawLabStrings.a11y.unitsDescription.percentStringProperty
    ];

    super(

      // Between light source and cuvette, vertically centered in the beam path.
      new JumpPosition( {
        positionProperty: new Vector2Property( new Vector2( model.cuvette.position.x - 0.5, model.light.position.y ) ),
        accessibleObjectResponseStringProperty: DerivedStringProperty.deriveAny( [
            BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.betweenLightSourceAndCuvetteStringProperty,
            ...modelDependencies,
            ...getDetectorValueSentenceDependencies
          ],
          () => StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.betweenLightSourceAndCuvetteStringProperty.value, {
            valueSentence: getDetectorValueSentence( model.detector )
          } )
        )
      } ),

      // Horizontally centered in the cuvette, vertically centered in the beam path.
      new JumpPosition( {
        positionProperty: new DerivedProperty( [ model.cuvette.centerXProperty ], centerX => new Vector2( centerX, model.light.position.y ) ),
        accessibleObjectResponseStringProperty: DerivedStringProperty.deriveAny( [
            BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.centeredInCuvetteStringProperty,
            ...modelDependencies,
            ...getDetectorValueSentenceDependencies
          ],
          () => StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.centeredInCuvetteStringProperty.value, {
            valueSentence: getDetectorValueSentence( model.detector )
          } )
        )
      } ),

      // Right of the cuvette's max width, vertically centered in the beam path.
      new JumpPosition( {
        positionProperty: new Vector2Property( new Vector2( model.detector.probe.positionProperty.value.x, model.light.position.y ) ),
        accessibleObjectResponseStringProperty: DerivedStringProperty.deriveAny( [
            BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.rightOfCuvetteStringProperty,
            ...modelDependencies,
            ...getDetectorValueSentenceDependencies
          ],
          () => StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.rightOfCuvetteStringProperty.value, {
            valueSentence: getDetectorValueSentence( model.detector )
          } )
        )
      } ),

      // Outside the light source path.
      new JumpPosition( {
        positionProperty: new Vector2Property( new Vector2( model.detector.probe.positionProperty.value.x, model.light.position.y + model.detector.probe.sensorDiameter + 0.15 ) ),
        accessibleObjectResponseStringProperty: DerivedStringProperty.deriveAny( [
            BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.outsideLightSourcePathStringProperty,
            ...modelDependencies,
            ...getDetectorValueSentenceDependencies
          ],
          () => StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.outsideLightSourcePathStringProperty.value, {
            valueSentence: getDetectorValueSentence( model.detector )
          } )
        )
      } )
    );
  }
}

/**
 * Gets the sentence that describes the value displayed by the detector.
 */
function getDetectorValueSentence( detector: Detector ): string {

  const mode = detector.modeProperty.value;
  const transmittance = detector.transmittanceProperty.value;
  const absorbance = detector.absorbanceProperty.value;

  let valueSentence: string;
  if ( mode === DetectorMode.TRANSMITTANCE ) {
    if ( transmittance === null ) {
      valueSentence = BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.transmittanceUnknownStringProperty.value;
    }
    else {
      valueSentence = StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.transmittanceValueUnitsStringProperty.value, {
        transmittance: toFixed( 100 * transmittance, BLLConstants.DECIMAL_PLACES_TRANSMITTANCE ),
        units: BeersLawLabStrings.a11y.unitsDescription.percentStringProperty.value
      } );
    }
  }
  else {
    assert && assert( mode === DetectorMode.ABSORBANCE );
    if ( absorbance === null ) {
      valueSentence = BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.absorbanceUnknownStringProperty.value;
    }
    else {
      valueSentence = StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.absorbanceValueStringProperty.value, {
        absorbance: toFixed( absorbance, BLLConstants.DECIMAL_PLACES_ABSORBANCE )
      } );
    }
  }
  return valueSentence;
}

beersLawLab.register( 'DetectorProbeJumpPositions', DetectorProbeJumpPositions );