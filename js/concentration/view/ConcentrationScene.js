// Copyright 2002-2013, University of Colorado

/**
 * Scene graph for the "Concentration" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Dimension2 = require( "DOT/Dimension2" );
  var Scene = require( "SCENERY/Scene" );
  var DOM = require( "SCENERY/nodes/DOM" );
  var Node = require( "SCENERY/nodes/Node" );
  var Text = require( "SCENERY/nodes/Text" );
  var inherit = require( "PHET_CORE/inherit" );
  var Range = require( "DOT/Range" );
  var ButtonNode = require( "common/view/ButtonNode" );
  var ResetAllButtonNode = require( "common/view/ResetAllButtonNode" );
  var Solute = require( "concentration/model/Solute" );
  var BeakerNode = require( "concentration/view/BeakerNode" );
  var FaucetNode = require( "concentration/view/FaucetNode" );
  var FaucetFluidNode = require( "concentration/view/FaucetFluidNode" );
  var ShakerNode = require( "concentration/view/ShakerNode" );
  var SolutionNode = require( "concentration/view/SolutionNode" );
  var ShakerParticlesNode = require( "concentration/view/ShakerParticlesNode" );
  var PrecipitateNode = require( "concentration/view/PrecipitateNode" );
  var DropperNode = require( "concentration/view/DropperNode" );
  var StockSolutionNode = require( "concentration/view/StockSolutionNode" );
  var ConcentrationMeterNode = require( "concentration/view/ConcentrationMeterNode" );
  var EvaporatorNode = require( "concentration/view/EvaporatorNode" );
  var SoluteControlsNode = require( "concentration/view/SoluteControlsNode" );

  /**
   * @param {ConcentrationModel} model
   * @param {ModelViewTransform2D} mvt
   * @param strings
   * @param {Function} resetAllCallback
   * @constructor
   */
  function ConcentrationScene( model, mvt, strings, resetAllCallback ) {

    var thisScene = this;
    Scene.call( thisScene, $( '#concentration-scene' ) );

    thisScene.initializeFullscreenEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene
    thisScene.resizeOnWindowResize(); // the scene gets resized to the full screen size

    var beakerNode = new BeakerNode( model.beaker, mvt, strings );
    var solutionNode = new SolutionNode( model.solution, model.beaker, mvt );
    var precipitateNode = new PrecipitateNode( model.precipitate, model.beaker, mvt );
    var shakerNode = new ShakerNode( model.shaker, mvt );
    var shakerParticlesNode = new ShakerParticlesNode( model.shakerParticles, mvt );
    var dropperNode = new DropperNode( model.dropper, model.solution.solvent, model.solution.solute, mvt );
    var stockSolutionNode = new StockSolutionNode( model.solution.solvent, model.solute, model.dropper, model.beaker, DropperNode.TIP_WIDTH, mvt );

    // faucets
    var solventFaucetNode = new FaucetNode( model.solventFaucet, mvt );
    var drainFaucetNode = new FaucetNode( model.drainFaucet, mvt );
    var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, mvt );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

    var concentrationMeterNode = new ConcentrationMeterNode( model.concentrationMeter, model.solution, model.dropper, model.solventFaucet, model.drainFaucet,
                                                             solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode,
                                                             mvt, strings );

    // Solute controls
    var soluteControlsNode = new SoluteControlsNode( model.solutes, model.solute, model.shaker, model.dropper, strings );

    // Evaporator
    var evaporator = new EvaporatorNode( model.evaporator, strings );

    // Remove Solute button
    var removeSoluteButtonNode = new ButtonNode( strings.removeSolute, function () {
      model.solution.soluteAmount.set( 0 );
    } );

    // Reset All button
    var resetAllButtonNode = new ResetAllButtonNode( resetAllCallback );

    // Rendering order
    thisScene.addChild( solventFluidNode );
    thisScene.addChild( solventFaucetNode );
    thisScene.addChild( drainFluidNode );
    thisScene.addChild( drainFaucetNode );
    thisScene.addChild( stockSolutionNode );
    thisScene.addChild( solutionNode );
    thisScene.addChild( beakerNode.mutate( { layerSplit: true } ) ); //TODO experiment to put static nodes in their own layer
    thisScene.addChild( precipitateNode );
    thisScene.addChild( shakerParticlesNode );
    thisScene.addChild( shakerNode );
    thisScene.addChild( dropperNode );
    thisScene.addChild( concentrationMeterNode );
    thisScene.addChild( evaporator );
    // Add anything containing interactive DOM elements last, or they will not receive events.
    thisScene.addChild( removeSoluteButtonNode );
    thisScene.addChild( resetAllButtonNode );
    thisScene.addChild( soluteControlsNode );


    // Layout for things that don't have a location in the model.
    {
      soluteControlsNode.left = beakerNode.right;
      soluteControlsNode.top = 20;
      evaporator.left = mvt.modelToView( model.beaker.location.x - ( model.beaker.size.width / 2 ) );
      evaporator.top = beakerNode.bottom + 30;
      removeSoluteButtonNode.left = evaporator.right + 30;
      removeSoluteButtonNode.centerY = evaporator.centerY;
      resetAllButtonNode.left = drainFaucetNode.right + 10;
      resetAllButtonNode.top = drainFaucetNode.bottom + 5;
    }

    thisScene.step = function ( deltaSeconds ) {
      thisScene.updateScene();
    };
  }

  inherit( ConcentrationScene, Scene );

  return ConcentrationScene;
} );
