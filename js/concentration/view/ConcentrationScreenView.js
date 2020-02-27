// Copyright 2013-2020, University of Colorado Boulder

/**
 * View for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BeakerNode = require( 'BEERS_LAW_LAB/concentration/view/BeakerNode' );
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  const BLLDropperNode = require( 'BEERS_LAW_LAB/concentration/view/BLLDropperNode' );
  const BLLFaucetNode = require( 'BEERS_LAW_LAB/concentration/view/BLLFaucetNode' );
  const BLLQueryParameters = require( 'BEERS_LAW_LAB/common/BLLQueryParameters' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ConcentrationMeterNode = require( 'BEERS_LAW_LAB/concentration/view/ConcentrationMeterNode' );
  const EvaporationControl = require( 'BEERS_LAW_LAB/concentration/view/EvaporationControl' );
  const EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  const FaucetFluidNode = require( 'BEERS_LAW_LAB/concentration/view/FaucetFluidNode' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticlesNode = require( 'BEERS_LAW_LAB/concentration/view/ParticlesNode' );
  const RemoveSoluteButton = require( 'BEERS_LAW_LAB/concentration/view/RemoveSoluteButton' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SaturatedIndicator = require( 'BEERS_LAW_LAB/concentration/view/SaturatedIndicator' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const ShakerNode = require( 'BEERS_LAW_LAB/concentration/view/ShakerNode' );
  const SoluteControls = require( 'BEERS_LAW_LAB/concentration/view/SoluteControls' );
  const SoluteGramsNode = require( 'BEERS_LAW_LAB/concentration/view/SoluteGramsNode' );
  const SolutionNode = require( 'BEERS_LAW_LAB/concentration/view/SolutionNode' );
  const StockSolutionNode = require( 'BEERS_LAW_LAB/concentration/view/StockSolutionNode' );

  class ConcentrationScreenView extends ScreenView {

    /**
     * @param {ConcentrationModel} model
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Tandem} tandem
     */
    constructor( model, modelViewTransform, tandem ) {

      super( merge( {
        tandem: tandem
      }, BLLConstants.SCREEN_VIEW_OPTIONS ) );

      // Beaker and stuff inside it
      const beakerNode = new BeakerNode( model.beaker, modelViewTransform, tandem.createTandem( 'beakerNode' ) );
      const solutionNode = new SolutionNode( model.solution, model.beaker, modelViewTransform );

      // Precipitate particles are drawn using canvas. Specify bounds of the canvas (smaller for speed).
      const precipitateNode = new ParticlesNode( model.precipitate, modelViewTransform, new Bounds2(
        modelViewTransform.modelToViewX( model.beaker.getLeft() ), modelViewTransform.modelToViewY( model.beaker.position.y ) - 100,
        modelViewTransform.modelToViewX( model.beaker.getRight() ), modelViewTransform.modelToViewY( model.beaker.position.y ) ) );
      const saturatedIndicator = new SaturatedIndicator( model.solution );

      // Shaker
      const shakerNode = new ShakerNode( model.shaker, modelViewTransform, tandem.createTandem( 'shakerNode' ) );

      // Shaker particles are drawn using canvas. Specify bounds of the canvas (smaller for speed).
      const shakerParticlesNode = new ParticlesNode( model.shakerParticles, modelViewTransform, new Bounds2(
        modelViewTransform.modelToViewX( model.beaker.getLeft() ), this.layoutBounds.minY,
        modelViewTransform.modelToViewX( model.beaker.getRight() ), modelViewTransform.modelToViewY( model.beaker.position.y ) ) );

      // Dropper
      const dropperNode = new BLLDropperNode( model.dropper, model.solution.solvent, model.solution.soluteProperty, modelViewTransform, tandem.createTandem( 'dropperNode' ) );
      const stockSolutionNode = new StockSolutionNode( model.solution.solvent, model.soluteProperty, model.dropper, model.beaker, EyeDropperNode.TIP_WIDTH - 1, modelViewTransform );

      // faucets
      const solventFaucetNode = new BLLFaucetNode( model.solventFaucet, modelViewTransform, tandem.createTandem( 'solventFaucetNode' ) );
      const drainFaucetNode = new BLLFaucetNode( model.drainFaucet, modelViewTransform, tandem.createTandem( 'drainFaucetNode' ) );
      const SOLVENT_FLUID_HEIGHT = model.beaker.position.y - model.solventFaucet.position.y;
      const DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
      const solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, modelViewTransform );
      const drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, modelViewTransform );

      // Concentration meter
      const concentrationMeterNode = new ConcentrationMeterNode( model.concentrationMeter, model.solution, model.dropper,
        solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, modelViewTransform, tandem.createTandem( 'concentrationMeterNode' ) );

      // Solute controls
      const soluteListParent = new Node();
      const soluteControls = new SoluteControls( model.solutes, model.soluteProperty, model.soluteFormProperty, model.shaker,
        model.dropper, soluteListParent, tandem.createTandem( 'soluteControls' ), { maxWidth: 480 } );

      // Evaporation control
      const evaporationControl = new EvaporationControl( model.evaporator, tandem.createTandem( 'evaporationControl' ), { maxWidth: 410 } );

      // Solute amount, in grams
      const soluteGramsNode = new SoluteGramsNode( model.solution.soluteGramsProperty, {
        maxWidth: 200,
        visible: BLLQueryParameters.showSoluteAmount
      } );

      // Remove Solute button
      const removeSoluteButton = new RemoveSoluteButton( model.solution, model.shakerParticles, tandem.createTandem( 'removeSoluteButton' ), {
        maxWidth: 200
      } );

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => model.reset(),
        scale: 1.32,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );

      // Rendering order
      this.addChild( solventFluidNode );
      this.addChild( solventFaucetNode );
      this.addChild( drainFluidNode );
      this.addChild( drainFaucetNode );
      this.addChild( stockSolutionNode );
      this.addChild( solutionNode );
      this.addChild( beakerNode.mutate( { layerSplit: true } ) ); // beaker is static, put in its own layer
      this.addChild( precipitateNode );
      this.addChild( saturatedIndicator );
      this.addChild( shakerParticlesNode );
      this.addChild( shakerNode );
      this.addChild( dropperNode );
      this.addChild( evaporationControl );
      this.addChild( soluteGramsNode );
      this.addChild( removeSoluteButton );
      this.addChild( resetAllButton );
      this.addChild( soluteControls );
      this.addChild( concentrationMeterNode );
      this.addChild( soluteListParent ); // last, so that combo box list is on top

      ////////
      // Layout for things that don't have a position in the model.

      // centered towards bottom of beaker
      const saturatedIndicatorVisible = saturatedIndicator.visible; // so we can layout an invisible node
      saturatedIndicator.visible = true;
      saturatedIndicator.centerX = beakerNode.centerX;
      saturatedIndicator.bottom = beakerNode.bottom - 30;
      saturatedIndicator.visible = saturatedIndicatorVisible;

      // upper right
      soluteControls.right = this.layoutBounds.right - 20;
      soluteControls.top = this.layoutBounds.top + 20;

      // left-aligned below beaker
      evaporationControl.left = modelViewTransform.modelToViewPosition( model.beaker.position ).x -
                                modelViewTransform.modelToViewDeltaX( model.beaker.size.width / 2 );
      evaporationControl.top = beakerNode.bottom + 30;

      if ( soluteGramsNode.visible ) {
        // bottom aligned with evaporator
        removeSoluteButton.left = evaporationControl.right + 30;
        removeSoluteButton.bottom = evaporationControl.bottom;
        //  above button
        soluteGramsNode.left = removeSoluteButton.left;
        soluteGramsNode.bottom = removeSoluteButton.top - 20;
      }
      else {
        // left of evaporation control
        removeSoluteButton.left = evaporationControl.right + 30;
        removeSoluteButton.centerY = evaporationControl.centerY;
      }

      // bottom right
      resetAllButton.right = this.layoutBounds.right - 30;
      resetAllButton.bottom = this.layoutBounds.bottom - 30;
    }
  }

  return beersLawLab.register( 'ConcentrationScreenView', ConcentrationScreenView );
} );
