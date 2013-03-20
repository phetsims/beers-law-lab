// Copyright 2002-2013, University of Colorado

/**
 * View container for "Concentration" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Vector2 = require( "DOT/Vector2" );
  var ModelViewTransform2D = require( "PHETCOMMON/view/ModelViewTransform2D" );
  var ConcentrationScene = require( "concentration/view/ConcentrationScene" );

  function ConcentrationView( model, strings ) {

    var view = this;

    // browser window title
    $( 'title' ).html( strings.concentration );

    // background color
    document.bgColor = "white";

    // Reset All callback
    var resetAllCallback = function() {
      model.reset();
      scene.reset();
    };

    // model-view transform (unity)
    var mvt = new ModelViewTransform2D( 1, new Vector2( 0, 0 ) );

    // scene graph
    var scene = new ConcentrationScene( model, mvt, strings, resetAllCallback );

    view.step = function ( deltaSeconds ) {
      scene.step( deltaSeconds );
    };

    // handle resizing of the browser window
    var handleResize = function () {
      //TODO
    };
    $( window ).resize( handleResize );
    handleResize(); // initial size
  }

  return ConcentrationView;
} );