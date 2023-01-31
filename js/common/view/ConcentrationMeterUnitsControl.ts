// Copyright 2022-2023, University of Colorado Boulder

/**
 * ConcentrationMeterUnitsControl is the Preferences dialog control for setting the units for the concentration meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { HBox, HBoxOptions, Text } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem, AquaRadioButtonGroupOptions } from '../../../../sun/js/AquaRadioButtonGroup.js';
import { ConcentrationMeterUnits } from '../BLLQueryParameters.js';
import beersLawLab from '../../beersLawLab.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;

type ConcentrationMeterUnitsControlOptions = SelfOptions & PickRequired<HBoxOptions, 'tandem'>;

export default class ConcentrationMeterUnitsControl extends HBox {

  private readonly disposeConcentrationMeterUnitsControl: () => void;

  public constructor( beakerUnitsProperty: Property<ConcentrationMeterUnits>, providedOptions: ConcentrationMeterUnitsControlOptions ) {

    const options = optionize<ConcentrationMeterUnitsControlOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: 15
    }, providedOptions );

    const labelText = new Text( BeersLawLabStrings.concentrationMeterUnitsStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    const radioButtonGroup = new ConcentrationMeterUnitsRadioButtonGroup( beakerUnitsProperty, {
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    options.children = [ labelText, radioButtonGroup ];

    super( options );

    this.addLinkedElement( beakerUnitsProperty, {
      tandem: options.tandem.createTandem( beakerUnitsProperty.tandem.name )
    } );

    this.disposeConcentrationMeterUnitsControl = (): void => {
      labelText.dispose();
      radioButtonGroup.dispose();
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeConcentrationMeterUnitsControl();
  }
}

type ConcentrationMeterUnitsRadioButtonGroupSelfOptions = EmptySelfOptions;

type ConcentrationMeterUnitsRadioButtonGroupOptions = SelfOptions & PickRequired<AquaRadioButtonGroupOptions, 'tandem'>;

class ConcentrationMeterUnitsRadioButtonGroup extends AquaRadioButtonGroup<ConcentrationMeterUnits> {

  public constructor( beakerUnitsProperty: Property<ConcentrationMeterUnits>, providedOptions: ConcentrationMeterUnitsRadioButtonGroupOptions ) {

    const options = optionize<ConcentrationMeterUnitsRadioButtonGroupOptions, ConcentrationMeterUnitsRadioButtonGroupSelfOptions, AquaRadioButtonGroupOptions>()( {

      // AquaRadioButtonGroupOptions
      orientation: 'horizontal',
      spacing: 15
    }, providedOptions );

    const items: AquaRadioButtonGroupItem<ConcentrationMeterUnits>[] = [
      createItem( 'molesPerLiter', BeersLawLabStrings.units.molesPerLiterStringProperty ),
      createItem( 'percent', BeersLawLabStrings.units.percentStringProperty )
    ];

    super( beakerUnitsProperty, items, options );
  }
}

function createItem( value: ConcentrationMeterUnits, stringProperty: TReadOnlyProperty<string> ): AquaRadioButtonGroupItem<ConcentrationMeterUnits> {
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

beersLawLab.register( 'ConcentrationMeterUnitsControl', ConcentrationMeterUnitsControl );