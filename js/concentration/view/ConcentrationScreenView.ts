// Copyright 2013-2023, University of Colorado Boulder

/**
 * View for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Node } from '../../../../scenery/js/imports.js';
import EyeDropperNode from '../../../../scenery-phet/js/EyeDropperNode.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import ConcentrationModel from '../model/ConcentrationModel.js';
import BeakerNode from './BeakerNode.js';
import BLLDropperNode from './BLLDropperNode.js';
import BLLFaucetNode from './BLLFaucetNode.js';
import ConcentrationMeterNode from './ConcentrationMeterNode.js';
import EvaporationPanel from './EvaporationPanel.js';
import FaucetFluidNode from './FaucetFluidNode.js';
import PrecipitateParticlesNode from './PrecipitateParticlesNode.js';
import RemoveSoluteButton from './RemoveSoluteButton.js';
import SaturatedIndicator from './SaturatedIndicator.js';
import ShakerNode from './ShakerNode.js';
import ShakerParticlesNode from './ShakerParticlesNode.js';
import SoluteAmountText from './SoluteAmountText.js';
import SolutePanel from './SolutePanel.js';
import SolutionNode from './SolutionNode.js';
import StockSolutionNode from './StockSolutionNode.js';
import SolutionVolumeNode from './SolutionVolumeNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

export default class ConcentrationScreenView extends ScreenView {

  public constructor( model: ConcentrationModel, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    super( {

      // Workaround for things shifting around while dragging.
      // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/beers-law-lab/issues/299.
      preventFit: true,
      layoutBounds: BLLConstants.LAYOUT_BOUNDS,
      tandem: tandem
    } );

    // Beaker and stuff inside it
    const beakerNode = new BeakerNode( model.beaker, modelViewTransform, {
      tandem: tandem.createTandem( 'beakerNode' )
    } );
    const solutionNode = new SolutionNode( model.solution, model.beaker, modelViewTransform );
    const solutionVolumeNode = new SolutionVolumeNode( model.solution.volumeProperty, {
      tandem: tandem.createTandem( 'solutionVolumeNode' )
    } );

    Multilink.multilink( [ solutionNode.boundsProperty, solutionVolumeNode.boundsProperty ],
      () => {
        solutionVolumeNode.right = beakerNode.centerX + model.beaker.size.width / 2;
        solutionVolumeNode.y = solutionNode.top + BLLConstants.SOLUTION_LINE_WIDTH / 2;
      } );

    // PrecipitateParticles particles are drawn using canvas. Specify bounds of the canvas (smaller for speed).
    const precipitateParticlesNode = new PrecipitateParticlesNode( model.precipitateParticles, modelViewTransform, new Bounds2(
      modelViewTransform.modelToViewX( model.beaker.left ), modelViewTransform.modelToViewY( model.beaker.position.y ) - 100,
      modelViewTransform.modelToViewX( model.beaker.right ), modelViewTransform.modelToViewY( model.beaker.position.y ) ) );
    const saturatedIndicator = new SaturatedIndicator( model.solution.isSaturatedProperty, tandem.createTandem( 'saturatedIndicator' ) );

    // Label for the shaker and dropper. If formula is null, use the solute name.
    const soluteLabelStringProperty = DerivedProperty.deriveAny( [
      model.shaker.soluteProperty,
      ...model.solutes.map( solute => solute.formulaProperty ),
      ...model.solutes.map( solute => solute.nameProperty )
    ], () => {
      const solute = model.shaker.soluteProperty.value;
      const formula = solute.formulaProperty.value;
      const name = solute.nameProperty.value;
      return formula ? StringUtils.wrapLTR( formula ) : name;
    }, {
      tandem: tandem.createTandem( 'soluteLabelStringProperty' ),
      phetioValueType: StringIO,
      phetioDocumentation: 'The label used on the shaker and dropper'
    } );

    // Shaker
    const shakerNode = new ShakerNode( model.shaker, soluteLabelStringProperty, modelViewTransform, {
      tandem: tandem.createTandem( 'shakerNode' )
    } );

    // Shaker particles are drawn using canvas. Specify bounds of the canvas (smaller for speed).
    const shakerParticlesNode = new ShakerParticlesNode( model.shakerParticles, modelViewTransform, new Bounds2(
      modelViewTransform.modelToViewX( model.beaker.left ), this.layoutBounds.minY,
      modelViewTransform.modelToViewX( model.beaker.right ), modelViewTransform.modelToViewY( model.beaker.position.y ) ) );

    // Dropper
    const dropperNode = new BLLDropperNode( model.dropper, soluteLabelStringProperty, model.solution.solvent,
      model.solution.soluteProperty, modelViewTransform, {
        tandem: tandem.createTandem( 'dropperNode' )
      } );
    const stockSolutionNode = new StockSolutionNode( model.solution.solvent, model.soluteProperty, model.dropper,
      model.beaker, EyeDropperNode.TIP_WIDTH - 1, modelViewTransform );

    // faucets
    const solventFaucetNode = new BLLFaucetNode( model.solventFaucet, modelViewTransform, {
      tandem: tandem.createTandem( 'solventFaucetNode' )
    } );
    const drainFaucetNode = new BLLFaucetNode( model.drainFaucet, modelViewTransform, {
      tandem: tandem.createTandem( 'drainFaucetNode' )
    } );
    const SOLVENT_FLUID_HEIGHT = model.beaker.position.y - model.solventFaucet.position.y;
    const DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    const solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, modelViewTransform );
    const drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, modelViewTransform );

    // Concentration meter
    const concentrationMeterNode = new ConcentrationMeterNode( model.concentrationMeter, model.solution, model.dropper,
      solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, modelViewTransform, {
        tandem: tandem.createTandem( 'concentrationMeterNode' )
      } );

    // Solute controls
    const soluteListParent = new Node();
    const solutePanel = new SolutePanel( model.solutes, model.soluteProperty, model.soluteFormProperty, model.shaker,
      model.dropper, soluteListParent, {
        tandem: tandem.createTandem( 'solutePanel' )
      } );

    // Evaporation panel
    const evaporationPanel = new EvaporationPanel( model.evaporator, {
      tandem: tandem.createTandem( 'evaporationPanel' )
    } );

    // Solute amount, in grams
    const soluteAmountText = new SoluteAmountText( model.solution.soluteGramsProperty, {
      tandem: tandem.createTandem( 'soluteAmountText' )
    } );

    // Remove Solute button
    const removeSoluteButton = new RemoveSoluteButton( model.solution, model.shakerParticles, {
      tandem: tandem.createTandem( 'removeSoluteButton' )
    } );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
      },
      scale: 1.32,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Rendering order
    const screenViewRootNode = new Node( {
      children: [
        solventFluidNode,
        solventFaucetNode,
        drainFluidNode,
        drainFaucetNode,
        stockSolutionNode,
        solutionNode,
        solutionVolumeNode,
        beakerNode.mutate( { layerSplit: true } ), // beaker is static, put in its own layer
        precipitateParticlesNode,
        saturatedIndicator,
        shakerParticlesNode,
        shakerNode,
        dropperNode,
        evaporationPanel,
        soluteAmountText,
        removeSoluteButton,
        resetAllButton,
        solutePanel,
        concentrationMeterNode,
        soluteListParent // last, so that combo box list is on top
      ]
    } );
    this.addChild( screenViewRootNode );

    // Center 'Saturated' at centerBottom of beaker.
    saturatedIndicator.boundsProperty.link( () => {
      saturatedIndicator.centerX = beakerNode.centerX;
      saturatedIndicator.bottom = beakerNode.bottom - 30;
    } );

    // upper right
    solutePanel.right = this.layoutBounds.right - 20;
    solutePanel.top = this.layoutBounds.top + 20;

    // left-aligned below beaker
    evaporationPanel.left = modelViewTransform.modelToViewPosition( model.beaker.position ).x -
                            modelViewTransform.modelToViewDeltaX( model.beaker.size.width / 2 );
    evaporationPanel.top = beakerNode.bottom + 30;

    Multilink.multilink( [
      soluteAmountText.visibleProperty,
      evaporationPanel.boundsProperty,
      removeSoluteButton.boundsProperty,
      soluteAmountText.boundsProperty
    ], () => {
      if ( soluteAmountText.visible ) {
        // bottom aligned with evaporator
        removeSoluteButton.left = evaporationPanel.right + 30;
        removeSoluteButton.bottom = evaporationPanel.bottom;
        //  above button
        soluteAmountText.left = removeSoluteButton.left;
        soluteAmountText.bottom = removeSoluteButton.top - 20;
      }
      else {
        // left of evaporation control
        removeSoluteButton.left = evaporationPanel.right + 30;
        removeSoluteButton.centerY = evaporationPanel.centerY;
      }
    } );

    // bottom right
    resetAllButton.right = this.layoutBounds.right - 30;
    resetAllButton.bottom = this.layoutBounds.bottom - 30;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'ConcentrationScreenView', ConcentrationScreenView );