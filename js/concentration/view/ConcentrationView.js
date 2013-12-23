// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BeakerNode = require( 'BEERS_LAW_LAB/concentration/view/BeakerNode' );
  var BLLFaucetNode = require( 'BEERS_LAW_LAB/concentration/view/BLLFaucetNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ConcentrationMeterNode = require( 'BEERS_LAW_LAB/concentration/view/ConcentrationMeterNode' );
  var DropperNode = require( 'BEERS_LAW_LAB/concentration/view/DropperNode' );
  var EvaporationControl = require( 'BEERS_LAW_LAB/concentration/view/EvaporationControl' );
  var FaucetFluidNode = require( 'BEERS_LAW_LAB/concentration/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PrecipitateNode = require( 'BEERS_LAW_LAB/concentration/view/PrecipitateNode' );
  var RemoveSoluteButton = require( 'BEERS_LAW_LAB/concentration/view/RemoveSoluteButton' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var SaturatedIndicator = require( 'BEERS_LAW_LAB/concentration/view/SaturatedIndicator' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShakerNode = require( 'BEERS_LAW_LAB/concentration/view/ShakerNode' );
  var ShakerParticlesNode = require( 'BEERS_LAW_LAB/concentration/view/ShakerParticlesNode' );
  var SoluteControls = require( 'BEERS_LAW_LAB/concentration/view/SoluteControls' );
  var SolutionNode = require( 'BEERS_LAW_LAB/concentration/view/SolutionNode' );
  var StockSolutionNode = require( 'BEERS_LAW_LAB/concentration/view/StockSolutionNode' );

  /**
   * @param {ConcentrationModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ConcentrationView( model, mvt ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    // Beaker and stuff inside it
    var beakerNode = new BeakerNode( model.beaker, mvt );
    var solutionNode = new SolutionNode( model.solution, model.beaker, mvt );
    var precipitateNode = new PrecipitateNode( model.precipitate, mvt );
    var saturatedIndicator = new SaturatedIndicator( model.solution );

    // Shaker
    var shakerNode = new ShakerNode( model.shaker, mvt );

    // Shaker particles are drawn using canvas. Specify bounds of the canvas (smaller for speed).
    var shakerParticlesBounds = new Bounds2(
      mvt.modelToViewX( model.beaker.getLeft() ), thisView.layoutBounds.minY,
      mvt.modelToViewX( model.beaker.getRight() ), mvt.modelToViewY( model.beaker.location.y ) );
    var shakerParticlesNode = new ShakerParticlesNode( model.shakerParticles, mvt, shakerParticlesBounds );

    // Dropper
    var dropperNode = new DropperNode( model.dropper, model.solution.solvent, model.solution.solute, mvt );
    var stockSolutionNode = new StockSolutionNode( model.solution.solvent, model.solute, model.dropper, model.beaker, dropperNode.getTipWidth(), mvt );

    // faucets
    var solventFaucetNode = new BLLFaucetNode( model.solventFaucet, mvt );
    var drainFaucetNode = new BLLFaucetNode( model.drainFaucet, mvt );
    var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, mvt );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

    // Concentration meter
    var concentrationMeterNode = new ConcentrationMeterNode( model.concentrationMeter, model.solution, model.dropper,
      solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, mvt );

    // Solute controls
    var soluteListParent = new Node();
    var soluteControls = new SoluteControls( model.solutes, model.solute, model.shaker, model.dropper, soluteListParent );

    // Evaporation control
    var evaporationControl = new EvaporationControl( model.evaporator );

    // Remove Solute button
    var removeSoluteButton = new RemoveSoluteButton( model.solution );

    // Reset All button
    var resetAllButton = new ResetAllButton( function() {
      model.reset();
    } );

    // Rendering order
    thisView.addChild( solventFluidNode );
    thisView.addChild( solventFaucetNode );
    thisView.addChild( drainFluidNode );
    thisView.addChild( drainFaucetNode );
    thisView.addChild( stockSolutionNode );
    thisView.addChild( solutionNode );
    thisView.addChild( beakerNode.mutate( { layerSplit: true } ) ); // beaker is static, put in its own layer
    thisView.addChild( precipitateNode );
    thisView.addChild( saturatedIndicator );
    thisView.addChild( shakerParticlesNode );
    thisView.addChild( shakerNode );
    thisView.addChild( dropperNode );
    thisView.addChild( evaporationControl );
    thisView.addChild( removeSoluteButton );
    thisView.addChild( resetAllButton );
    thisView.addChild( soluteControls );
    thisView.addChild( concentrationMeterNode );
    thisView.addChild( soluteListParent ); // last, so that combo box list is on top

    // Layout for things that don't have a location in the model.
    {
      // centered towards bottom of beaker
      var saturatedIndicatorVisible = saturatedIndicator.visible; // so we can layout an invisible node
      saturatedIndicator.visible = true;
      saturatedIndicator.centerX = beakerNode.centerX;
      saturatedIndicator.bottom = beakerNode.bottom - 30;
      saturatedIndicator.visible = saturatedIndicatorVisible;
      // upper right
      soluteControls.right = concentrationMeterNode.right + 100;
      soluteControls.top = 20;
      // left-aligned below beaker
      evaporationControl.left = mvt.modelToViewPosition( model.beaker.location ).x - mvt.modelToViewDeltaX( model.beaker.size.width / 2 );
      evaporationControl.top = beakerNode.bottom + 30;
      // left of evaporation control
      removeSoluteButton.left = evaporationControl.right + 30;
      removeSoluteButton.centerY = evaporationControl.centerY;
      // lower right
      resetAllButton.left = drainFaucetNode.right + 100;
      resetAllButton.centerY = removeSoluteButton.centerY;
    }
  }

  return inherit( ScreenView, ConcentrationView, { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) } );
} );
