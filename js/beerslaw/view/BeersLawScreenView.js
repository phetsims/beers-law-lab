// Copyright 2013-2021, University of Colorado Boulder

/**
 * Scene graph for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import BLLQueryParameters from '../../common/BLLQueryParameters.js';
import BeersLawModel from '../model/BeersLawModel.js';
import ATDetectorNode from './ATDetectorNode.js';
import BeamNode from './BeamNode.js';
import BLLRulerNode from './BLLRulerNode.js';
import CuvetteNode from './CuvetteNode.js';
import LightNode from './LightNode.js';
import SolutionPanel from './SolutionPanel.js';
import WavelengthPanel from './WavelengthPanel.js';

class BeersLawScreenView extends ScreenView {

  /**
   * @param {BeersLawModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( model, modelViewTransform, options ) {
    assert && assert( model instanceof BeersLawModel );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, BLLConstants.SCREEN_VIEW_OPTIONS, options );

    super( options );

    const lightNode = new LightNode( model.light, modelViewTransform, {
      tandem: options.tandem.createTandem( 'lightNode' )
    } );

    const cuvetteNode = new CuvetteNode( model.cuvette, model.solutionProperty, modelViewTransform, BLLQueryParameters.cuvetteSnapInterval, {
      tandem: options.tandem.createTandem( 'cuvetteNode' )
    } );

    const beamNode = new BeamNode( model.beam );

    const detectorNode = new ATDetectorNode( model.detector, model.light, modelViewTransform, {
      tandem: options.tandem.createTandem( 'detectorNode' )
    } );

    const wavelengthPanel = new WavelengthPanel( model.solutionProperty, model.light, {
      // below the light
      left: lightNode.left,
      top: lightNode.bottom + 20,
      tandem: options.tandem.createTandem( 'wavelengthPanel' )
    } );

    const rulerNode = new BLLRulerNode( model.ruler, modelViewTransform, {
      tandem: options.tandem.createTandem( 'rulerNode' )
    } );

    const comboBoxListParent = new Node();

    const solutionPanel = new SolutionPanel( model.solutions, model.solutionProperty, comboBoxListParent, {
      // below the cuvette
      left: cuvetteNode.left,
      top: cuvetteNode.bottom + 60,
      maxWidth: 575,
      tandem: options.tandem.createTandem( 'solutionPanel' )
    } );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.right - 30,
      bottom: this.layoutBounds.bottom - 30,
      scale: 1.32,
      listener: () => model.reset(),
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // Rendering order
    this.addChild( wavelengthPanel );
    this.addChild( resetAllButton );
    this.addChild( solutionPanel );
    this.addChild( detectorNode );
    this.addChild( cuvetteNode );
    this.addChild( beamNode );
    this.addChild( lightNode );
    this.addChild( rulerNode );
    this.addChild( comboBoxListParent ); // last, so that combo box list is on top
  }
}

beersLawLab.register( 'BeersLawScreenView', BeersLawScreenView );
export default BeersLawScreenView;