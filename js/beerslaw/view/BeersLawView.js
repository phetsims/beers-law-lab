// Copyright 2002-2013, University of Colorado

/**
 * View container for "Beer's Law" module.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BeersLawScene = require( "beerslaw/view/BeersLawScene" );
  var Dimension2 = require( "DOT/Dimension2" );
  var ModelViewTransform2D = require( "PHETCOMMON/view/ModelViewTransform2D" );
  var Vector2 = require( "DOT/Vector2" );

  function BeersLawView( model, strings ) {

    var thisView = this;

    // browser window title
    $( 'title' ).html( strings.concentration );

    // background color
    document.bgColor = "white";

    // Reset All callback
    var resetAllCallback = function () {
      model.reset();
    };

    // model-view transform (unity)
    var mvt = new ModelViewTransform2D( 1, new Vector2( 0, 0 ) );

    // scene graph
    var scene = new BeersLawScene( model, mvt, strings, resetAllCallback );

    thisView.step = function ( deltaSeconds ) {
      scene.step( deltaSeconds );
    };

    //TODO center in the window?
    // Scale the scene when the browser window is resized.
    var handleResize = function () {
      var UNITY_WINDOW_SIZE = new Dimension2( 1024, 768 ); // At this window size, scaling is 1.
      var windowSize = new Dimension2( $( window ).width(), $( window ).height() );
      var scale = Math.min( windowSize.width / UNITY_WINDOW_SIZE.width, windowSize.height / UNITY_WINDOW_SIZE.height );
      scene.setScaleMagnitude( scale );
    };
    $( window ).resize( handleResize );
    handleResize(); // initial size
  }

  return BeersLawView;
} );