// Copyright 2013-2019, University of Colorado Boulder

/**
 * Scene graph for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ATDetectorNode = require( 'BEERS_LAW_LAB/beerslaw/view/ATDetectorNode' );
  const BeamNode = require( 'BEERS_LAW_LAB/beerslaw/view/BeamNode' );
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  const BLLQueryParameters = require( 'BEERS_LAW_LAB/common/BLLQueryParameters' );
  const BLLRulerNode = require( 'BEERS_LAW_LAB/beerslaw/view/BLLRulerNode' );
  const CuvetteNode = require( 'BEERS_LAW_LAB/beerslaw/view/CuvetteNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LightNode = require( 'BEERS_LAW_LAB/beerslaw/view/LightNode' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SolutionControls = require( 'BEERS_LAW_LAB/beerslaw/view/SolutionControls' );
  const WavelengthControls = require( 'BEERS_LAW_LAB/beerslaw/view/WavelengthControls' );

  /**
   * @param {BeersLawModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function BeersLawScreenView( model, modelViewTransform, tandem ) {

    ScreenView.call( this, merge( {
        tandem: tandem
      }, BLLConstants.SCREEN_VIEW_OPTIONS ) );

    const lightNode = new LightNode( model.light, modelViewTransform, tandem.createTandem( 'lightNode' ) );
    const cuvetteNode = new CuvetteNode( model.cuvette, model.solutionProperty, modelViewTransform, BLLQueryParameters.cuvetteSnapInterval, tandem.createTandem( 'cuvetteNode' ) );
    const beamNode = new BeamNode( model.beam );
    const detectorNode = new ATDetectorNode( model.detector, model.light, modelViewTransform, tandem.createTandem( 'detectorNode' ) );
    const wavelengthControls = new WavelengthControls( model.solutionProperty, model.light, tandem.createTandem( 'wavelengthControls' ) );
    const rulerNode = new BLLRulerNode( model.ruler, modelViewTransform, tandem.createTandem( 'rulerNode' ) );
    const comboBoxListParent = new Node();
    const solutionControls = new SolutionControls( model.solutions, model.solutionProperty, comboBoxListParent, tandem.createTandem( 'solutionControls' ), { maxWidth: 575 } );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
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

    // Layout for things that don't have a position in the model.
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

  beersLawLab.register( 'BeersLawScreenView', BeersLawScreenView );

  return inherit( ScreenView, BeersLawScreenView );
} );
