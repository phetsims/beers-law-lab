// Copyright 2013-2020, University of Colorado Boulder

/**
 * Scene graph for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import BLLQueryParameters from '../../common/BLLQueryParameters.js';
import ATDetectorNode from './ATDetectorNode.js';
import BeamNode from './BeamNode.js';
import BLLRulerNode from './BLLRulerNode.js';
import CuvetteNode from './CuvetteNode.js';
import LightNode from './LightNode.js';
import SolutionControls from './SolutionControls.js';
import WavelengthControls from './WavelengthControls.js';

class BeersLawScreenView extends ScreenView {

  /**
   * @param {BeersLawModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( model, modelViewTransform, tandem ) {

    super( merge( {
      tandem: tandem
    }, BLLConstants.SCREEN_VIEW_OPTIONS ) );

    const lightNode = new LightNode( model.light, modelViewTransform, tandem.createTandem( 'lightNode' ) );
    const cuvetteNode = new CuvetteNode( model.cuvette, model.solutionProperty, modelViewTransform, BLLQueryParameters.cuvetteSnapInterval, tandem.createTandem( 'cuvetteNode' ) );
    const beamNode = new BeamNode( model.beam );
    const detectorNode = new ATDetectorNode( model.detector, model.light, modelViewTransform, tandem.createTandem( 'detectorNode' ) );
    const wavelengthControls = new WavelengthControls( model.solutionProperty, model.light, tandem.createTandem( 'wavelengthControls' ) );
    const rulerNode = new BLLRulerNode( model.ruler, modelViewTransform, tandem.createTandem( 'rulerNode' ) );
    const comboBoxListParent = new Node();
    const solutionControls = new SolutionControls( model.solutions, model.solutionProperty, comboBoxListParent, tandem.createTandem( 'solutionControls' ), { maxWidth: 575 } );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      scale: 1.32,
      listener: () => {
        model.reset();
        wavelengthControls.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Rendering order
    this.addChild( wavelengthControls );
    this.addChild( resetAllButton );
    this.addChild( solutionControls );
    this.addChild( detectorNode );
    this.addChild( cuvetteNode );
    this.addChild( beamNode );
    this.addChild( lightNode );
    this.addChild( rulerNode );
    this.addChild( comboBoxListParent ); // last, so that combo box list is on top

    // Layout for things that don't have a position in the model.
    {
      // below the light
      wavelengthControls.left = lightNode.left;
      wavelengthControls.top = lightNode.bottom + 20;
      // below cuvette
      solutionControls.left = cuvetteNode.left;
      solutionControls.top = cuvetteNode.bottom + 60;
      // bottom right
      resetAllButton.right = this.layoutBounds.right - 30;
      resetAllButton.bottom = this.layoutBounds.bottom - 30;
    }
  }
}

beersLawLab.register( 'BeersLawScreenView', BeersLawScreenView );
export default BeersLawScreenView;