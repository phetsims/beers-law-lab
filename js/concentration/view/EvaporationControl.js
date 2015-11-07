// Copyright 2013-2015, University of Colorado Boulder

/**
 * Evaporation control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var evaporationString = require( 'string!BEERS_LAW_LAB/evaporation' );
  var lotsString = require( 'string!BEERS_LAW_LAB/lots' );
  var noneString = require( 'string!BEERS_LAW_LAB/none' );
  var pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );

  /**
   * @param {Evaporator} evaporator
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function EvaporationControl( evaporator, tandem, options ) {

    options = _.extend( {
      xMargin: 15,
      yMargin: 8,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      resize: false
    }, options );

    var thisControl = this;

    var label = new Text( StringUtils.format( pattern0LabelString, evaporationString ), { font: new PhetFont( 22 ) } );

    var slider = new HSlider( evaporator.evaporationRateProperty, new Range( 0, evaporator.maxEvaporationRate ), {
      trackSize: new Dimension2( 200, 6 ),
      enabledProperty: evaporator.enabledProperty,
      endDrag: function() { evaporator.evaporationRateProperty.set( 0 ); },  // at end of drag, snap evaporation rate back to zero
      tandem: tandem.createTandem( 'evaporationSlider' )
    } );

    var tickFont = new PhetFont( 16 );
    slider.addMajorTick( 0, new Text( noneString, { font: tickFont } ) );
    slider.addMajorTick( evaporator.maxEvaporationRate, new Text( lotsString, { font: tickFont } ) );

    var content = new Node();
    content.addChild( label );
    content.addChild( slider );

    slider.left = label.right + 10;
    slider.centerY = label.centerY;

    Panel.call( thisControl, content, options );
  }

  return inherit( Panel, EvaporationControl );
} );