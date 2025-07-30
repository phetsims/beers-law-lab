// Copyright 2013-2025, University of Colorado Boulder

/**
 * BeersLawModel is the top-level model for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import Detector from './Detector.js';
import Beam from './Beam.js';
import BeersLawSolution from './BeersLawSolution.js';
import Cuvette from './Cuvette.js';
import Light from './Light.js';
import Ruler from './Ruler.js';
import SolutionInCuvette from './SolutionInCuvette.js';
import JumpPosition from '../../common/model/JumpPosition.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import DetectorMode from './DetectorMode.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BLLConstants from '../../common/BLLConstants.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import RulerJumpPositions from './RulerJumpPositions.js';

export default class BeersLawModel implements TModel {

  public readonly solutions: BeersLawSolution[];
  public readonly solutionProperty: Property<BeersLawSolution>;

  // NOTE: All positions are relative to the position of the cuvette.
  public readonly cuvette: Cuvette;

  public readonly light: Light;
  public readonly ruler: Ruler;
  public readonly solutionInCuvette: SolutionInCuvette;
  public readonly detector: Detector;
  public readonly beam: Beam;

  // Useful positions for the detector probe. Cycle through these positions via a keyboard shortcut.
  // See https://github.com/phetsims/beers-law-lab/issues/352.
  public readonly detectorProbeJumpPositions: JumpPosition[];
  public readonly detectorProbeJumpPositionIndexProperty: Property<number>;

  // Useful positions for the ruler. Cycle through these positions via a keyboard shortcut.
  // See https://github.com/phetsims/beers-law-lab/issues/364.
  public readonly rulerJumpPositions: JumpPosition[];
  public readonly rulerJumpPositionIndexProperty: Property<number>;

  public constructor( modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    // in rainbow (ROYGBIV) order.
    this.solutions = [
      BeersLawSolution.DRINK_MIX,
      BeersLawSolution.COBALT_II_NITRATE,
      BeersLawSolution.COBALT_CHLORIDE,
      BeersLawSolution.POTASSIUM_DICHROMATE,
      BeersLawSolution.POTASSIUM_CHROMATE,
      BeersLawSolution.NICKEL_II_CHLORIDE,
      BeersLawSolution.COPPER_SULFATE,
      BeersLawSolution.POTASSIUM_PERMANGANATE
    ];

    this.solutionProperty = new Property( this.solutions[ 0 ], {
      validValues: this.solutions,
      tandem: tandem.createTandem( 'solutionProperty' ),
      phetioFeatured: true,
      phetioValueType: BeersLawSolution.BeersLawSolutionIO,
      phetioDocumentation: 'The selected solution, which appears in the cuvette'
    } );

    this.cuvette = new Cuvette( {
      position: new Vector2( 3.3, 0.5 ),
      tandem: tandem.createTandem( 'cuvette' )
    } );

    this.light = new Light( this.solutionProperty, {
      position: new Vector2( this.cuvette.position.x - 1.5, this.cuvette.position.y + ( this.cuvette.height / 2 ) ),
      tandem: tandem.createTandem( 'light' )
    } );

    this.ruler = new Ruler( {
      position: new Vector2( this.cuvette.position.x - 2.6, this.cuvette.position.y + 4 ),
      dragBounds: new Bounds2( 0, 0, 6, 5 ),
      tandem: tandem.createTandem( 'ruler' )
    } );

    this.rulerJumpPositions = new RulerJumpPositions( this );

    this.rulerJumpPositionIndexProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, this.rulerJumpPositions.length - 1 )
    } );

    this.solutionInCuvette = new SolutionInCuvette( this.solutions, this.solutionProperty,
      this.cuvette.widthProperty, this.light.wavelengthProperty, tandem.createTandem( 'solutionInCuvette' ) );

    this.detector = new Detector( this.light, this.cuvette, this.solutionInCuvette, {
      bodyPosition: new Vector2( this.cuvette.position.x + 3, this.cuvette.position.y - 0.3 ),
      probePosition: new Vector2( this.cuvette.position.x + 3, this.light.position.y ),
      probeDragBounds: new Bounds2( 0, 0, 7.9, 5.25 ),
      tandem: tandem.createTandem( 'detector' )
    } );

    this.beam = new Beam( this.light, this.cuvette, this.detector, this.solutionInCuvette, modelViewTransform );

    // Model Properties that are used by all derivations of descriptions for jump positions.
    const modelDependencies = [
      this.detector.modeProperty,
      this.detector.transmittanceProperty,
      this.detector.absorbanceProperty
    ];

    // Localized strings used by getDetectorValueSentence
    const getDetectorValueSentenceDependencies = [
      BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.transmittanceValueUnitsStringProperty,
      BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.transmittanceUnknownStringProperty,
      BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.absorbanceValueStringProperty,
      BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.absorbanceUnknownStringProperty,
      BeersLawLabStrings.a11y.unitsDescription.percentStringProperty
    ];

    this.detectorProbeJumpPositions = [

      // Between light source and cuvette, vertically centered in the beam path.
      new JumpPosition( {
        positionProperty: new Vector2Property( new Vector2( this.cuvette.position.x - 0.5, this.light.position.y ) ),
        accessibleObjectResponseStringProperty: DerivedStringProperty.deriveAny( [
            BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.betweenLightSourceAndCuvetteStringProperty,
            ...modelDependencies,
            ...getDetectorValueSentenceDependencies
          ],
          () => StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.betweenLightSourceAndCuvetteStringProperty.value, {
            valueSentence: getDetectorValueSentence( this.detector )
          } )
        )
      } ),

      // Horizontally centered in the cuvette, vertically centered in the beam path.
      new JumpPosition( {
        positionProperty: new DerivedProperty( [ this.cuvette.centerXProperty ], centerX => new Vector2( centerX, this.light.position.y ) ),
        accessibleObjectResponseStringProperty: DerivedStringProperty.deriveAny( [
            BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.centeredInCuvetteStringProperty,
            ...modelDependencies,
            ...getDetectorValueSentenceDependencies
          ],
          () => StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.centeredInCuvetteStringProperty.value, {
            valueSentence: getDetectorValueSentence( this.detector )
          } )
        )
      } ),

      // Right of the cuvette's max width, vertically centered in the beam path.
      new JumpPosition( {
        positionProperty: new Vector2Property( new Vector2( this.detector.probe.positionProperty.value.x, this.light.position.y ) ),
        accessibleObjectResponseStringProperty: DerivedStringProperty.deriveAny( [
            BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.rightOfCuvetteStringProperty,
            ...modelDependencies,
            ...getDetectorValueSentenceDependencies
          ],
          () => StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.rightOfCuvetteStringProperty.value, {
            valueSentence: getDetectorValueSentence( this.detector )
          } )
        )
      } ),

      // Outside the light source path.
      new JumpPosition( {
        positionProperty: new Vector2Property( new Vector2( this.detector.probe.positionProperty.value.x, this.light.position.y + this.detector.probe.sensorDiameter + 0.15 ) ),
        accessibleObjectResponseStringProperty: DerivedStringProperty.deriveAny( [
            BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.outsideLightSourcePathStringProperty,
            ...modelDependencies,
            ...getDetectorValueSentenceDependencies
          ],
          () => StringUtils.fillIn( BeersLawLabStrings.a11y.detectorProbeNode.jumpResponses.outsideLightSourcePathStringProperty.value, {
            valueSentence: getDetectorValueSentence( this.detector )
          } )
        )
      } )
    ];

    this.detectorProbeJumpPositionIndexProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, this.detectorProbeJumpPositions.length - 1 )
    } );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  public reset(): void {
    for ( let i = 0; i < this.solutions.length; i++ ) {
      this.solutions[ i ].reset();
    }
    this.solutionProperty.reset();
    this.light.reset();
    this.cuvette.reset();
    this.detector.reset();
    this.ruler.reset();
  }

  /**
   * Gets the complete set of localized names for all solutions.
   */
  public getSolutionNameProperties(): TReadOnlyProperty<string>[] {
    return this.solutions.map( solution => solution.nameProperty );
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

beersLawLab.register( 'BeersLawModel', BeersLawModel );