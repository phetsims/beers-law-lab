// Copyright 2013-2025, University of Colorado Boulder

/**
 * View for the 'Concentration' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import EyeDropperNode from '../../../../scenery-phet/js/EyeDropperNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import ConcentrationModel from '../model/ConcentrationModel.js';
import BeakerNode from './BeakerNode.js';
import BLLDropperNode from './BLLDropperNode.js';
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
import SolutionVolumeNode from './SolutionVolumeNode.js';
import StockSolutionNode from './StockSolutionNode.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import ConcentrationScreenSummaryContent from './ConcentrationScreenSummaryContent.js';
import SolventFaucetNode from './SolventFaucetNode.js';
import DrainFaucetNode from './DrainFaucetNode.js';

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

    // Shaker and dropper are labeled with the solute formula. If the formula is null, use the solute name.
    const soluteLabelStringProperty = DerivedProperty.deriveAny( [
      model.soluteProperty,
      ...model.getSoluteNameProperties(),
      ...model.getSoluteFormulaProperties()
    ], () => {
      const solute = model.soluteProperty.value;
      const formula = solute.formulaProperty.value;
      const name = solute.nameProperty.value;
      return formula ? StringUtils.wrapLTR( formula ) : name;
    }, {
      tandem: tandem.createTandem( 'soluteLabelStringProperty' ),
      phetioValueType: StringIO,
      phetioFeatured: true,
      phetioDocumentation: 'The label used on the shaker and dropper'
    } );

    // Shaker and dropper are described by the solute name, not the solute formula.
    const soluteDescriptionStringProperty = DerivedProperty.deriveAny(
      [ model.shaker.soluteProperty, ...model.getSoluteNameProperties() ],
      () => model.soluteProperty.value.nameProperty.value );

    // Shaker
    const shakerNode = new ShakerNode( model.shaker, soluteLabelStringProperty, soluteDescriptionStringProperty, modelViewTransform, {
      tandem: tandem.createTandem( 'shakerNode' )
    } );

    // Shaker particles are drawn using canvas. Specify bounds of the canvas (smaller for speed).
    const shakerParticlesNode = new ShakerParticlesNode( model.shakerParticles, modelViewTransform, new Bounds2(
      modelViewTransform.modelToViewX( model.beaker.left ), this.layoutBounds.minY,
      modelViewTransform.modelToViewX( model.beaker.right ), modelViewTransform.modelToViewY( model.beaker.position.y ) ) );

    // Dropper
    const dropperNode = new BLLDropperNode( model.dropper, model.solution, model.beaker.volume,
      soluteLabelStringProperty, soluteDescriptionStringProperty, modelViewTransform, {
        tandem: tandem.createTandem( 'dropperNode' )
      } );
    const stockSolutionNode = new StockSolutionNode( model.solution.solvent, model.soluteProperty, model.dropper,
      model.beaker, EyeDropperNode.TIP_WIDTH - 1, modelViewTransform );

    // faucets
    const solventFaucetNode = new SolventFaucetNode( model.solventFaucet, modelViewTransform,
      tandem.createTandem( 'solventFaucetNode' ) );
    const drainFaucetNode = new DrainFaucetNode( model.drainFaucet, modelViewTransform,
      tandem.createTandem( 'drainFaucetNode' ) );
    const SOLVENT_FLUID_HEIGHT = model.beaker.position.y - model.solventFaucet.position.y;
    const DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    const solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, modelViewTransform );
    const drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, modelViewTransform );

    // Concentration meter
    const concentrationMeterNode = new ConcentrationMeterNode(
      model.concentrationMeter,
      model.concentrationProbeJumpPositions,
      model.concentrationProbeJumpPositionIndexProperty,
      model.solution,
      model.dropper,
      solutionNode,
      stockSolutionNode,
      solventFluidNode,
      drainFluidNode,
      modelViewTransform, {
        tandem: tandem.createTandem( 'concentrationMeterNode' )
      } );

    // Solute controls
    const soluteListParent = new Node();
    const solutePanel = new SolutePanel( model.solutes, model.soluteProperty, model.soluteFormProperty, soluteListParent, {
      tandem: tandem.createTandem( 'solutePanel' )
    } );

    // Evaporation panel
    const evaporationPanel = new EvaporationPanel( model.evaporator, {
      tandem: tandem.createTandem( 'evaporationPanel' )
    } );

    // Solute amount, in grams
    const soluteAmountNode = new SoluteAmountText( model.solution.soluteGramsProperty, {
      tandem: tandem.createTandem( 'soluteAmountNode' )
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

    // 'Solute Controls' accessible heading
    const soluteControlsHeading = new Node( {
      pdomOrder: [ shakerNode, dropperNode, solutePanel ],
      accessibleHeading: BeersLawLabStrings.a11y.accessibleHeadings.soluteControlsHeadingStringProperty
    } );

    // 'Concentration Meter' accessible heading
    const concentrationMeterHeading = new Node( {
      pdomOrder: [ concentrationMeterNode, saturatedIndicator ],
      accessibleHeading: BeersLawLabStrings.a11y.accessibleHeadings.concentrationMeterHeadingStringProperty
    } );

    // 'Beaker Controls' accessible heading
    const beakerControlsHeading = new Node( {
      pdomOrder: [ soluteAmountNode, solutionVolumeNode, solventFaucetNode, drainFaucetNode, evaporationPanel, removeSoluteButton ],
      accessibleHeading: BeersLawLabStrings.a11y.accessibleHeadings.beakerControlsHeadingStringProperty
    } );

    // Rendering order
    const screenViewRootNode = new Node( {
      children: [

        // Accessible headings can be put anywhere in rendering order because they have no children. Put them all first.
        soluteControlsHeading,
        concentrationMeterHeading,
        beakerControlsHeading,

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
        soluteAmountNode,
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
      soluteAmountNode.visibleProperty,
      evaporationPanel.boundsProperty,
      removeSoluteButton.boundsProperty,
      soluteAmountNode.boundsProperty
    ], () => {
      if ( soluteAmountNode.visible ) {
        // bottom aligned with evaporator
        removeSoluteButton.left = evaporationPanel.right + 30;
        removeSoluteButton.bottom = evaporationPanel.bottom;
        //  above button
        soluteAmountNode.left = removeSoluteButton.left;
        soluteAmountNode.bottom = removeSoluteButton.top - 20;
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

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      soluteControlsHeading,
      concentrationMeterHeading,
      beakerControlsHeading
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      resetAllButton
    ];

    this.setScreenSummaryContent( new ConcentrationScreenSummaryContent( model, concentrationMeterNode.probeNode ) );
  }
}

beersLawLab.register( 'ConcentrationScreenView', ConcentrationScreenView );