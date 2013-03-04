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
    "concentration/view/ShakerNode"
  ],
  function ( Scene, Text, FaucetNode, ShakerNode ) {

    function ConcentrationScene( model, mvt ) {

      var scene = new Scene( $( '#concentration-scene' ) );

      var shakerNode = new ShakerNode( model.shaker, mvt );
      var solventFaucetNode = new FaucetNode( model.solventFaucet, mvt );
      var drainFaucetNode = new FaucetNode( model.drainFaucet, mvt );

      // Rendering order
      scene.addChild( solventFaucetNode );
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
