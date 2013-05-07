// Copyright 2002-2013, University of Colorado

//TODO bug: list only receives events every-other time it's popped up
//TODO add up/down glyph on button
//TODO add an inside margin to ItemNode
//TODO add cornerRadius to list item highlight
//TODO click outside of list to dismiss it
//TODO support for listParent (and coordinate-frame transforms this requires)
/**
 * Scenery-based combo box. Composed of a button and a list of items.
 * The list of items is displayed when the button is pressed, and dismissed an item is selected
 * or the user clicks outside the list.  The list can be displayed either above or below the button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );

  /**
   * @param {Node} itemNode
   * @param {object} options
   * @constructor
   */
  function ButtonNode( itemNode, options ) {
    var thisNode = this;
    Rectangle.call( this, 0, 0, itemNode.width + ( 2 * options.buttonXMargin ), itemNode.height + ( 2 * options.buttonYMargin ), options.buttonCornerRadius, options.buttonCornerRadius,
                    { fill: options.buttonFill, stroke: options.buttonStroke, lineWidth: options.buttonLineWidth } );
    thisNode.setItemNode = function( itemNode ) {
      thisNode.removeAllChildren();
      thisNode.addChild( itemNode );
      itemNode.left = options.buttonXMargin;
      itemNode.top = options.buttonYMargin;
    };
    thisNode.setItemNode( itemNode );
  }

  inherit( ButtonNode, Rectangle );

  //TODO need a better name for this type, confusing because ComboBoxItem provides a node.
  /**
   * A wrapper around the combo box item, adds margins, etc.
   * @param {ComboBoxItem} item
   * @param {number} width
   * @param {number} height
   * @constructor
   */
  function ItemNode( item, width, height ) {
    var thisNode = this;
    Rectangle.call( this, 0, 0, width, height );
    this.item = item;
    thisNode.addChild( item.node );
    item.node.left = 0;
    item.node.centerY = height / 2;
  }

  inherit( ItemNode, Rectangle );

  /**
   * @param {Array<ComboBoxItem>} items
   * @param {Property<Node>} property
   * @param {object} options
   */
  function ComboBoxNode( items, property, options ) {

    var thisNode = this;

    options = _.extend( {
                          labelNode: null, // optional label, placed to the left of the combo box
                          labelXSpacing: 10, // horizontal space between label and combo box
                          // button
                          buttonFill: "white",
                          buttonStroke: "black",
                          buttonLineWidth: 1,
                          buttonCornerRadius: 3,
                          buttonXMargin: 10,
                          buttonYMargin: 6,
                          // list
                          listPosition: "below", // where the list is positioned relative to the button, either "below" or "above"
                          listParent: thisNode, // node that will be used as the list's parent, useful for ensuring that the list is in front of everything else
                          listXMargin: 10,
                          listYMargin: 5,
                          listYSpacing: 5, // vertical space between items in the list
                          listFill: "white",
                          listStroke: 'black',
                          listLineWidth: 1,
                          listCornerRadius: 5,
                          // list highlighting
                          listHighlightFill: "rgb(218,255,255)",
                          listHighlightStroke: "black",
                          listHighlightLineWidth: 1
                        },
                        options );

    Node.call( thisNode, options );

    // optional label
    if ( options.labelNode !== null ) {
      thisNode.addChild( options.labelNode );
    }

    // determine uniform dimensions for button and list items
    var maxWidth = 0, maxHeight = 0;
    for ( var i = 0; i < items.length; i++ ) {
      var item = items[i];
      if ( item.node.width > maxWidth ) { maxWidth = item.node.width; }
      if ( item.node.height > maxHeight ) { maxHeight = item.node.height; }
    }

    // button, will be set to correct value when property observer is registered
    var buttonNode = new ButtonNode( new ItemNode( items[0], maxWidth, maxHeight ), options );
    thisNode.addChild( buttonNode );

    // list
    var listWidth = maxWidth + ( 2 * options.listXMargin );
    var listHeight = ( items.length * maxHeight ) + ( 2 * options.listYMargin ) + ( ( items.length - 1 ) * options.listYSpacing );
    var listNode = new Rectangle( 0, 0, listWidth, listHeight, options.listCornerRadius, options.listCornerRadius,
                                  { fill: options.listFill, stroke: options.listStroke, lineWidth: options.listLineWidth } );

    // populate list with items
    for ( var i = 0; i < items.length; i++ ) {
      // add item to list
      var itemNode = new ItemNode( items[i], maxWidth, maxHeight );
      listNode.addChild( itemNode );
      itemNode.left = options.listXMargin;
      itemNode.top = options.listYMargin + ( i * maxHeight ) + ( i * options.listYSpacing );

      // item interactivity
      itemNode.cursor = "pointer";
      itemNode.addInputListener(
          {
            enter: function( event ) {
              event.currentTarget.fill = options.listHighlightFill;
              event.currentTarget.stroke = options.listHighlightStroke;
            },
            exit: function( event ) {
              event.currentTarget.fill = null;
              event.currentTarget.stroke = null;
            },
            down: function( event ) {
              console.log( "ComboBoxNode.itemNode.down" );//XXX
              event.currentTarget.fill = null;
              event.currentTarget.stroke = null;
              options.listParent.removeChild( listNode );
              property.set( event.currentTarget.item.value );
            }
          }
      );
    }
    // button interactivity
    buttonNode.cursor = "pointer";
    buttonNode.addInputListener(
        {
          down: function() {
            console.log( "ComboBoxNode.buttonNode.down" );//XXX
            if ( options.listParent.isChild( listNode ) ) {
              options.listParent.removeChild( listNode );
            }
            else {
              options.listParent.addChild( listNode );
            }
          }
        } );


    // layout
    if ( options.labelNode ) {
      buttonNode.left = options.labelNode.right + options.labelXSpacing;
      buttonNode.centerY = options.labelNode.centerY;
    }
    listNode.left = buttonNode.left;
    if ( options.listPosition === "below" ) {
      listNode.top = buttonNode.bottom
    }
    else if ( options.listPosition === "above" ) {
      listNode.bottom = buttonNode.top
    }
    else {
      throw new Error( "unsupported listPosition: " + options.listPosition );
    }

    // when property changes, update button
    property.addObserver( function( value ) {
      // TODO brute force search, better way?
      var item = null;
      for ( var i = 0; i < items.length; i++ ) {
        if ( items[i].value === value ) {
          item = items[i];
        }
      }
      assert && assert( item != null );
      buttonNode.setItemNode( new ItemNode( item, maxWidth, maxHeight ) );
    } );
  }

  inherit( ComboBoxNode, Node );

  return ComboBoxNode;
} );