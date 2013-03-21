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
  var Shape = require( "KITE/Shape" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Text = require( "SCENERY/nodes/Text" );
  var SliderNode = require( "common/view/SliderNode" );

  // constants
  var X_MARGIN = 20;
  var Y_MARGIN = 10;

  function EvaporationControlNode( evaporator, strings ) {

    var thisNode = this;
    Node.call( thisNode );

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

    var panelNode = new Path(
      {
        shape: Shape.roundRect( 0, 0, contentNode.width + ( 2 * X_MARGIN ), contentNode.height + ( 2 * Y_MARGIN ), 10, 10 ),
        fill: '#F0F0F0',
        stroke: 'gray',
        lineWidth: 1
      }
    );
    thisNode.addChild( panelNode );
    thisNode.addChild( contentNode );
    contentNode.centerX = panelNode.centerX;
    contentNode.centerY = panelNode.centerY;
  }

  Inheritance.inheritPrototype( EvaporationControlNode, Node );

  return EvaporationControlNode;
} );