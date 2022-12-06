// Copyright 2018-2022, University of Colorado Boulder

/**
 * Control for changing a solution's concentration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, HStrut, LinearGradient, Text } from '../../../../scenery/js/imports.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BeersLawSolution from '../model/BeersLawSolution.js';

// constants
const FONT = new PhetFont( 20 );
const TICK_FONT = new PhetFont( 16 );
const SLIDER_INTERVAL = 5; // in view units

type SelfOptions = EmptySelfOptions;

type ConcentrationControlOptions = SelfOptions & PickRequired<NumberControlOptions, 'visibleProperty'>;

export default class ConcentrationControl extends NumberControl {

  public readonly solution: BeersLawSolution;

  public constructor( solution: BeersLawSolution, providedOptions: ConcentrationControlOptions ) {

    const options = optionize<ConcentrationControlOptions, SelfOptions, NumberControlOptions>()( {

      // NumberControl options
      titleNodeOptions: {
        font: FONT
      },
      numberDisplayOptions: {
        textOptions: {
          font: FONT
        },
        minBackgroundWidth: 95 // determined empirically
      },
      arrowButtonOptions: {
        scale: 1,
        touchAreaXDilation: 8,
        touchAreaYDilation: 15
      },

      // Slider options, passed through by NumberControl
      sliderOptions: {
        trackSize: new Dimension2( 200, 15 ),
        thumbSize: new Dimension2( 22, 45 ),
        constrainValue: value => Utils.roundToInterval( value, SLIDER_INTERVAL ),
        tandem: Tandem.OPT_OUT
      },

      // single-line horizontal layout
      layoutFunction: ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
        assert && assert( leftArrowButton && rightArrowButton );
        return new HBox( {
          spacing: 5,
          children: [ titleNode, numberDisplay, new HStrut( 5 ), leftArrowButton!, slider, rightArrowButton! ]
        } );
      },

      tandem: Tandem.OPT_OUT // see https://github.com/phetsims/beers-law-lab/issues/270
    }, providedOptions );

    const transform = solution.concentrationTransform;

    const titleStringProperty = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0labelStringProperty' ], BeersLawLabStrings.concentrationStringProperty ],
      ( pattern, concentrationString ) => StringUtils.format( pattern, concentrationString )
    );

    // e.g. display units that are specific to the solution, e.g. '{0} mM'
    assert && assert( !options.numberDisplayOptions.valuePattern, 'ConcentrationControl sets valuePattern' );
    options.numberDisplayOptions.valuePattern = new DerivedProperty(
      [ BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ], transform.unitsStringProperty ],
      ( pattern, unitsString ) => StringUtils.format( pattern, SunConstants.VALUE_NUMBERED_PLACEHOLDER, unitsString )
    );

    assert && assert( options.delta === undefined, 'ConcentrationControl sets delta' );
    options.delta = 1; // in view coordinates

    // fill the track with a linear gradient that corresponds to the solution color
    const trackSize = options.sliderOptions.trackSize!;
    assert && assert( trackSize );
    assert && assert( !options.sliderOptions.trackFillEnabled, 'ConcentrationControl sets trackFillEnabled' );
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
    assert && assert( concentrationRange );
    const numberRange = new Range(
      transform.modelToView( concentrationRange.min ),
      transform.modelToView( concentrationRange.max )
    );

    // ticks at the min and max of the solution's concentration range
    assert && assert( !options.sliderOptions.majorTicks, 'ConcentrationControl sets majorTicks' );
    options.sliderOptions.majorTicks = [
      { value: numberRange.min, label: new Text( numberRange.min, { font: TICK_FONT } ) },
      { value: numberRange.max, label: new Text( numberRange.max, { font: TICK_FONT } ) }
    ];

    super( titleStringProperty, numberProperty, numberRange, options );

    this.solution = solution;

    this.addLinkedElement( solution.concentrationProperty, {
      tandem: options.tandem.createTandem( solution.concentrationProperty.tandem.name )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'ConcentrationControl', ConcentrationControl );