// Copyright 2022, University of Colorado Boulder

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
    const showSolutionVolumeText = new Text( 'Show solution volume', {
      font: PreferencesDialog.CONTENT_FONT
    } );
    const showSolutionVolumeCheckbox = new Checkbox( BLLPreferences.showSolutionVolumeProperty, showSolutionVolumeText, {
      tandem: options.tandem.createTandem( 'showSolutionVolumeCheckbox' )
    } );

    // 'Show solute amount' checkbox
    const showSoluteAmountText = new Text( 'Show solution amount', {
      font: PreferencesDialog.CONTENT_FONT
    } );
    const showSoluteAmountCheckbox = new Checkbox( BLLPreferences.showSoluteAmountProperty, showSoluteAmountText, {
      tandem: options.tandem.createTandem( 'showSoluteAmountCheckbox' )
    } );

    options.children = [ showSolutionVolumeCheckbox, showSoluteAmountCheckbox ];

    super( options );

    this.disposeBLLPreferencesNode = () => {
      showSolutionVolumeText.dispose();
      showSolutionVolumeCheckbox.dispose();
    };
  }

  public override dispose(): void {
    this.disposeBLLPreferencesNode();
    super.dispose();
  }
}

beersLawLab.register( 'BLLPreferencesNode', BLLPreferencesNode );