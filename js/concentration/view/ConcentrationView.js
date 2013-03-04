/**
 * View container for "Concentration" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "PHETCOMMON/math/Point2D",
    "PHETCOMMON/view/ModelViewTransform2D",
    "concentration/view/ConcentrationScene"
  ],
  function ( Point2D, ModelViewTransform2D, ConcentrationScene ) {

    function ConcentrationView( model, strings ) {

      // browser window title
      $( 'title' ).html( strings.concentration );

      // model-view transform (unity)
      var mvt = new ModelViewTransform2D( 1, new Point2D( 0, 0 ) );

      // scene graph
      new ConcentrationScene( model, mvt );
    }

    return ConcentrationView;
  } );