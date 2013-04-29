// Copyright 2013, University of Colorado

//TODO not for public consumption, to be refined later
//TODO remove dependency on Property
/**
 * Scenery-based radio button, pseudo-Aqua look.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var Circle = require( "SCENERY/nodes/Circle" );
  var Color = require( "common/model/Color" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Text = require( "SCENERY/nodes/Text" );

  var SELECTED_COLOR = new Color( 143, 197, 250 ).toCSS();
  var UNSELECTED_COLOR = 'white';
  var CENTER_COLOR = 'black';

  /**
   * @param {Property} property
   * @param value the value that corresponds to this button, same type as property
   * @param {Node} node
   * @constructor
   */
  function RadioButtonNode( property, value, node ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var outerCircle = new Circle( 12, { fill: UNSELECTED_COLOR, stroke: CENTER_COLOR } );
    var innerCircle = new Circle( 4, { fill: "black" } );

    // rendering order
    thisNode.addChild( outerCircle );
    thisNode.addChild( innerCircle );
    thisNode.addChild( node );

    // layout
    node.left = outerCircle.right + 6;
    node.centerY = outerCircle.centerY;

    // sync control with model
    property.addObserver( function ( newValue ) {
      outerCircle.fill = ( newValue === value ) ? SELECTED_COLOR : UNSELECTED_COLOR;
      innerCircle.visible = ( newValue === value );
    } );

    // set property value on 'up' event
    thisNode.addInputListener(
      {
        up: function () {
          property.set( value );
        }
      } );
  }

  inherit( RadioButtonNode, Node );

  return RadioButtonNode;
} );