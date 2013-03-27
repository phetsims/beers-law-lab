// Copyright 2002-2013, University of Colorado

/**
 * Bootstrap button group that controls mutually-exclusive selection of the solute form,
 * either solid (shaker) or stock solution (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var DOM = require( "SCENERY/nodes/DOM" );

  // constants
  var CLASS_SELECTED = "btn-info"; // bootstrap class name for "info" button color
  var CLASS_UNSELECTED = "";  // bootstrap class name for default button color

  function SoluteFormNode( shaker, dropper, strings )  {

    var thisNode = this;

    var $buttonGroup = $( '<div class="btn-group" data-toggle="buttons-radio">' +
                          '<button id="shakerButton" type="button" class="btn btn-large"><i class="bll-shaker-icon" style="margin-right: 10px;"></i>' + strings.solid + '</button>' +
                          '<button id="dropperButton" type="button" class="btn btn-large"><i class="bll-dropper-icon" style="margin-right: 10px;"></i>' + strings.solution + '</button>' +
                          '</div>' );

    DOM.call( thisNode, $buttonGroup[0] );

    var $shakerButton = $buttonGroup.find( "#shakerButton" );
    var $dropperButton = $buttonGroup.find( "#dropperButton" );

    // Sets the button color to indicate whether it's selected.
    var setSelected = function( $button, selected ) {
      $button.removeClass( selected ? CLASS_UNSELECTED : CLASS_SELECTED );
      $button.addClass( selected ? CLASS_SELECTED : CLASS_UNSELECTED );
    };

    // Clicking either button sets visibility of the model elements.
    $shakerButton.bind( 'click', function() {
      shaker.visible.set( true );
    } );
    $dropperButton.bind( 'click', function() {
      dropper.visible.set( true );
    } );

    // Sync the controls with the model, and ensure mutual exclusivity.
    shaker.visible.addObserver( function ( visible ) {
      setSelected( $shakerButton, visible );
      dropper.visible.set( !visible );
    } );
    dropper.visible.addObserver( function ( visible ) {
      setSelected( $dropperButton, visible );
      shaker.visible.set( !visible );
    } );
  }

  inherit( SoluteFormNode, DOM );

  return SoluteFormNode;
});