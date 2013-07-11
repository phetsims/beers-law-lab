// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scene graph for the 'Beer's Law' tab.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ATDetectorNode = require( 'beerslaw/view/ATDetectorNode' );
  var BeamNode = require( 'beerslaw/view/BeamNode' );
  var BLLRulerNode = require( 'beerslaw/view/BLLRulerNode' );
  var BLLStrings = require( 'common/BLLStrings' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CuvetteNode = require( 'beerslaw/view/CuvetteNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightNode = require( 'beerslaw/view/LightNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Scene = require( 'SCENERY/Scene' );
  var SolutionControls = require( 'beerslaw/view/SolutionControls' );
  var TabView = require( 'JOIST/TabView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var WavelengthControls = require( 'beerslaw/view/WavelengthControls' );

  /**
   * @param {BeersLawModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BeersLawView( model, mvt ) {

    var thisView = this;
    TabView.call( thisView, { renderer: 'svg' } );

    var lightNode = new LightNode( model.light, mvt );
    var cuvetteNode = new CuvetteNode( model.cuvette, model.solution, mvt, 0.1 /* snapInterval, cm */ );
    var beamNode = new BeamNode( model.beam );
    var detectorNode = new ATDetectorNode( model.detector, model.light, mvt );
    var wavelengthControls = new WavelengthControls( model.solution, model.light );
    var rulerNode = new BLLRulerNode( model.ruler, mvt );
    var solutionListParent = new Node();
    var solutionControls = new SolutionControls( model.solutions, model.solution, solutionListParent );

    // Reset All button
    var resetAllButton = new ResetAllButton( function() {
      model.reset();
      wavelengthControls.reset();
    } );

    // Rendering order
    thisView.addChild( wavelengthControls );
    thisView.addChild( detectorNode );
    thisView.addChild( cuvetteNode );
    thisView.addChild( beamNode );
    thisView.addChild( lightNode );
    thisView.addChild( resetAllButton );
    thisView.addChild( solutionControls );
    thisView.addChild( rulerNode );
    thisView.addChild( solutionListParent ); // last, so that combo box list is on top

    // Layout for things that don't have a location in the model.
    {
      // below the light
      wavelengthControls.left = lightNode.left;
      wavelengthControls.top = lightNode.bottom + 20;
      // below cuvette
      solutionControls.left = cuvetteNode.left;
      solutionControls.top = cuvetteNode.bottom + 60;
      // bottom left
      resetAllButton.left = solutionControls.right + 20;
      resetAllButton.bottom = solutionControls.bottom;
    }
  }

  inherit( TabView, BeersLawView, { layoutBounds: new Bounds2( 0, 0, 1024, 700 ) } );

  return BeersLawView;
} );
