/**
 * Scene graph for the "Concentration" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "SCENERY/Scene",
    "SCENERY/nodes/Text",
    "concentration/view/FaucetNode",
    "concentration/view/FaucetFluidNode",
    "concentration/view/ShakerNode"
  ],
  function ( Scene, Text, FaucetNode, FaucetFluidNode, ShakerNode ) {

    function ConcentrationScene( model, mvt ) {

      // Use composition instead of inheritance to hide which scene graph library is used.
      var scene = new Scene( $( '#concentration-scene' ) );

      var shakerNode = new ShakerNode( model.shaker, mvt );

      // faucets
      var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
      var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
      var solventFaucetNode = new FaucetNode( model.solventFaucet, mvt );
      var drainFaucetNode = new FaucetNode( model.drainFaucet, mvt );
      var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, mvt );
      var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

      // Rendering order
      scene.addChild( solventFluidNode );
      scene.addChild( solventFaucetNode );
      scene.addChild( drainFluidNode );
      scene.addChild( drainFaucetNode );
      scene.addChild( shakerNode );

      this.step = function () {
        scene.updateScene();
      };

      this.reset = function() {
        //TODO
      };
    }

    return ConcentrationScene;
  } );
