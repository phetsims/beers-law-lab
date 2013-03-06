// Copyright 2002-2013, University of Colorado

/**
 * Scene graph for the "Concentration" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "SCENERY/Scene",
    "SCENERY/nodes/Text",
    "concentration/view/BeakerNode",
    "concentration/view/FaucetNode",
    "concentration/view/FaucetFluidNode",
    "concentration/view/ShakerNode"
  ],
  function ( Scene, Text, BeakerNode, FaucetNode, FaucetFluidNode, ShakerNode ) {

    function ConcentrationScene( model, mvt, strings ) {

      // Use composition instead of inheritance to hide which scene graph library is used.
      var scene = new Scene( $( '#concentration-scene' ) );

      //TODO this sure is ugly...
      scene.initializeFullscreenEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene
      scene.resizeOnWindowResize(); // the scene gets resized to the full screen size

      var beakerNode = new BeakerNode( model.beaker, mvt, strings );
      var shakerNode = new ShakerNode( model.shaker, mvt );

      // faucets
      var solventFaucetNode = new FaucetNode( model.solventFaucet, mvt );
      var drainFaucetNode = new FaucetNode( model.drainFaucet, mvt );
      var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
      var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
      var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, mvt );
      var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

      // Rendering order
      scene.addChild( solventFluidNode );
      scene.addChild( solventFaucetNode );
      scene.addChild( drainFluidNode );
      scene.addChild( drainFaucetNode );
      scene.addChild( beakerNode );
      scene.addChild( shakerNode );

      this.step = function () {
        scene.updateScene();
      };

      this.reset = function () {
        //TODO
      };
    }

    return ConcentrationScene;
  } );
