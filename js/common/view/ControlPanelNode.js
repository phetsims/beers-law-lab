// Copyright 2002-2013, University of Colorado

/**
 * Control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var Shape = require( "KITE/Shape" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );

  /**
   * @param {Node} contentNode
   * @param {Number} xMargin, optional
   * @param {Number} yMargin, optional
   * @constructor
   */
  function ControlPanelNode( contentNode, xMargin, yMargin ) {

    xMargin = ( xMargin || 20 );
    yMargin = ( yMargin || 10 );

    var thisNode = this;
    Node.call( thisNode );

    var panelNode = new Path(
      {
        shape: Shape.roundRect( 0, 0, contentNode.width + ( 2 * xMargin ), contentNode.height + ( 2 * yMargin ), 10, 10 ),
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

  Inheritance.inheritPrototype( ControlPanelNode, Node );

  return ControlPanelNode;
} );