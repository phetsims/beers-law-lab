// Copyright 2002-2013, University of Colorado

/**
 * Evaporation control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var ControlPanelNode = require( "common/view/ControlPanelNode" );
  var Dimension2 = require( "DOT/Dimension2" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Range = require( "DOT/Range" );
  var EvaporationSliderNode = require( "concentration/view/EvaporationSliderNode" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );

  function EvaporationControlNode( evaporator ) {

    var thisNode = this;

    var labelNode = new Text( StringUtils.format( BLLStrings.pattern_0label, [ BLLStrings.evaporation ] ), { font: "22px Arial" } );

    var sliderNode = new EvaporationSliderNode( new Range( 0, evaporator.maxEvaporationRate ),
                                                new Dimension2( 200, 6 ),
                                                evaporator.evaporationRate,
                                                evaporator.enabled,
                                                true );
    var tickFont = "16px Arial";
    sliderNode.addMajorTick( 0, new Text( BLLStrings.none, { font: tickFont } ) );
    sliderNode.addMajorTick( evaporator.maxEvaporationRate, new Text( BLLStrings.lots, { font: tickFont } ) );

    var contentNode = new Node();
    contentNode.addChild( labelNode );
    contentNode.addChild( sliderNode );

    sliderNode.left = labelNode.right + 10;
    sliderNode.centerY = labelNode.centerY;

    ControlPanelNode.call( thisNode, contentNode );
  }

  inherit( EvaporationControlNode, ControlPanelNode );

  return EvaporationControlNode;
} );