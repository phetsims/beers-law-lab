// Copyright 2025, University of Colorado Boulder

/**
 * RulerJumpPositions is the set of jump positions for the ruler, used by the 'J' shortcut.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import JumpPosition from '../../common/model/JumpPosition.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawModel from './BeersLawModel.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';

export default class RulerJumpPositions extends Array<JumpPosition> {
  
  public constructor( model: BeersLawModel ) {
    super(

      // Measuring the cuvette
      new JumpPosition( {
        positionProperty: new Vector2Property( new Vector2( model.cuvette.position.x, model.cuvette.position.y + model.cuvette.height ) ),
        accessibleObjectResponseStringProperty: BeersLawLabStrings.a11y.rulerNode.jumpResponses.measuringCuvetteWidthStringProperty
      } ),

      // Measuring the path length
      new JumpPosition( {
        positionProperty: new Vector2Property( new Vector2( model.cuvette.position.x, model.light.position.y + model.light.lensDiameter / 2 ) ),
        accessibleObjectResponseStringProperty: BeersLawLabStrings.a11y.rulerNode.jumpResponses.measuringOpticalPathLengthStringProperty
      } ),

      // Not measuring
      new JumpPosition( {
        positionProperty: new Vector2Property( model.ruler.positionProperty.value ),
        accessibleObjectResponseStringProperty: BeersLawLabStrings.a11y.rulerNode.jumpResponses.notMeasuringStringProperty
      } )

    );
  }
}

beersLawLab.register( 'RulerJumpPositions', RulerJumpPositions );