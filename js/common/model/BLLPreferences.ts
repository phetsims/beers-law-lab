// Copyright 2022, University of Colorado Boulder

/**
 * BLLPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BLLQueryParameters from '../BLLQueryParameters.js';
import beersLawLab from '../../beersLawLab.js';

const BLLPreferences = {

  showSolutionVolumeProperty: new BooleanProperty( BLLQueryParameters.showSolutionVolume, {
    tandem: Tandem.PREFERENCES.createTandem( 'showSolutionVolumeProperty' ),
    phetioDocumentation: 'shows the volume of the solution that is in the beaker'
  } ),

  showSoluteAmountProperty: new BooleanProperty( BLLQueryParameters.showSoluteAmount, {
    tandem: Tandem.PREFERENCES.createTandem( 'showSoluteAmountProperty' ),
    phetioDocumentation: 'shows the amount of solute that is in the beaker'
  } )
};

beersLawLab.register( 'BLLPreferences', BLLPreferences );
export default BLLPreferences;