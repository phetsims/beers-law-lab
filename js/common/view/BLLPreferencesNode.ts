// Copyright 2022-2023, University of Colorado Boulder

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
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import beersLawLab from '../../beersLawLab.js';
import BLLPreferences from '../model/BLLPreferences.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BeakerUnitsControl from './BeakerUnitsControl.js';
import ConcentrationMeterUnitsControl from './ConcentrationMeterUnitsControl.js';

type SelfOptions = EmptySelfOptions;

type BLLPreferencesNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class BLLPreferencesNode extends VBox {

  private readonly disposeBLLPreferencesNode: () => void;

  public constructor( providedOptions: BLLPreferencesNodeOptions ) {

    const options = optionize<BLLPreferencesNodeOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      align: 'left',
      spacing: 20,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // 'Show solution volume' checkbox
    const showSolutionVolumeCheckboxTandem = options.tandem.createTandem( 'showSolutionVolumeCheckbox' );
    const showSolutionVolumeText = new Text( BeersLawLabStrings.showSolutionVolumeStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      tandem: showSolutionVolumeCheckboxTandem.createTandem( 'text' )
    } );
    const showSolutionVolumeCheckbox = new Checkbox( BLLPreferences.showSolutionVolumeProperty, showSolutionVolumeText, {
      tandem: showSolutionVolumeCheckboxTandem
    } );

    // 'Show solute amount' checkbox
    const showSoluteAmountCheckboxTandem = options.tandem.createTandem( 'showSoluteAmountCheckbox' );
    const showSoluteAmountText = new Text( BeersLawLabStrings.showSoluteAmountStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      tandem: showSoluteAmountCheckboxTandem.createTandem( 'text' )
    } );
    const showSoluteAmountCheckbox = new Checkbox( BLLPreferences.showSoluteAmountProperty, showSoluteAmountText, {
      tandem: showSoluteAmountCheckboxTandem
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

    this.disposeBLLPreferencesNode = () => {
      showSolutionVolumeText.dispose();
      showSolutionVolumeCheckbox.dispose();
      showSoluteAmountText.dispose();
      showSoluteAmountCheckbox.dispose();
      beakerUnitsControl.dispose();
      concentrationMeterUnitsControl.dispose();
    };
  }

  public override dispose(): void {
    this.disposeBLLPreferencesNode();
    super.dispose();
  }
}

beersLawLab.register( 'BLLPreferencesNode', BLLPreferencesNode );