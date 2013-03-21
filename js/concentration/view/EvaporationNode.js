// Copyright 2002-2013, University of Colorado

/**
 * Evaporation control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var Range = require( "PHETCOMMON/math/Range" );
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Dimension2 = require( "DOT/Dimension2" );
  var Node = require( "SCENERY/nodes/Node" );
  var Text = require( "SCENERY/nodes/Text" );
  var SliderNode = require( "common/view/SliderNode" );
  var ControlPanelNode = require( "common/view/ControlPanelNode" );

  function EvaporationControlNode( evaporator, strings ) {

    var thisNode = this;

    var labelNode = new Text( strings.evaporation, { font: "18px Arial" } );

    var sliderNode = new SliderNode( new Range( 0, evaporator.maxEvaporationRate ),
                                     new Dimension2( 200, 6 ),
                                     evaporator.evaporationRate,
                                     evaporator.enabled,
                                     true );
    sliderNode.addMajorTick( 0, new Text( strings.none, { font: "14px Arial" } ) );
    sliderNode.addMajorTick( evaporator.maxEvaporationRate, new Text( strings.lots, { font: "14px Arial" } ) );

    var contentNode = new Node();
    contentNode.addChild( labelNode );
    contentNode.addChild( sliderNode );

    sliderNode.left = labelNode.right + 10;
    sliderNode.centerY = labelNode.centerY;

    ControlPanelNode.call( thisNode, contentNode );
  }

  Inheritance.inheritPrototype( EvaporationControlNode, ControlPanelNode );

  return EvaporationControlNode;
} );