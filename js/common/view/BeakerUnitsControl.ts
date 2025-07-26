// Copyright 2022-2025, University of Colorado Boulder

/**
 * BeakerUnitsControl is the Preferences dialog control for setting the units for the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem, AquaRadioButtonGroupOptions } from '../../../../sun/js/AquaRadioButtonGroup.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import { BeakerUnits } from '../BLLQueryParameters.js';

type SelfOptions = EmptySelfOptions;

type BeakerUnitsControlOptions = SelfOptions & PickRequired<HBoxOptions, 'tandem'>;

export default class BeakerUnitsControl extends HBox {

  private readonly disposeBeakerUnitsControl: () => void;

  public constructor( beakerUnitsProperty: Property<BeakerUnits>, providedOptions: BeakerUnitsControlOptions ) {

    const options = optionize<BeakerUnitsControlOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: 15
    }, providedOptions );

    const labelText = new Text( BeersLawLabStrings.beakerUnitsStringProperty, {
      font: PreferencesDialogConstants.CONTENT_FONT,
      maxWidth: 300
    } );

    const radioButtonGroup = new BeakerUnitsRadioButtonGroup( beakerUnitsProperty, {
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    options.children = [ labelText, radioButtonGroup ];

    super( options );

    this.addLinkedElement( beakerUnitsProperty );

    this.disposeBeakerUnitsControl = (): void => {
      labelText.dispose();
      radioButtonGroup.dispose();
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeBeakerUnitsControl();
  }
}

type BeakerUnitsRadioButtonGroupSelfOptions = EmptySelfOptions;

type BeakerUnitsRadioButtonGroupOptions = SelfOptions & PickRequired<AquaRadioButtonGroupOptions, 'tandem'>;

class BeakerUnitsRadioButtonGroup extends AquaRadioButtonGroup<BeakerUnits> {

  public constructor( beakerUnitsProperty: Property<BeakerUnits>, providedOptions: BeakerUnitsRadioButtonGroupOptions ) {

    const options = optionize<BeakerUnitsRadioButtonGroupOptions, BeakerUnitsRadioButtonGroupSelfOptions, AquaRadioButtonGroupOptions>()( {

      // AquaRadioButtonGroupOptions
      orientation: 'horizontal',
      spacing: 15,
      accessibleName: BeersLawLabStrings.a11y.beakerUnitsRadioButtonGroup.accessibleNameStringProperty,
      accessibleHelpText: BeersLawLabStrings.a11y.beakerUnitsRadioButtonGroup.accessibleHelpTextStringProperty
    }, providedOptions );

    const items: AquaRadioButtonGroupItem<BeakerUnits>[] = [
      {
        value: 'liters',
        createNode: tandem => new Text( BeersLawLabStrings.units.litersStringProperty, {
          font: PreferencesDialogConstants.CONTENT_FONT,
          maxWidth: 100
        } ),
        options: {
          accessibleName: BeersLawLabStrings.a11y.unitsDescription.litersStringProperty
        },
        tandemName: 'litersRadioButton'
      },
      {
        value: 'milliliters',
        createNode: tandem => new Text( BeersLawLabStrings.units.millilitersStringProperty, {
          font: PreferencesDialogConstants.CONTENT_FONT,
          maxWidth: 100
        } ),
        options: {
          accessibleName: BeersLawLabStrings.a11y.unitsDescription.millilitersStringProperty
        },
        tandemName: 'millilitersRadioButton'
      }
    ];

    super( beakerUnitsProperty, items, options );
  }
}

beersLawLab.register( 'BeakerUnitsControl', BeakerUnitsControl );