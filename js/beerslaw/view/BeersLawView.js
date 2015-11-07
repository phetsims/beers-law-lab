// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scene graph for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ATDetectorNode = require( 'BEERS_LAW_LAB/beerslaw/view/ATDetectorNode' );
  var BeamNode = require( 'BEERS_LAW_LAB/beerslaw/view/BeamNode' );
  var BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  var BLLRulerNode = require( 'BEERS_LAW_LAB/beerslaw/view/BLLRulerNode' );
  var CuvetteNode = require( 'BEERS_LAW_LAB/beerslaw/view/CuvetteNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightNode = require( 'BEERS_LAW_LAB/beerslaw/view/LightNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SolutionControls = require( 'BEERS_LAW_LAB/beerslaw/view/SolutionControls' );
  var WavelengthControls = require( 'BEERS_LAW_LAB/beerslaw/view/WavelengthControls' );

  /**
   * @param {BeersLawModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BeersLawView( model, modelViewTransform ) {

    var thisView = this;
    ScreenView.call( thisView, BLLConstants.SCREEN_VIEW_OPTIONS );

    var lightNode = new LightNode( model.light, modelViewTransform );
    var cuvetteNode = new CuvetteNode( model.cuvette, model.solutionProperty, modelViewTransform, 0.1 /* snapInterval, cm */ );
    var beamNode = new BeamNode( model.beam );
    var detectorNode = new ATDetectorNode( model.detector, model.light, modelViewTransform );
    var wavelengthControls = new WavelengthControls( model.solutionProperty, model.light );
    var rulerNode = new BLLRulerNode( model.ruler, modelViewTransform );
    var comboBoxListParent = new Node( { maxWidth: 500 });
    var solutionControls = new SolutionControls( model.solutions, model.solutionProperty, comboBoxListParent, { maxWidth: 575 } );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      scale: 1.32,
      listener: function() {
        model.reset();
        wavelengthControls.reset();
      }
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
    thisView.addChild( comboBoxListParent ); // last, so that combo box list is on top

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

  return inherit( ScreenView, BeersLawView );
} );
