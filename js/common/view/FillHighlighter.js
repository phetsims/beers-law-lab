// Copyright 2013, University of Colorado

/**
 * Highlights a node by changing its fill color.
 * Highlighting is typically used to as a visual cue to indicate that a node is interactive.
 * <p/>
 * A node is highlighted if:
 * (a) the mouse cursor is moved inside the node's bounding rectangle, or
 * (b) the mouse was been pressed while inside the node's bounding rectangle and not yet released.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {

  var inherit = require( "PHET_CORE/inherit" );

  function FillHighlighter( node, normalFill, highlightFill ) {

    var thisHandler = this;
    var isMouseInside = false;
    var isMousePressed = false;

    var setHighlighted = function( highlighted ) {
      node.fill = highlighted ? highlightFill : normalFill;
    };

    thisHandler.enter = function () {
      isMouseInside = true;
      setHighlighted( true );
    };

    thisHandler.exit = function () {
      isMouseInside = false;
      if ( !isMousePressed ) {
        setHighlighted( false );
      }
    };

    this.down = function() {
      isMousePressed = true;
      setHighlighted( true );
    };

    //TODO this only gets called when the mouse is inside the node
    this.up = function () {
      isMousePressed = false;
      if ( !isMouseInside ) {
        setHighlighted( false );
      }
    };
  }

  return FillHighlighter;
});
