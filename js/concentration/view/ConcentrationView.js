// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BeakerNode = require( 'concentration/view/BeakerNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ConcentrationMeterNode = require( 'concentration/view/ConcentrationMeterNode' );
  var DOM = require( 'SCENERY/nodes/DOM' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DropperNode = require( 'concentration/view/DropperNode' );
  var EvaporationControl = require( 'concentration/view/EvaporationControl' );
  var FaucetFluidNode = require( 'concentration/view/FaucetFluidNode' );
  var FaucetNode = require( 'concentration/view/FaucetNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PrecipitateNode = require( 'concentration/view/PrecipitateNode' );
  var Range = require( 'DOT/Range' );
  var RemoveSoluteButton = require( 'concentration/view/RemoveSoluteButton' );
  var ResetAllButton = require( 'common/view/ResetAllButton' );
  var SaturatedIndicator = require( 'concentration/view/SaturatedIndicator' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShakerNode = require( 'concentration/view/ShakerNode' );
  var ShakerParticlesNode = require( 'concentration/view/ShakerParticlesNode' );
  var Solute = require( 'concentration/model/Solute' );
  var SoluteControls = require( 'concentration/view/SoluteControls' );
  var SolutionNode = require( 'concentration/view/SolutionNode' );
  var StockSolutionNode = require( 'concentration/view/StockSolutionNode' );

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
    var precipitateNode = new PrecipitateNode( model.precipitate, model.beaker, mvt );
    var saturatedIndicator = new SaturatedIndicator( model.solution );

    // Shaker
    var shakerNode = new ShakerNode( model.shaker, mvt );
    var shakerParticlesNode = new ShakerParticlesNode( model.shakerParticles, thisView.layoutBounds, model.beaker.getLeft(), model.beaker.getRight(), mvt );

    // Dropper
    var dropperNode = new DropperNode( model.dropper, model.solution.solvent, model.solution.solute, mvt );
    var stockSolutionNode = new StockSolutionNode( model.solution.solvent, model.solute, model.dropper, model.beaker, dropperNode.getTipWidth(), mvt );

    // faucets
    var solventFaucetNode = new FaucetNode( model.solventFaucet, mvt, { scale: 0.75 } );
    var drainFaucetNode = new FaucetNode( model.drainFaucet, mvt, { scale: 0.75 } );
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

  inherit( ScreenView, ConcentrationView, { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) } );

  return ConcentrationView;
} );
