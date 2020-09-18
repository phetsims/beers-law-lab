// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Solute.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import Solute from './Solute.js';

const SoluteIO = new IOType( 'SoluteIO', {
  isValidValue: value => value instanceof Solute,
  supertype: ReferenceIO( IOType.ObjectIO ),
  methods: {

    setName: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: text => {
        this.name = text;
      },
      documentation: 'Set the name of the solute',
      invocableForReadOnlyElements: false
    },

    setFormula: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: text => {
        this.formula = text;
      },
      documentation: 'Set the formula of the solute',
      invocableForReadOnlyElements: false
    }
  }
} );

beersLawLab.register( 'SoluteIO', SoluteIO );
export default SoluteIO;