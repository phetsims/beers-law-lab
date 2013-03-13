// Copyright 2002-2013, University of Colorado

/**
 * Scene graph for the "Concentration" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "DOT/Dimension2",
    "SCENERY/Scene",
    "SCENERY/nodes/Node",
    "SCENERY/nodes/Text",
    "concentration/view/BeakerNode",
    "concentration/view/FaucetNode",
    "concentration/view/FaucetFluidNode",
    "concentration/view/ShakerNode",
    "concentration/view/SolutionNode"
  ],
  function ( Dimension2, Scene, Node, Text, BeakerNode, FaucetNode, FaucetFluidNode, ShakerNode, SolutionNode ) {
    "use strict";

    function ConcentrationScene( model, mvt, strings ) {

      // Use composition instead of inheritance to hide which scene graph library is used.
      var scene = new Scene( $( '#concentration-scene' ) );

      //TODO this sure is ugly...
      scene.initializeFullscreenEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene
      scene.resizeOnWindowResize(); // the scene gets resized to the full screen size

      var beakerNode = new BeakerNode( model.beaker, mvt, strings );
      var solutionNode = new SolutionNode( model.solution, model.beaker, mvt );
      var shakerNode = new ShakerNode( model.shaker, mvt );

      // faucets
      var solventFaucetNode = new FaucetNode( model.solventFaucet, mvt );
      var drainFaucetNode = new FaucetNode( model.drainFaucet, mvt );
      var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
      var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
      var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, mvt );
      var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

      // Rendering order
      var rootNode = new Node();
      scene.addChild( rootNode );
      rootNode.addChild( solventFluidNode );
      rootNode.addChild( solventFaucetNode )
      rootNode.addChild( drainFluidNode );
      rootNode.addChild( drainFaucetNode );
      rootNode.addChild( solutionNode );
      rootNode.addChild( beakerNode );
      rootNode.addChild( shakerNode );

      this.step = function () {
        scene.updateScene();
      };

      this.reset = function () {
        //TODO
      };

      //TODO center in the window?
      // Scale the scene when the browser window is resized.
      var handleResize = function () {
        var UNITY_WINDOW_SIZE = new Dimension2( 1024, 768 ); // At this window size, scaling is 1.
        var windowSize = new Dimension2( $( window ).width(), $( window ).height() );
        var scale = Math.min( windowSize.width / UNITY_WINDOW_SIZE.width, windowSize.height / UNITY_WINDOW_SIZE.height );
        rootNode.setScale( scale );
      };
      $( window ).resize( handleResize );
      handleResize(); // initial size
    }

    return ConcentrationScene;
  } );
