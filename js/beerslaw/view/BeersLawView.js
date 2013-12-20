// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scene graph for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ATDetectorNode = require( 'BEERS_LAW_LAB/beerslaw/view/ATDetectorNode' );
  var BeamNode = require( 'BEERS_LAW_LAB/beerslaw/view/BeamNode' );
  var BLLRulerNode = require( 'BEERS_LAW_LAB/beerslaw/view/BLLRulerNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CuvetteNode = require( 'BEERS_LAW_LAB/beerslaw/view/CuvetteNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightNode = require( 'BEERS_LAW_LAB/beerslaw/view/LightNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SolutionControls = require( 'BEERS_LAW_LAB/beerslaw/view/SolutionControls' );
  var Text = require( 'SCENERY/nodes/Text' );
  var WavelengthControls = require( 'BEERS_LAW_LAB/beerslaw/view/WavelengthControls' );

  /**
   * @param {BeersLawModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BeersLawView( model, mvt ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    var lightNode = new LightNode( model.light, mvt );
    var cuvetteNode = new CuvetteNode( model.cuvette, model.solution, mvt, 0.1 /* snapInterval, cm */ );
    var beamNode = new BeamNode( model.beam );
    var detectorNode = new ATDetectorNode( model.detector, model.light, mvt );
    var wavelengthControls = new WavelengthControls( model.solution, model.light );
    var rulerNode = new BLLRulerNode( model.ruler, mvt );
    var foregroundNode = new Node();
    var solutionControls = new SolutionControls( model.solutions, model.solution, foregroundNode );

    // Reset All button
    var resetAllButton = new ResetAllButton( function() {
      model.reset();
      wavelengthControls.reset();
    } );

    // Rendering order
    thisView.addChild( wavelengthControls );
    thisView.addChild( resetAllButton );
    thisView.addChild( solutionControls );
    thisView.addChild( detectorNode );
    thisView.addChild( cuvetteNode );
    thisView.addChild( beamNode );
    thisView.addChild( lightNode );
    thisView.addChild( rulerNode );
    thisView.addChild( foregroundNode ); // last, so that combo box list is on top

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

  return inherit( ScreenView, BeersLawView, { layoutBounds: new Bounds2( 0, 0, 1140, 700 ) } );
} );
