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

    // browser window title
    $( 'title' ).html( strings.concentration );

    // background color
    document.bgColor = "white";

    // model-view transform (unity)
    var mvt = new ModelViewTransform2D( 1, new Vector2( 0, 0 ) );

    // scene graph
    var scene = new ConcentrationScene( model, mvt, strings );

    this.step = function ( deltaSeconds ) {
      scene.step( deltaSeconds );
    };

    this.reset = function () {
      scene.reset();
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