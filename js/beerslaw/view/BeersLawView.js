// Copyright 2002-2013, University of Colorado

/**
 * Scene graph for the "Beer's Law" module.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BeamNode = require( "beerslaw/view/BeamNode" );
  var BLLStrings = require( "common/BLLStrings" );
  var Bounds2 = require( "DOT/Bounds2" );
  var CuvetteNode = require( "beerslaw/view/CuvetteNode" );
  var ATDetectorNode = require( "beerslaw/view/ATDetectorNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var LightNode = require( "beerslaw/view/LightNode" );
  var TabView = require( 'JOIST/TabView' );
  var ResetAllButtonNode = require( "common/view/ResetAllButtonNode" );
  var Scene = require( "SCENERY/Scene" );
  var Text = require( "SCENERY/nodes/Text" );
  var WavelengthControlNode = require( "beerslaw/view/WavelengthControlNode" );

  /**
   * @param {BeersLawModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BeersLawView( model, mvt ) {

    var thisView = this;
    TabView.call( thisView );

    var lightNode = new LightNode( model.light, mvt );
    var cuvetteNode = new CuvetteNode( model.cuvette, model.solution, mvt, 0.1 /* snapInterval, cm */ );
    var beamNode = new BeamNode( model.beam );
    var detectorNode = new ATDetectorNode( model.detector, mvt );
    var wavelengthControlNode = new WavelengthControlNode( model.solution, model.light );

    // Reset All button
    var resetAllButtonNode = new ResetAllButtonNode( function () {
      model.reset();
      wavelengthControlNode.reset();
    } );

    // Rendering order
    thisView.addChild( wavelengthControlNode );
    thisView.addChild( detectorNode );
    thisView.addChild( cuvetteNode );
    thisView.addChild( beamNode );
    thisView.addChild( lightNode );
    // Add anything containing interactive DOM elements last, or they will not receive events.
    thisView.addChild( resetAllButtonNode );

    // Layout for things that don't have a location in the model.
    {
      // below the light
      wavelengthControlNode.left = lightNode.left;
      wavelengthControlNode.top = lightNode.bottom + 20;
      // bottom left
      resetAllButtonNode.right = thisView.layoutBounds.maxX - 50;
      resetAllButtonNode.bottom = thisView.layoutBounds.maxY - 50;
    }
  }

  inherit( BeersLawView, TabView, { layoutBounds: new Bounds2( 0, 0, 1024, 700 ) } );

  return BeersLawView;
} );
