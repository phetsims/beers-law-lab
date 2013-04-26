// Copyright 2013, University of Colorado

//TODO not for public consumption, to be refined later
//TODO remove dependency on Property
/**
 * Scenery-based radio button, pseudo-Aqua look.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {

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
   * @param {String} text
   * @param textOptions options that will be passed to the Text node
   * @constructor
   */
  function RadioButtonNode( property, value, text, textOptions ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var innerCircle = new Circle( 4, { fill: "black" } );
    var outerCircle = new Circle( 12, { fill: UNSELECTED_COLOR, stroke: CENTER_COLOR } );
    var textNode = new Text( text, textOptions );

    // rendering order
    thisNode.addChild( outerCircle );
    thisNode.addChild( innerCircle );
    thisNode.addChild( textNode );

    // layout
    textNode.left = outerCircle.right + 6;
    textNode.centerY = outerCircle.centerY;

    // sync control with model
    property.addObserver( function( newValue ) {
       outerCircle.fill = ( newValue === value ) ? SELECTED_COLOR : UNSELECTED_COLOR;
    } );

    //TODO this should probably be on 'up' event
    // set property value on 'down' event
    thisNode.addInputListener(
      {
        down: function() {
          property.set( value );
        }
      } );
  }

  inherit( RadioButtonNode, Node );

  return RadioButtonNode;
} );