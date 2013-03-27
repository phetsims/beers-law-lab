// Copyright 2002-2013, University of Colorado

//TODO button needs to be as wide as widest choice
//TODO no hand cursor over dropdown
//TODO add icons to indicate solute colors
/**
 * Bootstrap dropdown for choosing a solute.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */

define( function ( require ) {

  // imports
  var DOM = require( "SCENERY/nodes/DOM" );
  var inherit = require( "PHET_CORE/inherit" );

  /**
   * @param {Array} solutes (of type Solute)
   * @param {Property} currentSolute (of type Solute)
   * @constructor
   */
  function SoluteDropdownNode( solutes, currentSolute ) {

    var thisNode = this;

    // construct HTML with solute names
    var html = '<div id="bll-solute-dropdown" class="btn-group">' +
                   '<a id="bll-solute-dropdown-button" class="btn dropdown-toggle btn-info btn-large" data-toggle="dropdown" href="#">' +
                     '<span id="bll-solute-label">' + currentSolute.get().name + "</span>" +
                     '<span class="caret" style="margin-left:10px; float:right"></span>' +
                   '</a>' +
                 '<ul class="dropdown-menu">';
    /*
     * Add each solute to the dropdown.
     * Include a custom attribute to note its index in the solutes array.
     * Use class=btn-large to get same font as text on button.
     */
    for ( var i = 0; i < solutes.length; i++ ) {
      html = html + '<li class="btn-large" solute-index="' + i + '">' + solutes[i].name + '</li>';
    }
    html = html + '</ul></div>';

    // create the DOM element
    var $comboBox = $( html );

    DOM.call( thisNode, $comboBox );

//    $comboBox.find( '.dropdown-toggle' ).dropdown(); //TODO bootstrap doc says to call this, but it doesn't seem to be needed?

    var $currentSelectionButton = $comboBox.find( "#bll-solute-dropdown-button" );

    // Process selection of options in dropdown.
    $comboBox.find( "li" ).bind( 'click', function ( /* {jQuery.Event} */ event ) {
      // Look up the selected solute using the custom attribute that holds the index into the solutes array.
      var index = $( event.delegateTarget ).attr( "solute-index" );
      var selectedSolute = solutes[index];
      // Update the model.
      currentSolute.set( selectedSolute );
    } );

    // Change the button to reflect the selected solute.
    currentSolute.addObserver( function ( solute ) {
      $currentSelectionButton.find( '#bll-solute-label' ).html( solute.name );
      //TODO set color chip or background color of button?
    } );
  }

  inherit( SoluteDropdownNode, DOM );

  return SoluteDropdownNode;
} );