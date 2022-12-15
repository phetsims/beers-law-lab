// Copyright 2022, University of Colorado Boulder

/**
 * BLLPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BLLQueryParameters, { BeakerUnits, BeakerUnitsValues, ConcentrationMeterUnits, ConcentrationMeterUnitsValues } from '../BLLQueryParameters.js';
import beersLawLab from '../../beersLawLab.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

const BLLPreferences = {

  showSolutionVolumeProperty: new BooleanProperty( BLLQueryParameters.showSolutionVolume, {
    tandem: Tandem.PREFERENCES.createTandem( 'showSolutionVolumeProperty' ),
    phetioDocumentation: 'Shows the volume of the solution that is in the beaker'
  } ),

  showSoluteAmountProperty: new BooleanProperty( BLLQueryParameters.showSoluteAmount, {
    tandem: Tandem.PREFERENCES.createTandem( 'showSoluteAmountProperty' ),
    phetioDocumentation: 'Shows the amount of solute that is in the beaker'
  } ),

  beakerUnitsProperty: new StringUnionProperty<BeakerUnits>( BLLQueryParameters.beakerUnits as BeakerUnits, {
    validValues: BeakerUnitsValues,
    tandem: Tandem.PREFERENCES.createTandem( 'beakerUnitsProperty' ),
    phetioDocumentation: 'Units displayed on the beaker tick marks'
  } ),

  concentrationMeterUnitsProperty: new StringUnionProperty<ConcentrationMeterUnits>( BLLQueryParameters.concentrationMeterUnits as ConcentrationMeterUnits, {
    validValues: ConcentrationMeterUnitsValues,
    tandem: Tandem.PREFERENCES.createTandem( 'concentrationMeterUnitsProperty' ),
    phetioDocumentation: 'Units displayed by the concentration meter'
  } )
};

beersLawLab.register( 'BLLPreferences', BLLPreferences );
export default BLLPreferences;