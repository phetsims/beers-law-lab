// Copyright 2002-2013, University of Colorado

/**
 * An item in a combo box.
 * This type exists primarily to document the structural contract for items in a combo box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  "use strict"

  /**
   * @param {Node} node scenery node used to render this item
   * @param {object} value the model value of this item
   * @constructor
   */
  function ComboBoxItem( node, value ) {
    this.node = node;
    this.value = value;
  }

  return ComboBoxItem;
} );