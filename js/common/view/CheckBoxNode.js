// Copyright 2002-2013, University of Colorado

/**
 * Bootstrap check box wrapped in a DOM node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {

  // imports
  var Inheritance = require("PHETCOMMON/util/Inheritance" );
  var DOM = require("SCENERY/nodes/DOM" );

  /**
   * @param {String} text
   * @param {Property} booleanProperty (type boolean)
   * @constructor
   */
  function CheckBoxNode( text, booleanProperty ) {

    // font-awesome icons
    var ICON_CHECKED = "icon-check";
    var ICON_UNCHECKED = "icon-check-empty";

    // Maps a boolean value to an icon name.
    var getIcon = function( booleanValue ) {
      return booleanValue ? ICON_CHECKED : ICON_UNCHECKED;
    };

    // dynamically create a DOM check box
    var initialIcon = getIcon( booleanProperty.get() );
    var $checkBox = $( '<button class="btn v-button"><p style="font: 16px arial;"><i class="phet-checkbox-icon ' + initialIcon + '" style="float:left; margin-right: 5px;font-size: larger;"></i>' + text + '</p></button>' );
    $checkBox.bind( 'click', function() {
      // toggle the property value
      booleanProperty.set( !booleanProperty.get() );
      // change the icon
      var $icon = $checkBox.find( '.phet-checkbox-icon' );
      $icon.removeClass( ICON_CHECKED ).removeClass( ICON_UNCHECKED );
      $icon.addClass( getIcon( booleanProperty.get() ) );
    } );

    DOM.call( this, $checkBox[0] );
  }

  Inheritance.inheritPrototype( CheckBoxNode, DOM );

  return CheckBoxNode;
});