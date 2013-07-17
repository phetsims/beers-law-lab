// Copyright 2002-2013, University of Colorado Boulder

/**
 * Evaporation control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BLLStrings = require( 'common/BLLStrings' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var EvaporationSlider = require( 'concentration/view/EvaporationSlider' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Evaporator} evaporator
   * @constructor
   */
  function EvaporationControl( evaporator ) {

    var thisControl = this;

    var label = new Text( StringUtils.format( BLLStrings.pattern_0label, BLLStrings.evaporation ), { font: new PhetFont( 22 ) } );

    var slider = new EvaporationSlider( new Range( 0, evaporator.maxEvaporationRate ),
      new Dimension2( 200, 6 ),
      evaporator.evaporationRate,
      evaporator.enabled,
      true );

    var tickFont = new PhetFont( 16 );
    slider.addMajorTick( 0, new Text( BLLStrings.none, { font: tickFont } ) );
    slider.addMajorTick( evaporator.maxEvaporationRate, new Text( BLLStrings.lots, { font: tickFont } ) );

    var content = new Node();
    content.addChild( label );
    content.addChild( slider );

    slider.left = label.right + 10;
    slider.centerY = label.centerY;

    Panel.call( thisControl, content,
      { xMargin: 15, yMargin: 8, fill: '#F0F0F0', stroke: 'gray', lineWidth: 1, resize: false } );
  }

  inherit( Panel, EvaporationControl );

  return EvaporationControl;
} );