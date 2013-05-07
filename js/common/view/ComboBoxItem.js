// Copyright 2013, University of Colorado

/**
 * An item in a combo box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function(require){

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
});