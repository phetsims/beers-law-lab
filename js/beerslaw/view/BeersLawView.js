// Copyright 2002-2013, University of Colorado

/**
 * Scene graph for the "Beer's Law" module.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  var Bounds2 = require( "DOT/Bounds2" );
  var inherit = require( "PHET_CORE/inherit" );
  var PlayArea = require( 'SCENERY_PHET/PlayArea' );
  var ResetAllButtonNode = require( "common/view/ResetAllButtonNode" );
  var Scene = require( "SCENERY/Scene" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {BeersLawModel} model
   * @param {ModelViewTransform2D} mvt
   * @param strings
   * @constructor
   */
  function BeersLawScene( model, mvt, strings ) {

    var thisView = this;
    PlayArea.call( thisView );

    // Reset All button
    var resetAllButtonNode = new ResetAllButtonNode( function() {
      model.reset();
    } );

    // Rendering order
    // Add anything containing interactive DOM elements last, or they will not receive events.
    thisView.addChild( resetAllButtonNode );

    // Layout for things that don't have a location in the model.
    resetAllButtonNode.left = 100;
    resetAllButtonNode.top = 100;
  }

  inherit( BeersLawScene, PlayArea, { layoutBounds: new Bounds2( 0, 0, 1024, 700 ) } );

  return BeersLawScene;
} );
