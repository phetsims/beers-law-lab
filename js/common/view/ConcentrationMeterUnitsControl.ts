// Copyright 2022-2025, University of Colorado Boulder

/**
 * ConcentrationMeterUnitsControl is the Preferences dialog control for setting the units for the concentration meter.
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
import { ConcentrationMeterUnits } from '../BLLQueryParameters.js';

type SelfOptions = EmptySelfOptions;

type ConcentrationMeterUnitsControlOptions = SelfOptions & PickRequired<HBoxOptions, 'tandem'>;

export default class ConcentrationMeterUnitsControl extends HBox {

  private readonly disposeConcentrationMeterUnitsControl: () => void;

  public constructor( beakerUnitsProperty: Property<ConcentrationMeterUnits>, providedOptions: ConcentrationMeterUnitsControlOptions ) {

    const options = optionize<ConcentrationMeterUnitsControlOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: 15,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    const labelText = new Text( BeersLawLabStrings.concentrationMeterUnitsStringProperty, {
      font: PreferencesDialogConstants.CONTENT_FONT,
      maxWidth: 300
    } );

    const radioButtonGroup = new ConcentrationMeterUnitsRadioButtonGroup( beakerUnitsProperty, {
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    options.children = [ labelText, radioButtonGroup ];

    super( options );

    this.addLinkedElement( beakerUnitsProperty );

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

  public constructor( concentrationMeterUnitsProperty: Property<ConcentrationMeterUnits>, providedOptions: ConcentrationMeterUnitsRadioButtonGroupOptions ) {

    const options = optionize<ConcentrationMeterUnitsRadioButtonGroupOptions, ConcentrationMeterUnitsRadioButtonGroupSelfOptions, AquaRadioButtonGroupOptions>()( {

      // AquaRadioButtonGroupOptions
      orientation: 'horizontal',
      spacing: 15,
      accessibleName: BeersLawLabStrings.a11y.concentrationMeterUnitsRadioButtonGroup.accessibleNameStringProperty,
      accessibleHelpText: BeersLawLabStrings.a11y.concentrationMeterUnitsRadioButtonGroup.accessibleHelpTextStringProperty
    }, providedOptions );

    const items: AquaRadioButtonGroupItem<ConcentrationMeterUnits>[] = [
      {
        value: 'molesPerLiter',
        createNode: () => new Text( BeersLawLabStrings.units.molesPerLiterStringProperty, {
          font: PreferencesDialogConstants.CONTENT_FONT,
          maxWidth: 100
        } ),
        options: {
          accessibleName: BeersLawLabStrings.a11y.unitsDescription.molesPerLiterStringProperty
        },
        tandemName: 'molesPerLiterRadioButton'
      },
      {
        value: 'percent',
        createNode: () => new Text( BeersLawLabStrings.units.percentStringProperty, {
          font: PreferencesDialogConstants.CONTENT_FONT,
          maxWidth: 100
        } ),
        options: {
          accessibleName: BeersLawLabStrings.a11y.unitsDescription.percentStringProperty
        },
        tandemName: 'percentRadioButton'
      }
    ];

    super( concentrationMeterUnitsProperty, items, options );
  }
}

beersLawLab.register( 'ConcentrationMeterUnitsControl', ConcentrationMeterUnitsControl );