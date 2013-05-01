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
  var TabView = require( "JOIST/TabView" );
  var ResetAllButton = require( "SCENERY_PHET/ResetAllButton" );
  var BLLRulerNode = require( "beerslaw/view/BLLRulerNode" );
  var Scene = require( "SCENERY/Scene" );
  var SolutionControlsNode = require( "beerslaw/view/SolutionControlsNode" );
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
    var rulerNode = new BLLRulerNode( model.ruler, mvt );
    var solutionControlsNode = new SolutionControlsNode( model.solutions, model.solution );

    // Reset All button
    var resetAllButton = new ResetAllButton( function () {
      model.reset();
      wavelengthControlNode.reset();
    } );

    // Rendering order
    thisView.addChild( wavelengthControlNode );
    thisView.addChild( detectorNode );
    thisView.addChild( cuvetteNode );
    thisView.addChild( beamNode );
    thisView.addChild( lightNode );
    thisView.addChild( rulerNode );
    thisView.addChild( resetAllButton );
    thisView.addChild( solutionControlsNode );

    // Layout for things that don't have a location in the model.
    {
      // below the light
      wavelengthControlNode.left = lightNode.left;
      wavelengthControlNode.top = lightNode.bottom + 20;
      // below cuvette
      solutionControlsNode.left = cuvetteNode.left;
      solutionControlsNode.top = cuvetteNode.bottom + 35;
      // bottom left
      resetAllButton.left = solutionControlsNode.right + 20;
      resetAllButton.bottom = solutionControlsNode.bottom;
    }
  }

  inherit( BeersLawView, TabView, { layoutBounds: new Bounds2( 0, 0, 1024, 700 ) } );

  return BeersLawView;
} );
