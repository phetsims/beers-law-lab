// Copyright 2013-2025, University of Colorado Boulder

/**
 * Concentration meter, with probe.
 * The probe registers the concentration of all possible fluids that it may contact, including:
 *
 * - solution in the beaker
 * - output of the solvent faucet
 * - output of the drain faucet
 * - output of the dropper
 *
 * Rather than trying to model the shapes of all of these fluids, we handle 'probe is in fluid'
 * herein via intersection of Path shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLMovable from '../../common/model/BLLMovable.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';
import ConcentrationMeter from '../model/ConcentrationMeter.js';
import ConcentrationSolution from '../model/ConcentrationSolution.js';
import Dropper from '../model/Dropper.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { linear } from '../../../../dot/js/util/linear.js';
import { ConcentrationProbeNode } from './ConcentrationProbeNode.js';
import BLLColors from '../../common/BLLColors.js';
import JumpPosition from '../../common/model/JumpPosition.js';
import Property from '../../../../axon/js/Property.js';
import BLLConstants from '../../common/BLLConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BLLDescriptionUtils from '../../common/BLLDescriptionUtils.js';

const READOUT_NO_VALUE = MathSymbols.NO_VALUE; // displayed in the readout when the meter is not measuring anything
const BODY_X_MARGIN = 15;
const BODY_Y_MARGIN = 15;
const READOUT_X_MARGIN = 5;
const READOUT_Y_MARGIN = 4;
const MIN_VALUE_SIZE = new Dimension2( 140, 35 );
const MIN_BODY_SIZE = new Dimension2( 170, 100 );

type SelfOptions = EmptySelfOptions;

type ConcentrationMeterNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ConcentrationMeterNode extends Node {

  public readonly probeNode: ConcentrationProbeNode;

  public constructor( concentrationMeter: ConcentrationMeter,
                      probeJumpPositions: JumpPosition[],
                      probeJumpPositionIndexProperty: Property<number>,
                      solution: ConcentrationSolution,
                      dropper: Dropper,
                      solutionNode: Path,
                      stockSolutionNode: Path,
                      solventFluidNode: Path,
                      drainFluidNode: Path,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: ConcentrationMeterNodeOptions ) {

    const options = optionize<ConcentrationMeterNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    super( options );

    const bodyNode = new BodyNode( concentrationMeter, modelViewTransform, options.tandem.createTandem( 'bodyNode' ) );

    const probeNode = new ConcentrationProbeNode( concentrationMeter.probe, probeJumpPositions,
      probeJumpPositionIndexProperty, modelViewTransform, solutionNode,
      stockSolutionNode, solventFluidNode, drainFluidNode, options.tandem.createTandem( 'probeNode' ) );
    this.probeNode = probeNode;

    const wireNode = new WireNode( concentrationMeter.probe, bodyNode, probeNode );

    // rendering order
    this.addChild( wireNode );
    this.addChild( bodyNode );
    this.addChild( probeNode );

    const updateValue = () => {
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        concentrationMeter.valueProperty.value = ( BLLPreferences.concentrationMeterUnitsProperty.value === 'molesPerLiter' ) ?
                                                 solution.concentrationProperty.value :
                                                 solution.percentConcentrationProperty.value;
      }
      else if ( probeNode.isInSolvent() ) {
        concentrationMeter.valueProperty.value = 0;
      }
      else if ( probeNode.isInStockSolution() ) {
        concentrationMeter.valueProperty.value = ( BLLPreferences.concentrationMeterUnitsProperty.value === 'molesPerLiter' ) ?
                                                 dropper.soluteProperty.value.stockSolutionConcentration :
                                                 dropper.soluteProperty.value.stockSolutionPercentConcentration;
      }
      else {
        concentrationMeter.valueProperty.value = null;
      }
    };

    Multilink.multilink( [
      BLLPreferences.concentrationMeterUnitsProperty,
      concentrationMeter.probe.positionProperty,
      solution.soluteProperty,
      solution.concentrationProperty,
      solution.percentConcentrationProperty,
      solutionNode.boundsProperty,
      stockSolutionNode.boundsProperty,
      solventFluidNode.boundsProperty,
      drainFluidNode.boundsProperty
    ], () => updateValue() );

    this.addLinkedElement( concentrationMeter );
  }
}

/**
 * Meter body, origin at top-left.
 */
class BodyNode extends Node {

  public constructor( concentrationMeter: ConcentrationMeter, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    const options: NodeOptions = {
      cursor: 'pointer',
      accessibleParagraph: createAccessibleParagraph( concentrationMeter.valueProperty ),
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    };

    super( options );

    const labelText = new Text( BeersLawLabStrings.concentrationStringProperty, {
      font: new PhetFont( 18 ),
      fill: 'white',
      maxWidth: 125
    } );

    // value + units
    const valueStringProperty = new DerivedStringProperty(
      [
        BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ],
        BeersLawLabStrings.pattern[ '0percentStringProperty' ],
        concentrationMeter.valueProperty,
        BeersLawLabStrings.units.molesPerLiterStringProperty,
        BLLPreferences.concentrationMeterUnitsProperty
      ],
      ( patternValueUnits, patternValuePercent, value, molesPerLiterString, concentrationMeterUnits ) => {
        let text: string;
        if ( value === null ) {
          text = READOUT_NO_VALUE;
        }
        else {

          // display concentration as 'mol/L' or '%', see beers-law-lab#149
          if ( concentrationMeterUnits === 'molesPerLiter' ) {
            text = StringUtils.format( patternValueUnits, toFixed( value, BLLConstants.DECIMAL_PLACES_CONCENTRATION_MOLES_PER_LITER ), molesPerLiterString );
          }
          else {
            text = StringUtils.format( patternValuePercent, toFixed( value, BLLConstants.DECIMAL_PLACES_CONCENTRATION_PERCENT ) );
          }
        }
        return text;
      } );
    const valueText = new Text( valueStringProperty, {
      font: new PhetFont( 22 ),
      fill: 'black',
      maxWidth: 125
    } );

    // background behind the value
    const backgroundWidth = Math.max( MIN_VALUE_SIZE.width, Math.max( labelText.width, valueText.width ) + ( 2 * READOUT_X_MARGIN ) );
    const backgroundHeight = Math.max( MIN_VALUE_SIZE.height, valueText.height + ( 2 * READOUT_Y_MARGIN ) );
    const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0, backgroundWidth, backgroundHeight ), {
      baseColor: 'white',
      lightSource: 'rightBottom'
    } );

    // vertical arrangement of stuff in the concentrationMeter
    const vBox = new VBox( {
      excludeInvisibleChildrenFromBounds: false,
      children: [ labelText, new Node( { children: [ backgroundNode, valueText ] } ) ],
      align: 'center',
      spacing: 18
    } );

    // concentrationMeter body
    const bodyWidth = Math.max( MIN_BODY_SIZE.width, vBox.width + ( 2 * BODY_X_MARGIN ) );
    const bodyHeight = Math.max( MIN_BODY_SIZE.height, vBox.height + ( 2 * BODY_Y_MARGIN ) );
    const bodyNode = new ShadedRectangle( new Bounds2( 0, 0, bodyWidth, bodyHeight ), {
      baseColor: BLLColors.concentrationMeterColorProperty,
      lightOffset: 0.95
    } );

    vBox.boundsProperty.link( bounds => {
      vBox.center = bodyNode.center;
    } );

    this.children = [ bodyNode, vBox ];

    // body position
    this.translation = modelViewTransform.modelToViewPosition( concentrationMeter.bodyPosition );

    // Keep the value properly justified on the background
    valueText.boundsProperty.link( bounds => {
      if ( concentrationMeter.valueProperty.value === null ) {

        // center justified
        valueText.centerX = backgroundNode.centerX;
      }
      else {
        // right justified
        valueText.right = backgroundNode.right - READOUT_X_MARGIN;
      }
      valueText.centerY = backgroundNode.centerY;
    } );
  }
}

/**
 * Wire that connects the body and probe.
 */
class WireNode extends Path {

  public constructor( probe: BLLMovable, bodyNode: Node, probeNode: Node ) {

    const options: PathOptions = {
      stroke: 'gray',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',

      // no need to drag the wire, and we don't want to do cubic-curve intersection here, or have it get in the way
      pickable: false
    };

    super( new Shape(), options );

    const updateCurve = () => {

      // Connect bottom-center of body to right-center of probe.
      const bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom - 10 );
      const probeConnectionPoint = new Vector2( probeNode.right, probeNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      const c1Offset = new Vector2( 0, linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      const c2Offset = new Vector2( 50, 0 );
      const c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      const c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      this.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    probe.positionProperty.link( updateCurve );
  }
}

/**
 * Creates the accessible paragraph for ConcentrationMeterNode.
 */
function createAccessibleParagraph( concentrationProperty: TReadOnlyProperty<number | null> ): TReadOnlyProperty<string> {

  return new DerivedStringProperty( [
      concentrationProperty,
      BLLPreferences.concentrationMeterUnitsProperty,

      // Localized strings used in this derivation.
      BeersLawLabStrings.a11y.concentrationMeterBodyNode.accessibleParagraphUnknownStringProperty,
      BeersLawLabStrings.a11y.concentrationMeterBodyNode.accessibleParagraphStringProperty,
      BeersLawLabStrings.a11y.unitsDescription.molePerLiterStringProperty,
      BeersLawLabStrings.a11y.unitsDescription.molesPerLiterStringProperty,
      BeersLawLabStrings.a11y.unitsDescription.percentSingularStringProperty,
      BeersLawLabStrings.a11y.unitsDescription.percentPluralStringProperty
    ],
    concentration => {
      if ( concentration === null ) {

        // The meter is not measuring anything, so the concentration is unknown.
        return BeersLawLabStrings.a11y.concentrationMeterBodyNode.accessibleParagraphUnknownStringProperty.value;
      }
      else {

        // Concentration value with the same number of decimal places as the visual UI.
        let concentrationString;
        if ( BLLPreferences.concentrationMeterUnitsProperty.value === 'molesPerLiter' ) {
          concentrationString = toFixed( concentration, BLLConstants.DECIMAL_PLACES_CONCENTRATION_MOLES_PER_LITER );
        }
        else {
          concentrationString = toFixed( concentration, BLLConstants.DECIMAL_PLACES_CONCENTRATION_PERCENT );
        }

        return StringUtils.fillIn( BeersLawLabStrings.a11y.concentrationMeterBodyNode.accessibleParagraphStringProperty.value, {
          concentration: concentrationString,
          units: BLLDescriptionUtils.getConcentrationUnits( concentration )
        } );
      }
    },
    {
      isDisposable: false
    }
  );
}

beersLawLab.register( 'ConcentrationMeterNode', ConcentrationMeterNode );