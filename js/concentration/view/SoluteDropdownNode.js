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
    var html =  '<div id="bll-solute-dropdown" class="btn-group">' +
                   '<button id="bll-solute-dropdown-button" class="btn btn-info btn-large">' + currentSolute.get().name + '</button>' +
                   '<button class="btn dropdown-toggle btn-large" data-toggle="dropdown">' +
                       '<span class="caret"></span>' +
                   '</button>' +
                   '<ul class="dropdown-menu">';
    for ( var i = 0; i < solutes.length; i++ ) {
      html = html + '<li>' + solutes[i].name + '</li>';
    }
    html = html + '</ul></div>';

    // create the DOM element
    var $comboBox = $( html );

    DOM.call( thisNode, $comboBox );

//    $comboBox.find( '.dropdown-toggle' ).dropdown(); //TODO this doesn't seem to be needed?

    var $selectionButton = $comboBox.find( "#bll-solute-dropdown-button" );
    $selectionButton.bind( 'click', function () {
      console.log( "selectionButton.click" );//XXX
    } );

  }

  Inheritance.inheritPrototype( SoluteDropdownNode, DOM );

  return SoluteDropdownNode;
} );