// Copyright 2013-2025, University of Colorado Boulder

/**
 * Scene graph for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BLLConstants from '../../common/BLLConstants.js';
import BeersLawModel from '../model/BeersLawModel.js';
import ATDetectorNode from './ATDetectorNode.js';
import BeamNode from './BeamNode.js';
import BLLRulerNode from './BLLRulerNode.js';
import CuvetteNode from './CuvetteNode.js';
import LightNode from './LightNode.js';
import SolutionPanel from './SolutionPanel.js';
import WavelengthPanel from './WavelengthPanel.js';
import BeersLawScreenSummaryContent from './BeersLawScreenSummaryContent.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BLLDescriptionUtils from '../../common/BLLDescriptionUtils.js';

export default class BeersLawScreenView extends ScreenView {

  public constructor( model: BeersLawModel, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    super( {

      // Workaround for things shifting around while dragging.
      // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/beers-law-lab/issues/299.
      preventFit: true,

      // A PhET wide decision was made to not update custom layout bounds even if they do not match the
      // default layout bounds in ScreenView. Do not change these bounds as changes could break or disturb
      // any phet-io instrumention. https://github.com/phetsims/phet-io/issues/1939
      layoutBounds: BLLConstants.LAYOUT_BOUNDS,
      isDisposable: false,
      screenSummaryContent: new BeersLawScreenSummaryContent( model ),
      tandem: tandem
    } );

    // Accessible context response shared by multiple UI components that set the wavelength to lamba max (the preset
    // wavelength) for the selected solution. See https://github.com/phetsims/beers-law-lab/issues/361.
    const wavelengthSetAccessibleContextResponseProperty = new DerivedStringProperty( [
        model.solutionProperty,

        // Localized strings used in this derivation.
        BeersLawLabStrings.a11y.sharedAccessibleContextResponses.presetWavelengthSetStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.nanometersStringProperty
      ],
      ( solution, pattern, nanometersString ) => StringUtils.fillIn( pattern, {
        wavelength: solution.molarAbsorptivityData.lambdaMax,
        units: nanometersString,
        colorName: BLLDescriptionUtils.getColorDescriptionString( solution.molarAbsorptivityData.lambdaMax )
      } ), {
        isDisposable: false
      } );

    const lightNode = new LightNode( model.light, modelViewTransform, {
      tandem: tandem.createTandem( 'lightNode' )
    } );

    const cuvetteNode = new CuvetteNode( model.cuvette, model.solutionProperty, modelViewTransform, {
      tandem: tandem.createTandem( 'cuvetteNode' )
    } );

    const beamNode = new BeamNode( model.beam );

    const detectorNode = new ATDetectorNode(
      model.detector,
      model.detectorProbeJumpPositions,
      model.detectorProbeJumpPositionIndexProperty,
      model.light,
      modelViewTransform, {
        tandem: tandem.createTandem( 'detectorNode' )
      } );

    const wavelengthPanel = new WavelengthPanel( model.light, {
      // below the light
      left: lightNode.left,
      top: lightNode.bottom + 20,
      wavelengthSetAccessibleContextResponseProperty: wavelengthSetAccessibleContextResponseProperty,
      tandem: tandem.createTandem( 'wavelengthPanel' )
    } );

    const rulerNode = new BLLRulerNode( model.ruler, model.rulerJumpPositions, model.rulerJumpPositionIndexProperty,
      modelViewTransform, tandem.createTandem( 'rulerNode' ) );

    const comboBoxListParent = new Node();

    const solutionPanel = new SolutionPanel( model.solutions, model.solutionProperty, model.solutionInCuvette,
      comboBoxListParent, {
        // below the cuvette
        left: cuvetteNode.left,
        top: cuvetteNode.bottom + 60,
        wavelengthSetAccessibleContextResponseProperty: wavelengthSetAccessibleContextResponseProperty,
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

    // 'Light Source Controls' accessible heading
    const lightSourceControlsHeading = new Node( {
      pdomOrder: [ lightNode, wavelengthPanel ],
      accessibleHeading: BeersLawLabStrings.a11y.accessibleHeadings.lightSourceControlsHeadingStringProperty
    } );

    // 'Solution Controls' accessible heading
    const solutionControlsHeading = new Node( {
      pdomOrder: [ cuvetteNode, solutionPanel ],
      accessibleHeading: BeersLawLabStrings.a11y.accessibleHeadings.solutionControlsHeadingStringProperty
    } );

    const screenViewRootNode = new Node( {
      children: [

        // Accessible headings can be put anywhere in rendering order because they have no children. Put them all first.
        lightSourceControlsHeading,
        solutionControlsHeading,

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

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      lightSourceControlsHeading,
      detectorNode,
      solutionControlsHeading,
      rulerNode
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      resetAllButton
    ];
  }
}

beersLawLab.register( 'BeersLawScreenView', BeersLawScreenView );