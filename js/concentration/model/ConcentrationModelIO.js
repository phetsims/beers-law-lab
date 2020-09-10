// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for ConcentrationModel.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import ConcentrationModel from './ConcentrationModel.js';
import SoluteIO from './SoluteIO.js';

class ConcentrationModelIO extends ObjectIO {}

ConcentrationModelIO.methods = {
  setSolutes: {
    parameterTypes: [ ArrayIO( SoluteIO ) ],
    returnType: VoidIO,
    implementation: solutes => this.setSolutes( solutes ),
    documentation: 'Set which solutes are allowed for selection',
    invocableForReadOnlyElements: false
  }
};

ConcentrationModelIO.documentation = 'The model for the concentration screen.';
ConcentrationModelIO.validator = { isValidValue: value => value instanceof ConcentrationModel };
ConcentrationModelIO.typeName = 'ConcentrationModelIO';
ObjectIO.validateIOType( ConcentrationModelIO );

beersLawLab.register( 'ConcentrationModelIO', ConcentrationModelIO );
export default ConcentrationModelIO;