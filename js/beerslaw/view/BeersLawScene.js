// Copyright 2002-2013, University of Colorado

/**
 * Scene graph for the "Beer's Law" module.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  var inherit = require( "PHET_CORE/inherit" );
  var ResetAllButtonNode = require( "common/view/ResetAllButtonNode" );
  var Scene = require( "SCENERY/Scene" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {BeersLawModel} model
   * @param {ModelViewTransform2D} mvt
   * @param strings
   * @param {Function} resetAllCallback
   * @constructor
   */
  function BeersLawScene( model, mvt, strings, resetAllCallback ) {

    var thisScene = this;
    Scene.call( thisScene, $( '#beers-law-scene' ) );

    thisScene.initializeFullscreenEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene
    thisScene.resizeOnWindowResize(); // the scene gets resized to the full screen size

    // Reset All button
    var resetAllButtonNode = new ResetAllButtonNode( resetAllCallback );

    // Rendering order
    // Add anything containing interactive DOM elements last, or they will not receive events.
    thisScene.addChild( resetAllButtonNode );

    // Layout for things that don't have a location in the model.
    {
      resetAllButtonNode.left = 100;
      resetAllButtonNode.top = 100;
    }

    thisScene.step = function ( deltaSeconds ) {
      thisScene.updateScene();
    };
  }

  inherit( BeersLawScene, Scene );

  return BeersLawScene;
} );
