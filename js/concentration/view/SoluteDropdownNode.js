// Copyright 2002-2013, University of Colorado

/**
 * Bootstrap dropdown for choosing a solute.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */

define( function ( require ) {

  // imports
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var DOM = require( "SCENERY/nodes/DOM" );

  /**
   * @param {Array} solutes (of type Solute)
   * @param {Property} currentSolute (of type Solute)
   * @constructor
   */
  function SoluteDropdownNode( solutes, currentSolute ) {

    var thisNode = this;

    // construct HTML with solute names
    var html =  '<div id="bll-dropdown-test" class="btn-group">' +
                   '<button class="btn btn-info btn-large">' + currentSolute.get().name + '</button>' +
                   '<button class="btn dropdown-toggle btn-large" data-toggle="dropdown">' +
                       '<span class="caret"></span>' +
                   '</button>' +
                   '<ul class="dropdown-menu">';
    solutes.forEach( function( solute ) {
        html = html + '<li>' + solute.name + '</li>';
    });
    html = html + '</ul></div>';

    // create the DOM element
    var $comboBox = $( html );

    //TODO what is this supposed to do? it's provided by the bootstrap-dropdown.js plugin
    $( '#bll-dropdown-test' ).dropdown();

    DOM.call( thisNode, $comboBox );
  }

  Inheritance.inheritPrototype( SoluteDropdownNode, DOM );

  return SoluteDropdownNode;
} );