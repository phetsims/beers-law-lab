// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Solute.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from './Solute.js';

class SoluteIO extends ReferenceIO( ObjectIO ) {}

SoluteIO.methods = {

  setName: {
    returnType: VoidIO,
    parameterTypes: [ StringIO ],
    implementation: text => {
      this.phetioObject.name = text;
    },
    documentation: 'Set the name of the solute',
    invocableForReadOnlyElements: false
  },

  setFormula: {
    returnType: VoidIO,
    parameterTypes: [ StringIO ],
    implementation: text => {
      this.phetioObject.formula = text;
    },
    documentation: 'Set the formula of the solute',
    invocableForReadOnlyElements: false
  }
};

SoluteIO.documentation = 'a solute';
SoluteIO.validator = { isValidValue: value => value instanceof Solute };
SoluteIO.typeName = 'SoluteIO';
ObjectIO.validateSubtype( SoluteIO );

beersLawLab.register( 'SoluteIO', SoluteIO );
export default SoluteIO;