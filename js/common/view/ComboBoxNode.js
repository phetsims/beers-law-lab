// Copyright 2002-2013, University of Colorado

//TODO bug: list only receives events every-other time it's popped up
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
  var Path = require( "SCENERY/nodes/Path" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );

  /**
   * @param {Node} itemNode
   * @param {object} options
   * @constructor
   */
  function ButtonNode( itemNode, options ) {
    var thisNode = this;
    Node.call( this );

    // up or down arrow
    var arrow = new Path( { fill: "black" } );
    var arrowHeight = itemNode.height / 2;
    var arrowWidth = 1.5 * arrowHeight;
    if ( options.listPosition === "above" ) {
      arrow.shape = new Shape().moveTo( 0, arrowHeight ).lineTo( arrowWidth / 2, 0 ).lineTo( arrowWidth, arrowHeight ).close(); // up arrow
    }
    else {
      arrow.shape = new Shape().moveTo( 0, 0 ).lineTo( arrowWidth, 0 ).lineTo( arrowWidth / 2, arrowHeight ).close(); // down arrow
    }

    // button background
    var width = itemNode.width + ( 2 * options.buttonXMargin ) + arrow.width + 5;
    var background = new Rectangle( 0, 0, width, itemNode.height + ( 2 * options.buttonYMargin ), options.buttonCornerRadius, options.buttonCornerRadius,
                                    { fill: options.buttonFill, stroke: options.buttonStroke, lineWidth: options.buttonLineWidth } );

    // itemNode's parent
    var itemNodeParent = new Node();

    thisNode.addChild( background );
    thisNode.addChild( arrow );
    thisNode.addChild( itemNodeParent );

    thisNode.setItemNode = function( itemNode ) {
      itemNodeParent.removeAllChildren();
      itemNodeParent.addChild( itemNode );
      itemNode.left = options.buttonXMargin;
      itemNode.top = options.buttonYMargin;
    };
    thisNode.setItemNode( itemNode );

    arrow.left = itemNode.right;
    arrow.centerY = background.centerY;
  }

  inherit( ButtonNode, Node );

  //TODO need a better name for this type, confusing because ComboBoxItem provides a node.
  /**
   * A wrapper around the combo box item, adds margins, etc.
   * @param {ComboBoxItem} item
   * @param {number} width
   * @param {number} height
   * @param {number} xMargin
   * @constructor
   */
  function ItemNode( item, width, height, xMargin ) {
    var thisNode = this;
    Rectangle.call( this, 0, 0, width, height );
    this.item = item;
    thisNode.addChild( item.node );
    item.node.x = xMargin;
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
                          buttonXMargin: 4,
                          buttonYMargin: 4,
                          // list
                          listPosition: "below", // where the list is positioned relative to the button, either "below" or "above"
                          listParent: thisNode, // node that will be used as the list's parent, useful for ensuring that the list is in front of everything else
                          listXMargin: 4,
                          listYMargin: 4,
                          listFill: "white",
                          listStroke: 'black',
                          listLineWidth: 1,
                          listCornerRadius: 5,
                          // items
                          itemXMargin: 6,
                          itemYMargin: 6,
                          itemHighlightFill: "rgb(245,245,245)",
                          itemHighlightStroke: null,
                          itemHighlightLineWidth: 1
                        },
                        options );

    Node.call( thisNode, options );

    // optional label
    if ( options.labelNode !== null ) {
      thisNode.addChild( options.labelNode );
    }

    // determine uniform dimensions for button and list items
    var itemWidth = 0, itemHeight = 0;
    for ( var i = 0; i < items.length; i++ ) {
      var item = items[i];
      if ( item.node.width > itemWidth ) { itemWidth = item.node.width; }
      if ( item.node.height > itemHeight ) { itemHeight = item.node.height; }
    }
    itemWidth += ( 2 * options.itemXMargin );
    itemHeight += ( 2 * options.itemYMargin );

    // button, will be set to correct value when property observer is registered
    var buttonNode = new ButtonNode( new ItemNode( items[0], itemWidth, itemHeight, options.itemXMargin ), options );
    thisNode.addChild( buttonNode );

    // list
    var listWidth = itemWidth + ( 2 * options.listXMargin );
    var listHeight = ( items.length * itemHeight ) + ( 2 * options.listYMargin );
    var listNode = new Rectangle( 0, 0, listWidth, listHeight, options.listCornerRadius, options.listCornerRadius,
                                  { fill: options.listFill, stroke: options.listStroke, lineWidth: options.listLineWidth } );

    // populate list with items
    for ( var i = 0; i < items.length; i++ ) {
      // add item to list
      var itemNode = new ItemNode( items[i], itemWidth, itemHeight, options.itemXMargin );
      listNode.addChild( itemNode );
      itemNode.left = options.listXMargin;
      itemNode.top = options.listYMargin + ( i * itemHeight );

      // item interactivity
      itemNode.cursor = "pointer";
      itemNode.addInputListener(
          {
            enter: function( event ) {
              event.currentTarget.fill = options.itemHighlightFill;
              event.currentTarget.stroke = options.itemHighlightStroke;
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
    if ( options.listPosition === "above" ) {
      listNode.bottom = buttonNode.top;
    }
    else {
      listNode.top = buttonNode.bottom;
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
      buttonNode.setItemNode( new ItemNode( item, itemWidth, itemHeight, options.itemXMargin ) );
    } );
  }

  inherit( ComboBoxNode, Node );

  return ComboBoxNode;
} );