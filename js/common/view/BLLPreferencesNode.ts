// Copyright 2022-2025, University of Colorado Boulder

/**
 * BLLPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule. So BLLPreferencesNode and its
 * subcomponents must implement dispose.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLPreferences from '../model/BLLPreferences.js';
import BeakerUnitsControl from './BeakerUnitsControl.js';
import ConcentrationMeterUnitsControl from './ConcentrationMeterUnitsControl.js';

type SelfOptions = EmptySelfOptions;

type BLLPreferencesNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class BLLPreferencesNode extends VBox {

  public constructor( providedOptions: BLLPreferencesNodeOptions ) {

    const options = optionize<BLLPreferencesNodeOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      align: 'left',
      spacing: 20,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // 'Show solution volume' checkbox
    const showSolutionVolumeText = new Text( BeersLawLabStrings.showSolutionVolumeStringProperty, {
      font: PreferencesDialog.CONTENT_FONT
    } );
    const showSolutionVolumeCheckbox = new Checkbox( BLLPreferences.showSolutionVolumeProperty, showSolutionVolumeText, {
      tandem: options.tandem.createTandem( 'showSolutionVolumeCheckbox' )
    } );

    // 'Show solute amount' checkbox
    const showSoluteAmountText = new Text( BeersLawLabStrings.showSoluteAmountStringProperty, {
      font: PreferencesDialog.CONTENT_FONT
    } );
    const showSoluteAmountCheckbox = new Checkbox( BLLPreferences.showSoluteAmountProperty, showSoluteAmountText, {
      tandem: options.tandem.createTandem( 'showSoluteAmountCheckbox' )
    } );

    // 'Beaker units' radio buttons
    const beakerUnitsControl = new BeakerUnitsControl( BLLPreferences.beakerUnitsProperty, {
      tandem: options.tandem.createTandem( 'beakerUnitsControl' )
    } );

    // 'Concentration Meter units' radio buttons
    const concentrationMeterUnitsControl = new ConcentrationMeterUnitsControl( BLLPreferences.concentrationMeterUnitsProperty, {
      tandem: options.tandem.createTandem( 'concentrationMeterUnitsControl' )
    } );

    options.children = [
      showSolutionVolumeCheckbox,
      showSoluteAmountCheckbox,
      beakerUnitsControl,
      concentrationMeterUnitsControl
    ];

    super( options );
  }
}

beersLawLab.register( 'BLLPreferencesNode', BLLPreferencesNode );