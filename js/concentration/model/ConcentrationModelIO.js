// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for ConcentrationModel.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import SoluteIO from './SoluteIO.js';

class ConcentrationModelIO extends ObjectIO {}

ConcentrationModelIO.methods = {
  setSolutes: {
    parameterTypes: [ ArrayIO( SoluteIO ) ],
    returnType: VoidIO,
    implementation: function( solutes ) {
      this.phetioObject.setSolutes( solutes );
    },
    documentation: 'Set which solutes are allowed for selection',
    invocableForReadOnlyElements: false
  }
};
ConcentrationModelIO.typeName = 'ConcentrationModelIO';
ConcentrationModelIO.documentation = 'The model for the concentration screen.';
ConcentrationModelIO.validator = { isValidValue: v => v instanceof phet.beersLawLab.ConcentrationModel };
ObjectIO.validateSubtype( ConcentrationModelIO );

beersLawLab.register( 'ConcentrationModelIO', ConcentrationModelIO );
export default ConcentrationModelIO;