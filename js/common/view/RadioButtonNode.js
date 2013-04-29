// Copyright 2013, University of Colorado

/**
 * Scenery-based radio button, pseudo-Aqua look.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {

  // imports
  var Circle = require( "SCENERY/nodes/Circle" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {Property} property
   * @param value the value that corresponds to this button, same type as property
   * @param {Node} node
   * @param {object} options
   * @constructor
   */
  function RadioButtonNode( property, value, node, options ) {

    var thisNode = this;
    Node.call( thisNode );

    // options
    options = options || {};
    var selectedColor = options.selectedColor || 'rgb( 143, 197, 250 )';
    var unselectedColor = options.unselectedColor || 'white';
    var centerColor = options.centerColor || 'black';
    var buttonSize = options.buttonSize || 12;
    var xSpacing = options.xSpacing || 6;
    var stroke = options.stroke || 'black';

    // nodes
    var outerCircle = new Circle( buttonSize, { fill: unselectedColor, stroke: stroke } );
    var innerCircle = new Circle( buttonSize / 3, { fill: centerColor } );

    // rendering order
    thisNode.addChild( outerCircle );
    thisNode.addChild( innerCircle );
    thisNode.addChild( node );

    // layout
    node.left = outerCircle.right + xSpacing;
    node.centerY = outerCircle.centerY;

    // sync control with model
    property.addObserver( function ( newValue ) {
      outerCircle.fill = ( newValue === value ) ? selectedColor : unselectedColor;
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