// Copyright 2013-2016, University of Colorado Boulder

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
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  var BLLQueryParameters = require( 'BEERS_LAW_LAB/common/BLLQueryParameters' );
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
   * @param {Tandem} tandem
   * @constructor
   */
  function BeersLawView( model, modelViewTransform, tandem ) {

    ScreenView.call( this, BLLConstants.SCREEN_VIEW_OPTIONS );

    var lightNode = new LightNode( model.light, modelViewTransform, tandem.createTandem( 'lightNode' ) );
    var cuvetteNode = new CuvetteNode( model.cuvette, model.solutionProperty, modelViewTransform, BLLQueryParameters.cuvetteSnapInterval, tandem.createTandem( 'cuvetteNode' ) );
    var beamNode = new BeamNode( model.beam );
    var detectorNode = new ATDetectorNode( model.detector, model.light, modelViewTransform, tandem.createTandem( 'detectorNode' ) );
    var wavelengthControls = new WavelengthControls( model.solutionProperty, model.light, tandem.createTandem( 'wavelengthControls' ) );
    var rulerNode = new BLLRulerNode( model.ruler, modelViewTransform, tandem.createTandem( 'rulerNode' ) );
    var comboBoxListParent = new Node( { maxWidth: 500 } );
    var solutionControls = new SolutionControls( model.solutions, model.solutionProperty, comboBoxListParent, tandem.createTandem( 'solutionControls' ), { maxWidth: 575 } );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      scale: 1.32,
      listener: function() {
        model.reset();
        wavelengthControls.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Rendering order
    this.addChild( wavelengthControls );
    this.addChild( resetAllButton );
    this.addChild( solutionControls );
    this.addChild( detectorNode );
    this.addChild( cuvetteNode );
    this.addChild( beamNode );
    this.addChild( lightNode );
    this.addChild( rulerNode );
    this.addChild( comboBoxListParent ); // last, so that combo box list is on top

    // Layout for things that don't have a location in the model.
    {
      // below the light
      wavelengthControls.left = lightNode.left;
      wavelengthControls.top = lightNode.bottom + 20;
      // below cuvette
      solutionControls.left = cuvetteNode.left;
      solutionControls.top = cuvetteNode.bottom + 60;
      // bottom right
      resetAllButton.right = this.layoutBounds.right - 30;
      resetAllButton.bottom = this.layoutBounds.bottom - 30;
    }
  }

  beersLawLab.register( 'BeersLawView', BeersLawView );

  return inherit( ScreenView, BeersLawView );
} );
