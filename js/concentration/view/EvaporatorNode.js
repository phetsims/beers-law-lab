// Copyright 2002-2013, University of Colorado

/**
 * Evaporator.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var ControlPanelNode = require( "common/view/ControlPanelNode" );
  var Dimension2 = require( "DOT/Dimension2" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Range = require( "DOT/Range" );
  var SliderNode = require( "common/view/SliderNode" );
  var Text = require( "SCENERY/nodes/Text" );

  function EvaporatorNode( evaporator ) {

    var thisNode = this;

    var labelNode = new Text( BLLStrings.evaporation, { font: "18px Arial" } );

    var sliderNode = new SliderNode( new Range( 0, evaporator.maxEvaporationRate ),
                                     new Dimension2( 200, 6 ),
                                     evaporator.evaporationRate,
                                     evaporator.enabled,
                                     true );
    sliderNode.addMajorTick( 0, new Text( BLLStrings.none, { font: "14px Arial" } ) );
    sliderNode.addMajorTick( evaporator.maxEvaporationRate, new Text( BLLStrings.lots, { font: "14px Arial" } ) );

    var contentNode = new Node();
    contentNode.addChild( labelNode );
    contentNode.addChild( sliderNode );

    sliderNode.left = labelNode.right + 10;
    sliderNode.centerY = labelNode.centerY;

    ControlPanelNode.call( thisNode, contentNode );
  }

  inherit( EvaporatorNode, ControlPanelNode );

  return EvaporatorNode;
} );