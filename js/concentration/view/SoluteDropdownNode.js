// Copyright 2002-2013, University of Colorado

//TODO button needs to be as wide as widest choice
//TODO no hand cursor over dropdown
//TODO clicking on current-selection button doesn't show dropdown, must click on caret button
//TODO add icons to indicate solute colors
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

    var $currentSelectionButton = $comboBox.find( "bll-solute-dropdown-button" );

    // Process selection of options in dropdown.
    $comboBox.find( "li" ).bind( 'click', function ( /* {jQuery.Event} */ event ) {
      var soluteName = event.delegateTarget.innerHTML;
      console.log( "click: " + soluteName );
      //TODO use soluteName to set text on #bll-solute-dropdown-button
      //TODO var selectedSolute = get solute from solutes[], store an index in the <li> as a custom attribute?
      //TODO currentSolute.set( selectedSolute );
    } );
  }

  Inheritance.inheritPrototype( SoluteDropdownNode, DOM );

  return SoluteDropdownNode;
} );