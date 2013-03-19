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
  var DOMButtonNode = require( "concentration/view/DOMButtonNode" );
  var ResetAllButtonNode = require( "concentration/view/ResetAllButtonNode" );

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

    // Remove Solute button
    var removeSoluteButtonNode = new DOMButtonNode( strings.removeSolute, function() {
      console.log( "ConcentrationScene.removeSoluteButtonNode" ); //XXX
      model.solution.soluteAmount.set( 0 );
    });
    removeSoluteButtonNode.x = beakerNode.centerX;
    removeSoluteButtonNode.y = beakerNode.bottom + 50; //TODO with spacing = 0, there is overlap

    // Reset All button
    var resetAllButtonNode = new ResetAllButtonNode( resetAllCallback );
    resetAllButtonNode.left = removeSoluteButtonNode.right + 30;
    resetAllButtonNode.top = removeSoluteButtonNode.top;

    // Rendering order
    var rootNode = new Node();
    scene.addChild( rootNode );
    rootNode.addChild( removeSoluteButtonNode );
    rootNode.addChild( resetAllButtonNode );
    rootNode.addChild( solventFluidNode );
    rootNode.addChild( solventFaucetNode );
    rootNode.addChild( drainFluidNode );
    rootNode.addChild( drainFaucetNode );
    rootNode.addChild( stockSolutionNode );
    rootNode.addChild( solutionNode );
    rootNode.addChild( beakerNode );
    rootNode.addChild( precipitateNode );
    rootNode.addChild( shakerParticlesNode );
    rootNode.addChild( shakerNode );
    rootNode.addChild( dropperNode );
    rootNode.addChild( concentrationMeterNode );

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
      rootNode.setScaleMagnitude( scale );
    };
    $( window ).resize( handleResize );
    handleResize(); // initial size
  }

  return ConcentrationScene;
} );
