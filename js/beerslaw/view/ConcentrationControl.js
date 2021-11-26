// Copyright 2018-2021, University of Colorado Boulder

/**
 * Control for changing a solution's concentration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { HStrut } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { LinearGradient } from '../../../../scenery/js/imports.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import BeersLawSolution from '../model/BeersLawSolution.js';

// constants
const FONT = new PhetFont( 20 );
const TICK_FONT = new PhetFont( 16 );
const SLIDER_INTERVAL = 5; // in view units

class ConcentrationControl extends NumberControl {

  /**
   * @param {BeersLawSolution} solution
   * @param {Object} [options]
   */
  constructor( solution, options ) {
    assert && assert( solution instanceof BeersLawSolution );

    options = merge( {

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

        // phet-io
        // {Property.<number>} - keep track of the underlying model Property to form a LinkedElement to from the slider.
        // This helps support a good PhET-iO Studio interface. See Slider.phetioLinkedProperty
        phetioLinkedProperty: solution.concentrationProperty
      },

      // single-line horizontal layout
      layoutFunction: ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
        return new HBox( {
          spacing: 5,
          children: [ titleNode, numberDisplay, new HStrut( 5 ), leftArrowButton, slider, rightArrowButton ]
        } );
      }
    }, options );

    const transform = solution.concentrationTransform;

    const title = StringUtils.format( beersLawLabStrings.pattern[ '0label' ], beersLawLabStrings.concentration );

    // e.g. display units that are specific to the solution, e.g. '{0} mM'
    assert && assert( !options.numberDisplayOptions.valuePattern, 'ConcentrationControl sets valuePattern' );
    options.numberDisplayOptions.valuePattern = StringUtils.format( beersLawLabStrings.pattern[ '0value' ][ '1units' ],
      SunConstants.VALUE_NUMBERED_PLACEHOLDER, transform.units );

    assert && assert( options.delta === undefined, 'ConcentrationControl sets delta' );
    options.delta = 1; // in view coordinates

    // fill the track with a linear gradient that corresponds to the solution color
    assert && assert( !options.sliderOptions.trackFillEnabled, 'ConcentrationControl sets trackFillEnabled' );
    options.sliderOptions.trackFillEnabled = new LinearGradient( 0, 0, options.sliderOptions.trackSize.width, 0 )
      .addColorStop( 0, solution.colorRange.min )
      .addColorStop( 1, solution.colorRange.max );

    // map concentration value between model and view
    const numberProperty = new DynamicProperty( new Property( solution.concentrationProperty ), {
      bidirectional: true,

      // Necessary because bidirectional:true
      reentrant: true,

      // map from model to view, apply options.interval to model value
      map: value => transform.modelToView( value ),

      // map from view to model, apply options.interval to model value
      inverseMap: value => transform.viewToModel( value )
    } );

    // convert solution's concentration range from model to view
    const numberRange = new Range(
      transform.modelToView( solution.concentrationProperty.range.min ),
      transform.modelToView( solution.concentrationProperty.range.max )
    );

    // ticks at the min and max of the solution's concentration range
    assert && assert( !options.sliderOptions.majorTicks, 'ConcentrationControl sets majorTicks' );
    options.sliderOptions.majorTicks = [];
    [ numberRange.min, numberRange.max ].forEach( value => {
      options.sliderOptions.majorTicks.push( {
        value: value,
        label: new Text( value, { font: TICK_FONT } )
      } );
    } );

    super( title, numberProperty, numberRange, options );

    // @public (read-only)
    this.solution = solution;
  }
}

beersLawLab.register( 'ConcentrationControl', ConcentrationControl );
export default ConcentrationControl;