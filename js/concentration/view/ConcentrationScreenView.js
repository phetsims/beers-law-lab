// Copyright 2013-2022, University of Colorado Boulder

/**
 * View for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import EyeDropperNode from '../../../../scenery-phet/js/EyeDropperNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import BLLQueryParameters from '../../common/BLLQueryParameters.js';
import ConcentrationModel from '../model/ConcentrationModel.js';
import BeakerNode from './BeakerNode.js';
import BLLDropperNode from './BLLDropperNode.js';
import BLLFaucetNode from './BLLFaucetNode.js';
import ConcentrationMeterNode from './ConcentrationMeterNode.js';
import EvaporationPanel from './EvaporationPanel.js';
import FaucetFluidNode from './FaucetFluidNode.js';
import PrecipitateNode from './PrecipitateNode.js';
import RemoveSoluteButton from './RemoveSoluteButton.js';
import SaturatedIndicator from './SaturatedIndicator.js';
import ShakerNode from './ShakerNode.js';
import ShakerParticlesNode from './ShakerParticlesNode.js';
import SoluteGramsNode from './SoluteGramsNode.js';
import SolutePanel from './SolutePanel.js';
import SolutionNode from './SolutionNode.js';
import StockSolutionNode from './StockSolutionNode.js';

class ConcentrationScreenView extends ScreenView {

  /**
   * @param {ConcentrationModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( model, modelViewTransform, options ) {
    assert && assert( model instanceof ConcentrationModel );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      layoutBounds: BLLConstants.LAYOUT_BOUNDS,
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // Beaker and stuff inside it
    const beakerNode = new BeakerNode( model.beaker, modelViewTransform, {
      tandem: options.tandem.createTandem( 'beakerNode' )
    } );
    const solutionNode = new SolutionNode( model.solution, model.beaker, modelViewTransform );

    // Precipitate particles are drawn using canvas. Specify bounds of the canvas (smaller for speed).
    const precipitateNode = new PrecipitateNode( model.precipitate, modelViewTransform, new Bounds2(
      modelViewTransform.modelToViewX( model.beaker.getLeft() ), modelViewTransform.modelToViewY( model.beaker.position.y ) - 100,
      modelViewTransform.modelToViewX( model.beaker.getRight() ), modelViewTransform.modelToViewY( model.beaker.position.y ) ) );
    const saturatedIndicator = new SaturatedIndicator( model.solution.isSaturatedProperty );

    // Shaker
    const shakerNode = new ShakerNode( model.shaker, modelViewTransform, {
      tandem: options.tandem.createTandem( 'shakerNode' )
    } );

    // Shaker particles are drawn using canvas. Specify bounds of the canvas (smaller for speed).
    const shakerParticlesNode = new ShakerParticlesNode( model.shakerParticles, modelViewTransform, new Bounds2(
      modelViewTransform.modelToViewX( model.beaker.getLeft() ), this.layoutBounds.minY,
      modelViewTransform.modelToViewX( model.beaker.getRight() ), modelViewTransform.modelToViewY( model.beaker.position.y ) ) );

    // Dropper
    const dropperNode = new BLLDropperNode( model.dropper, model.solution.solvent, model.solution.soluteProperty, modelViewTransform, {
      tandem: options.tandem.createTandem( 'dropperNode' )
    } );
    const stockSolutionNode = new StockSolutionNode( model.solution.solvent, model.soluteProperty, model.dropper, model.beaker, EyeDropperNode.TIP_WIDTH - 1, modelViewTransform );

    // faucets
    const solventFaucetNode = new BLLFaucetNode( model.solventFaucet, modelViewTransform, {
      tandem: options.tandem.createTandem( 'solventFaucetNode' )
    } );
    const drainFaucetNode = new BLLFaucetNode( model.drainFaucet, modelViewTransform, {
      tandem: options.tandem.createTandem( 'drainFaucetNode' )
    } );
    const SOLVENT_FLUID_HEIGHT = model.beaker.position.y - model.solventFaucet.position.y;
    const DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    const solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, modelViewTransform );
    const drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, modelViewTransform );

    // Concentration meter
    const concentrationMeterNode = new ConcentrationMeterNode( model.concentrationMeter, model.solution, model.dropper,
      solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, modelViewTransform, {
        tandem: options.tandem.createTandem( 'concentrationMeterNode' )
      } );

    // Solute controls
    const soluteListParent = new Node();
    const solutePanel = new SolutePanel( model.solutes, model.soluteProperty, model.soluteFormProperty, model.shaker,
      model.dropper, soluteListParent, {
        tandem: options.tandem.createTandem( 'solutePanel' ),
        maxWidth: 480
      } );

    // Evaporation panel
    const evaporationPanel = new EvaporationPanel( model.evaporator, {
      maxWidth: 410,
      tandem: options.tandem.createTandem( 'evaporationPanel' )
    } );

    // Solute amount, in grams
    const soluteGramsNode = new SoluteGramsNode( model.solution.soluteGramsProperty, {
      maxWidth: 200,
      visible: BLLQueryParameters.showSoluteAmount
    } );

    // Remove Solute button
    const removeSoluteButton = new RemoveSoluteButton( model.solution, model.shakerParticles, {
      tandem: options.tandem.createTandem( 'removeSoluteButton' ),
      maxWidth: 200
    } );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      scale: 1.32,
      tandem: options.tandem.createTandem( 'resetAllButton' )
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
    this.addChild( evaporationPanel );
    this.addChild( soluteGramsNode );
    this.addChild( removeSoluteButton );
    this.addChild( resetAllButton );
    this.addChild( solutePanel );
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
    solutePanel.right = this.layoutBounds.right - 20;
    solutePanel.top = this.layoutBounds.top + 20;

    // left-aligned below beaker
    evaporationPanel.left = modelViewTransform.modelToViewPosition( model.beaker.position ).x -
                            modelViewTransform.modelToViewDeltaX( model.beaker.size.width / 2 );
    evaporationPanel.top = beakerNode.bottom + 30;

    if ( soluteGramsNode.visible ) {
      // bottom aligned with evaporator
      removeSoluteButton.left = evaporationPanel.right + 30;
      removeSoluteButton.bottom = evaporationPanel.bottom;
      //  above button
      soluteGramsNode.left = removeSoluteButton.left;
      soluteGramsNode.bottom = removeSoluteButton.top - 20;
    }
    else {
      // left of evaporation control
      removeSoluteButton.left = evaporationPanel.right + 30;
      removeSoluteButton.centerY = evaporationPanel.centerY;
    }

    // bottom right
    resetAllButton.right = this.layoutBounds.right - 30;
    resetAllButton.bottom = this.layoutBounds.bottom - 30;
  }
}

beersLawLab.register( 'ConcentrationScreenView', ConcentrationScreenView );
export default ConcentrationScreenView;