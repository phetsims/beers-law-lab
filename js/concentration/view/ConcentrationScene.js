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
  var Range = require( "PHETCOMMON/math/Range" );
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
  var SoluteControlNode = require( "concentration/view/SoluteControlNode" );

  /**
   * @param {ConcentrationModel} model
   * @param {ModelViewTransform2D} mvt
   * @param strings
   * @param {Function} resetAllCallback
   * @constructor
   */
  function ConcentrationScene( model, mvt, strings, resetAllCallback ) {

    // Use composition instead of inheritance to hide which scene graph library is used.
    var scene = new Scene( $( '#concentration-scene' ) );
    scene.initializeFullscreenEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene
    scene.resizeOnWindowResize(); // the scene gets resized to the full screen size

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

    // Solute selector
    var soluteControlNode = new SoluteControlNode( model.shaker, model.dropper, strings );

    // Evaporator
    var evaporator = new EvaporatorNode( model.evaporator, strings );

    // Remove Solute button
    var removeSoluteButtonNode = new ButtonNode( strings.removeSolute, function () {
      model.solution.soluteAmount.set( 0 );
    } );

    // Reset All button
    var resetAllButtonNode = new ResetAllButtonNode( resetAllCallback );

    // Rendering order
    scene.addChild( solventFluidNode );
    scene.addChild( solventFaucetNode );
    scene.addChild( drainFluidNode );
    scene.addChild( drainFaucetNode );
    scene.addChild( stockSolutionNode );
    scene.addChild( solutionNode );
    scene.addChild( beakerNode.mutate( { layerSplit: true } ) ); //TODO experiment to put static nodes in their own layer
    scene.addChild( precipitateNode );
    scene.addChild( shakerParticlesNode );
    scene.addChild( shakerNode );
    scene.addChild( dropperNode );
    scene.addChild( concentrationMeterNode );
    scene.addChild( evaporator );
    // add controls last, switch to DOM renderer cause a layer split
    scene.addChild( removeSoluteButtonNode );
    scene.addChild( resetAllButtonNode );
    scene.addChild( soluteControlNode );

    // Layout for things that don't have a location in the model.
    {
      soluteControlNode.left = concentrationMeterNode.left;
      soluteControlNode.bottom = concentrationMeterNode.top - 30;
      evaporator.left = mvt.modelToView( model.beaker.location.x - ( model.beaker.size.width / 2 ) );
      evaporator.top = beakerNode.bottom + 30;
      removeSoluteButtonNode.left = evaporator.right + 30;
      removeSoluteButtonNode.centerY = evaporator.centerY;
      resetAllButtonNode.left = drainFaucetNode.right + 10;
      resetAllButtonNode.top = drainFaucetNode.bottom + 5;
    }

    this.step = function ( deltaSeconds ) {
      scene.updateScene();
    };

    this.reset = function () {
      //TODO
    };

    //TODO center in the window?
    // Scale the scene when the browser window is resized.
    var handleResize = function () {
      var UNITY_WINDOW_SIZE = new Dimension2( 1024, 768 ); // At this window size, scaling is 1.
      var windowSize = new Dimension2( $( window ).width(), $( window ).height() );
      var scale = Math.min( windowSize.width / UNITY_WINDOW_SIZE.width, windowSize.height / UNITY_WINDOW_SIZE.height );
      scene.setScaleMagnitude( scale );
    };
    $( window ).resize( handleResize );
    handleResize(); // initial size
  }

  return ConcentrationScene;
} );
