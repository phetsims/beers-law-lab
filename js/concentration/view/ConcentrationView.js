// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeakerNode = require( 'BEERS_LAW_LAB/concentration/view/BeakerNode' );
  var BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  var BLLDropperNode = require( 'BEERS_LAW_LAB/concentration/view/BLLDropperNode' );
  var BLLFaucetNode = require( 'BEERS_LAW_LAB/concentration/view/BLLFaucetNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ConcentrationMeterNode = require( 'BEERS_LAW_LAB/concentration/view/ConcentrationMeterNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var EvaporationControl = require( 'BEERS_LAW_LAB/concentration/view/EvaporationControl' );
  var FaucetFluidNode = require( 'BEERS_LAW_LAB/concentration/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ParticlesNode = require( 'BEERS_LAW_LAB/concentration/view/ParticlesNode' );
  var RemoveSoluteButton = require( 'BEERS_LAW_LAB/concentration/view/RemoveSoluteButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SaturatedIndicator = require( 'BEERS_LAW_LAB/concentration/view/SaturatedIndicator' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShakerNode = require( 'BEERS_LAW_LAB/concentration/view/ShakerNode' );
  var SoluteControls = require( 'BEERS_LAW_LAB/concentration/view/SoluteControls' );
  var Sound = require( 'VIBE/Sound' );
  var SolutionNode = require( 'BEERS_LAW_LAB/concentration/view/SolutionNode' );
  var StockSolutionNode = require( 'BEERS_LAW_LAB/concentration/view/StockSolutionNode' );
  var WaterVolumeSound = require( 'BEERS_LAW_LAB/concentration/view/WaterVolumeSound' );

  // audio
  var solidAudio = require( 'audio!BEERS_LAW_LAB/solid' );
  var soluteAudio = require( 'audio!BEERS_LAW_LAB/water-drop' );

  /**
   * @param {ConcentrationModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ConcentrationView( model, modelViewTransform ) {

    var thisView = this;
    ScreenView.call( thisView, BLLConstants.SCREEN_VIEW_OPTIONS );

    // Beaker and stuff inside it
    var beakerNode = new BeakerNode( model.beaker, modelViewTransform );
    var solutionNode = new SolutionNode( model.solution, model.beaker, modelViewTransform );
    // Precipitate particles are drawn using canvas. Specify bounds of the canvas (smaller for speed).
    var precipitateNode = new ParticlesNode( model.precipitate, modelViewTransform, new Bounds2(
      modelViewTransform.modelToViewX( model.beaker.getLeft() ), modelViewTransform.modelToViewY( model.beaker.location.y ) - 100,
      modelViewTransform.modelToViewX( model.beaker.getRight() ), modelViewTransform.modelToViewY( model.beaker.location.y ) ) );
    var saturatedIndicator = new SaturatedIndicator( model.solution );

    // Shaker
    var shakerNode = new ShakerNode( model.shaker, modelViewTransform );

    // Shaker particles are drawn using canvas. Specify bounds of the canvas (smaller for speed).
    var shakerParticlesNode = new ParticlesNode( model.shakerParticles, modelViewTransform, new Bounds2(
      modelViewTransform.modelToViewX( model.beaker.getLeft() ), thisView.layoutBounds.minY,
      modelViewTransform.modelToViewX( model.beaker.getRight() ), modelViewTransform.modelToViewY( model.beaker.location.y ) ) );

    // Dropper
    var dropperNode = new BLLDropperNode( model.dropper, model.solution.solvent, model.solution.solute, modelViewTransform );
    var stockSolutionNode = new StockSolutionNode( model.solution.solvent, model.solute, model.dropper, model.beaker, dropperNode.TIP_WIDTH - 1, modelViewTransform );

    // faucets
    var solventFaucetNode = new BLLFaucetNode( model.solventFaucet, modelViewTransform );
    var drainFaucetNode = new BLLFaucetNode( model.drainFaucet, modelViewTransform );
    var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, modelViewTransform );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, modelViewTransform );

    // Concentration meter
    var concentrationMeterNode = new ConcentrationMeterNode( model.concentrationMeter, model.solution, model.dropper,
      solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, modelViewTransform );

    // Solute controls
    var soluteListParent = new Node();
    var soluteControls = new SoluteControls( model.solutes, model.solute, model.shaker, model.dropper, soluteListParent );

    // Evaporation control
    var evaporationControl = new EvaporationControl( model.evaporator );

    // Remove Solute button
    var removeSoluteButton = new RemoveSoluteButton( model.solution, model.shakerParticles );

    // Reset All button
    var resetAllButton = new ResetAllButton(
      {
        listener: function() { model.reset(); },
        scale: 1.32
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
      evaporationControl.left = modelViewTransform.modelToViewPosition( model.beaker.location ).x - modelViewTransform.modelToViewDeltaX( model.beaker.size.width / 2 );
      evaporationControl.top = beakerNode.bottom + 30;
      // left of evaporation control
      removeSoluteButton.left = evaporationControl.right + 30;
      removeSoluteButton.centerY = evaporationControl.centerY;
      // lower right
      resetAllButton.left = drainFaucetNode.right + 100;
      resetAllButton.centerY = removeSoluteButton.centerY;
    }

    // sounds
    var solidSound = new Sound( solidAudio );
    var soluteSound = new Sound( soluteAudio );
    model.shaker.visible.lazyLink( function( visible ) {
      // play the sound effect that indicates that a solid has been selected
      console.log( 'visible = ' + visible );
      if ( visible ) {
        solidSound.play();
      }
    } );

    model.dropper.visible.lazyLink( function( visible ) {
      // play the sound effect that indicates that a solid has been selected
      if ( visible ) {
        soluteSound.play();
      }
    } );

    var waterFlowing = new DerivedProperty( [ model.solventFaucet.flowRate, model.drainFaucet.flowRate ],
      function( incomingFlowRate, outgoingFlowRate ) {
        return ( incomingFlowRate > 0 || outgoingFlowRate > 0 );
      } );

    // handle the sound for when water if flowing in and/or out of the beaker
    var waterVolumeSound = new WaterVolumeSound();
    waterFlowing.link( function( waterIsFlowing ) {
      if ( waterIsFlowing ) {
        waterVolumeSound.on();
      }
      else {
        waterVolumeSound.off();
      }
    } );

    model.solution.volume.lazyLink( function( volume ) {
      console.log( 'volume = ' + volume );
      waterVolumeSound.setWaterLevel( volume );

    } );
  }

  return inherit( ScreenView, ConcentrationView );
} );
