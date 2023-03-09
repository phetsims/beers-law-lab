// Copyright 2013-2023, University of Colorado Boulder

/**
 * Scene graph for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawModel from '../model/BeersLawModel.js';
import ATDetectorNode from './ATDetectorNode.js';
import BeamNode from './BeamNode.js';
import BLLRulerNode from './BLLRulerNode.js';
import CuvetteNode from './CuvetteNode.js';
import LightNode from './LightNode.js';
import SolutionPanel from './SolutionPanel.js';
import WavelengthPanel from './WavelengthPanel.js';
import BLLConstants from '../../common/BLLConstants.js';

export default class BeersLawScreenView extends ScreenView {

  public constructor( model: BeersLawModel, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    super( {

      // Workaround for things shifting around while dragging.
      // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/beers-law-lab/issues/299.
      preventFit: true,
      layoutBounds: BLLConstants.LAYOUT_BOUNDS,
      tandem: tandem
    } );

    const lightNode = new LightNode( model.light, modelViewTransform, {
      tandem: tandem.createTandem( 'lightNode' )
    } );

    const cuvetteNode = new CuvetteNode( model.cuvette, model.solutionProperty, modelViewTransform, {
      tandem: tandem.createTandem( 'cuvetteNode' )
    } );

    const beamNode = new BeamNode( model.beam );

    const detectorNode = new ATDetectorNode( model.detector, model.light, modelViewTransform, {
      tandem: tandem.createTandem( 'detectorNode' )
    } );

    const wavelengthPanel = new WavelengthPanel( model.solutionProperty, model.light, {
      // below the light
      left: lightNode.left,
      top: lightNode.bottom + 20,
      tandem: tandem.createTandem( 'wavelengthPanel' )
    } );

    const rulerNode = new BLLRulerNode( model.ruler, modelViewTransform, {
      tandem: tandem.createTandem( 'rulerNode' )
    } );

    const comboBoxListParent = new Node();

    const solutionPanel = new SolutionPanel( model.solutions, model.solutionProperty, model.solutionInCuvette,
      comboBoxListParent, {
        // below the cuvette
        left: cuvetteNode.left,
        top: cuvetteNode.bottom + 60,
        tandem: tandem.createTandem( 'solutionPanel' )
      } );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.right - 30,
      bottom: this.layoutBounds.bottom - 30,
      scale: 1.32,
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    const screenViewRootNode = new Node( {
      children: [
        wavelengthPanel,
        resetAllButton,
        solutionPanel,
        detectorNode,
        cuvetteNode,
        beamNode,
        lightNode,
        rulerNode,
        comboBoxListParent // last, so that combo box list is on top
      ]
    } );
    this.addChild( screenViewRootNode );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

beersLawLab.register( 'BeersLawScreenView', BeersLawScreenView );