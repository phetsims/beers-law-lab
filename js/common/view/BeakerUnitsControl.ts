// Copyright 2022-2023, University of Colorado Boulder

/**
 * BeakerUnitsControl is the Preferences dialog control for setting the units for the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { HBox, HBoxOptions, Text } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem, AquaRadioButtonGroupOptions } from '../../../../sun/js/AquaRadioButtonGroup.js';
import { BeakerUnits } from '../BLLQueryParameters.js';
import beersLawLab from '../../beersLawLab.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

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
      font: PreferencesDialog.CONTENT_FONT,
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    const radioButtonGroup = new BeakerUnitsRadioButtonGroup( beakerUnitsProperty, {
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    options.children = [ labelText, radioButtonGroup ];

    super( options );

    this.addLinkedElement( beakerUnitsProperty, {
      tandem: options.tandem.createTandem( beakerUnitsProperty.tandem.name )
    } );

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
      spacing: 15
    }, providedOptions );

    const items: AquaRadioButtonGroupItem<BeakerUnits>[] = [
      createItem( 'liters', BeersLawLabStrings.units.litersStringProperty ),
      createItem( 'milliliters', BeersLawLabStrings.units.millilitersStringProperty )
    ];

    super( beakerUnitsProperty, items, options );
  }
}

function createItem( value: BeakerUnits, stringProperty: TReadOnlyProperty<string> ): AquaRadioButtonGroupItem<BeakerUnits> {
  return {
    value: value,
    createNode: tandem => new Text( stringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'text' )
    } ),
    tandemName: `${value}${AquaRadioButton.TANDEM_NAME_SUFFIX}`
  };
}

beersLawLab.register( 'BeakerUnitsControl', BeakerUnitsControl );