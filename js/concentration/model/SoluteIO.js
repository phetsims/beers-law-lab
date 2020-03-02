// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Solute.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from './Solute.js';

class SoluteIO extends ObjectIO {

  /**
   * Serializes an instance.
   * @param {Solute} solute
   * @returns {Object}
   */
  static toStateObject( solute ) {
    validate( solute, this.validator );
    return solute.tandem.phetioID;
  }

  /**
   * Deserializes an instance.
   * @param {Object} stateObject
   * @returns {Solute}
   */
  static fromStateObject( stateObject ) {
    return phet.phetIo.phetioEngine.getPhetioObject( stateObject );
  }
}

SoluteIO.methods = {

  setName: {
    returnType: VoidIO,
    parameterTypes: [ StringIO ],
    implementation: function( text ) {
      this.phetioObject.name = text;
    },
    documentation: 'Set the name of the solute',
    invocableForReadOnlyElements: false
  },

  setFormula: {
    returnType: VoidIO,
    parameterTypes: [ StringIO ],
    implementation: function( text ) {
      this.phetioObject.formula = text;
    },
    documentation: 'Set the formula of the solute',
    invocableForReadOnlyElements: false
  }
};

SoluteIO.documentation = 'The Solute for the sim.';
SoluteIO.validator = { isValidValue: v => v instanceof Solute };
SoluteIO.typeName = 'SoluteIO';
ObjectIO.validateSubtype( SoluteIO );

beersLawLab.register( 'SoluteIO', SoluteIO );
export default SoluteIO;