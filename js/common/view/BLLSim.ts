// Copyright 2022-2024, University of Colorado Boulder

/**
 * BLLSim is the subclass of Sim used by both beers-law-lab and concentration sims.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PreferencesModel from '../../../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../../../joist/js/Sim.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import BeersLawScreen from '../../beerslaw/BeersLawScreen.js';
import beersLawLab from '../../beersLawLab.js';
import ConcentrationScreen from '../../concentration/ConcentrationScreen.js';
import BLLConstants from '../BLLConstants.js';
import BLLPreferencesNode from './BLLPreferencesNode.js';

type SelfOptions = EmptySelfOptions;

type BLLSimOptions = SelfOptions & PickOptional<SimOptions, 'phetioDesigned'>;

export default class BLLSim extends Sim {

  public constructor( simNameProperty: TReadOnlyProperty<string>,
                      screens: Array<BeersLawScreen | ConcentrationScreen>,
                      providedOptions?: BLLSimOptions ) {

    const options = optionize<BLLSimOptions, SelfOptions, SimOptions>()( {

      // SimOptions
      credits: BLLConstants.CREDITS,
      preferencesModel: new PreferencesModel( {
        simulationOptions: {
          customPreferences: [ {
            createContent: tandem => new BLLPreferencesNode( {
              tandem: tandem.createTandem( 'simPreferences' )
            } )
          } ]
        }
      } ),
      phetioDesigned: true
    }, providedOptions );

    super( simNameProperty, screens, options );
  }
}

beersLawLab.register( 'BLLSim', BLLSim );