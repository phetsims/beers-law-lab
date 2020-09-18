// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Shaker
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Vector2IO from '../../../../dot/js/Vector2IO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import beersLawLab from '../../beersLawLab.js';
import Shaker from './Shaker.js';

const ShakerIO = new IOType( 'ShakerIO', {
  isValidValue: value => value instanceof Shaker,
  documentation: 'The Shaker that releases solute',
  methods: {
    setValue: {
      returnType: VoidIO,
      parameterTypes: [ IOType.ObjectIO ],
      implementation: valueStateObject => this.previousPosition.set( Vector2IO.fromStateObject( valueStateObject ) ),
      documentation: 'Load the values recorded in getState',
      invocableForReadOnlyElements: false
    }
  },
  toStateObject: shaker => ( { position: Vector2IO.toStateObject( shaker.previousPosition ) } ),
  applyState: ( shaker, stateObject ) => shaker.previousPosition.set( Vector2IO.fromStateObject( stateObject.position ) )
} );

beersLawLab.register( 'ShakerIO', ShakerIO );
export default ShakerIO;