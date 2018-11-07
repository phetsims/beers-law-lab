// Copyright 2018, University of Colorado Boulder

/**
 * Control for changing a solution's concentration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var concentrationString = require( 'string!BEERS_LAW_LAB/concentration' );
  var pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );
  var pattern0Value1UnitsString = require( 'string!BEERS_LAW_LAB/pattern.0value.1units' );

  // constants
  var FONT = new PhetFont( 20 );
  var TICK_FONT = new PhetFont( 16 );

  /**
   * @param {BeersLawSolution} solution
   * @param {Object} [options]
   * @constructor
   */
  function ConcentrationControl( solution, options ) {

    options = _.extend( {

      // NumberControl options
      titleFont: FONT,
      valueFont: FONT,
      arrowButtonScale: 1,
      trackSize: new Dimension2( 200, 15 ),
      thumbSize: new Dimension2( 22, 45 ),
      valueMinBackgroundWidth: 95, // determined empirically

      // single-line horizontal layout
      layoutFunction: function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
        return new HBox( {
          spacing: 5,
          children: [ titleNode, numberDisplay, new HStrut( 5 ), leftArrowButton, slider, rightArrowButton ]
        } );
      }
    }, options );

    // @public (read-only)
    this.solution = solution;

    var transform = solution.concentrationTransform;

    var title = StringUtils.format( pattern0LabelString, concentrationString );

    // e.g. display units that are specific to the solution, e.g. '{0} mM'
    assert && assert( !options.valuePattern, 'ConcentrationControl sets valuePattern' );
    options.valuePattern = StringUtils.format( pattern0Value1UnitsString, '{0}', transform.units );

    assert && assert( options.delta === undefined, 'ConcentrationControl sets delta' );
    options.delta = transform.viewToModel( 1 );

    // fill the track with a linear gradient that corresponds to the solution color
    assert && assert( !options.trackFillEnabled, 'ConcentrationControl sets trackFillEnabled' );
    options.trackFillEnabled = new LinearGradient( 0, 0, options.trackSize.width, 0 )
      .addColorStop( 0, solution.colorRange.min )
      .addColorStop( 1, solution.colorRange.max );

    // map concentration value between model and view
    var numberProperty = new DynamicProperty( new Property( solution.concentrationProperty ), {
      bidirectional: true,

      // Necessary because bidirectional:true
      reentrant: true,

      // map from model to view, apply options.interval to model value
      map: value => transform.modelToView( value ),

      // map from view to model, apply options.interval to model value
      inverseMap: value => transform.viewToModel( value )
    } );

    // convert solution's concentration range from model to view
    var numberRange = new Range(
      transform.modelToView( solution.concentrationRange.min ),
      transform.modelToView( solution.concentrationRange.max )
    );
    
    // ticks at the min and max of the solution's concentration range
    assert && assert( !options.majorTicks, 'ConcentrationControl sets majorTicks' );
    options.majorTicks = [];
    [ numberRange.min, numberRange.max ].forEach( function( value ) {
      options.majorTicks.push( {
        value: value,
        label: new Text( value, { font: TICK_FONT } )
      } );
    } );

    NumberControl.call( this, title, numberProperty, numberRange, options );
  }

  beersLawLab.register( 'ConcentrationControl', ConcentrationControl );

  return inherit( NumberControl, ConcentrationControl );
} );
