/**
 * Scene graph for the "Concentration" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "SCENERY/Scene",
    "SCENERY/nodes/Text",
    "concentration/view/ShakerNode"
  ],
  function ( Scene, Text, ShakerNode ) {

    function ConcentrationScene( model, mvt ) {

      var scene = new Scene( $( '#concentration-scene' ) );

      var shakerNode = new ShakerNode( model.shaker, mvt );
      scene.addChild( shakerNode );

      scene.updateScene();
    }

    return ConcentrationScene;
  } );
