// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for ConcentrationModel.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import ConcentrationModel from './ConcentrationModel.js';
import SoluteIO from './SoluteIO.js';

const ConcentrationModelIO = new IOType( 'ConcentrationModelIO', {
  isValidValue: value => value instanceof ConcentrationModel,
  documentation: 'The model for the concentration screen.',
  methods: {
    setSolutes: {
      parameterTypes: [ ArrayIO( SoluteIO ) ],
      returnType: VoidIO,
      implementation: solutes => this.setSolutes( solutes ),
      documentation: 'Set which solutes are allowed for selection',
      invocableForReadOnlyElements: false
    }
  }
} );

beersLawLab.register( 'ConcentrationModelIO', ConcentrationModelIO );
export default ConcentrationModelIO;