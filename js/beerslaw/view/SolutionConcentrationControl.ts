// Copyright 2018-2025, University of Colorado Boulder

/**
 * SolutionConcentrationControl is actually a set of NumberControls, one for each solution.  Since each solution has its
 * own concentration, range, and associated color, it is (as of this writing) impossible to use a single NumberControl.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BeersLawSolution from '../model/BeersLawSolution.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import BLLConstants from '../../common/BLLConstants.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import ConcentrationTransform from '../model/ConcentrationTransform.js';

const FONT = new PhetFont( 20 );
const TICK_FONT = new PhetFont( 16 );
const SLIDER_INTERVAL = 5; // in view units

type SelfOptions = EmptySelfOptions;

type ConcentrationControlOptions = SelfOptions & PickRequired<NumberControlOptions, 'tandem'>;

export default class SolutionConcentrationControl extends Node {

  public constructor( solutions: BeersLawSolution[],
                      solutionProperty: Property<BeersLawSolution>,
                      concentrationProperty: ReadOnlyProperty<number>,
                      providedOptions: ConcentrationControlOptions ) {

    const options = optionize<ConcentrationControlOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    // Concentration:
    const labelStringProperty = new DerivedStringProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.concentrationStringProperty ],
      ( pattern, concentrationString ) => StringUtils.format( pattern, concentrationString ), {
        tandem: options.tandem.createTandem( 'labelStringProperty' )
      } );

    // Whether concentration is editable. If false, hides the slider and arrow buttons. For PHET-iO only.
    const displayOnlyProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'displayOnlyProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Setting this to true will hide the slider and arrow buttons, showing only the value.'
    } );

    // 1 control for each solution, with mutually-exclusive visibility
    options.children = solutions.map( solution =>
      new SoluteConcentrationControl( labelStringProperty, solution, displayOnlyProperty, {
        visibleProperty: new DerivedProperty( [ solutionProperty ], solutionValue => ( solutionValue === solution ) )
      } )
    );

    super( options );

    // concentrationProperty is unused in this class, and provided only so that it can be linked for PhET-iO.
    this.addLinkedElement( concentrationProperty );
  }
}

/**
 * SoluteConcentrationControl is the NumberControl used to set concentration for one specific solute.
 */

type SoluteConcentrationControlSelfOptions = EmptySelfOptions;

type SoluteConcentrationControlOptions = SoluteConcentrationControlSelfOptions & PickRequired<NumberControlOptions, 'visibleProperty'>;

class SoluteConcentrationControl extends NumberControl {

  public readonly solution: BeersLawSolution;

  public constructor( labelStringProperty: TReadOnlyProperty<string>,
                      solution: BeersLawSolution,
                      displayOnlyProperty: TReadOnlyProperty<boolean>,
                      providedOptions: SoluteConcentrationControlOptions ) {

    const options = optionize<SoluteConcentrationControlOptions, SoluteConcentrationControlSelfOptions, NumberControlOptions>()( {

      // NumberControl options
      isDisposable: false,
      titleNodeOptions: {
        font: FONT,
        maxWidth: 120
      },
      numberDisplayOptions: {
        decimalPlaces: BLLConstants.DECIMAL_PLACES_CONCENTRATION_MOLAR,
        textOptions: {
          font: FONT,
          maxWidth: 75
        },
        minBackgroundWidth: 95 // determined empirically
      },
      arrowButtonOptions: {
        visibleProperty: DerivedProperty.not( displayOnlyProperty ),
        scale: 1,
        touchAreaXDilation: 8,
        touchAreaYDilation: 15
      },

      // Slider options, passed through by NumberControl
      sliderOptions: {
        visibleProperty: DerivedProperty.not( displayOnlyProperty ),
        trackSize: new Dimension2( 200, 15 ),
        thumbSize: new Dimension2( 22, 45 ),
        constrainValue: value => roundToInterval( value, SLIDER_INTERVAL ),
        tandem: Tandem.OPT_OUT,

        pdomCreateAriaValueText: concentration => createAriaValueTextForSlider( concentration, solution.concentrationTransform ),

        // Dynamic dependencies used in createAriaValueTextForSlider.
        pdomDependencies: [
          BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ],
          BeersLawLabStrings.a11y.unitsDescription.micromolarStringProperty,
          BeersLawLabStrings.a11y.unitsDescription.millimolarStringProperty
        ]
      },

      // single-line horizontal layout
      layoutFunction: ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
        assert && assert( leftArrowButton && rightArrowButton );
        return new HBox( {
          spacing: 5,
          children: [ titleNode, numberDisplay, new HStrut( 5 ), leftArrowButton!, slider, rightArrowButton! ]
        } );
      },
      accessibleName: BeersLawLabStrings.a11y.solutionConcentrationControl.accessibleNameStringProperty,
      accessibleHelpText: BeersLawLabStrings.a11y.solutionConcentrationControl.accessibleHelpTextStringProperty,

      tandem: Tandem.OPT_OUT // see https://github.com/phetsims/beers-law-lab/issues/270
    }, providedOptions );

    const transform = solution.concentrationTransform;

    // e.g. display units that are specific to the solution, e.g. '{0} mM'
    assert && assert( !options.numberDisplayOptions.valuePattern, 'SolutionConcentrationControl sets valuePattern' );
    options.numberDisplayOptions.valuePattern = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ], transform.unitsStringProperty ],
      ( pattern, unitsString ) => StringUtils.format( pattern, SunConstants.VALUE_NUMBERED_PLACEHOLDER, unitsString )
    );

    assert && assert( options.delta === undefined, 'SolutionConcentrationControl sets delta' );
    options.delta = 1; // in view coordinates

    // fill the track with a linear gradient that corresponds to the solution color
    const trackSize = options.sliderOptions.trackSize!;
    assert && assert( trackSize );
    assert && assert( !options.sliderOptions.trackFillEnabled, 'SolutionConcentrationControl sets trackFillEnabled' );
    options.sliderOptions.trackFillEnabled = new LinearGradient( 0, 0, trackSize.width, 0 )
      .addColorStop( 0, solution.colorRange.min )
      .addColorStop( 1, solution.colorRange.max );

    // map concentration value between model and view
    const numberProperty = new DynamicProperty( new Property( solution.concentrationProperty ), {
      bidirectional: true,

      // Necessary because bidirectional:true
      reentrant: true,

      // map from model to view, apply options.interval to model value
      map: ( value: number ) => transform.modelToView( value ),

      // map from view to model, apply options.interval to model value
      inverseMap: ( value: number ) => transform.viewToModel( value )
    } );

    // convert solution's concentration range from model to view
    const concentrationRange = solution.concentrationProperty.range;
    const numberRange = new Range(
      transform.modelToView( concentrationRange.min ),
      transform.modelToView( concentrationRange.max )
    );

    // ticks at the min and max of the solution's concentration range
    assert && assert( !options.sliderOptions.majorTicks, 'SolutionConcentrationControl sets majorTicks' );
    options.sliderOptions.majorTicks = [
      {
        value: numberRange.min,
        label: new Text( numberRange.min, { font: TICK_FONT } )
      },
      {
        value: numberRange.max,
        label: new Text( numberRange.max, { font: TICK_FONT } )
      }
    ];

    super( labelStringProperty, numberProperty, numberRange, options );

    this.solution = solution;

    this.addLinkedElement( solution.concentrationProperty );
  }
}

/**
 * Creates the aria-valuetext for the Concentration slider.
 */
function createAriaValueTextForSlider( concentration: number, concentrationTransform: ConcentrationTransform ): string {

  // No need to apply concentrationTransform to value because the slider is operating on a DynamicProperty that is already transformed.

  const valueString = toFixed( concentration, BLLConstants.DECIMAL_PLACES_CONCENTRATION_MOLAR );

  const unitsString = ( concentrationTransform === ConcentrationTransform.uM ) ?
                      BeersLawLabStrings.a11y.unitsDescription.micromolarStringProperty.value :
                      BeersLawLabStrings.a11y.unitsDescription.millimolarStringProperty.value;

  return StringUtils.format( BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ].value, valueString, unitsString );
}

beersLawLab.register( 'SolutionConcentrationControl', SolutionConcentrationControl );