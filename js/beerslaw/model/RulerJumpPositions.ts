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
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BLLConstants from '../../common/BLLConstants.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';

export default class RulerJumpPositions extends Array<JumpPosition> {

  public constructor( model: BeersLawModel ) {
    super(
      // Measuring the cuvette, {{width}} {{units}}
      new JumpPosition( {
        positionProperty: new Vector2Property( new Vector2( model.cuvette.position.x, model.cuvette.position.y + model.cuvette.height ) ),
        accessibleObjectResponseStringProperty: new DerivedStringProperty( [
            model.cuvette.widthProperty,
            BeersLawLabStrings.a11y.rulerNode.jumpResponses.measuringCuvetteWidthStringProperty,
            BeersLawLabStrings.a11y.unitsDescription.centimetersStringProperty
          ],
          ( cuvetteWidth, pattern, centimetersString ) => StringUtils.fillIn( pattern, {
            width: toFixedNumber( cuvetteWidth, BLLConstants.DECIMAL_PLACES_CUVETTE_WIDTH ),
            units: centimetersString
          } ) )
      } ),

      // Measuring the path length, {{width}} {{units}}
      new JumpPosition( {
        positionProperty: new Vector2Property( new Vector2( model.cuvette.position.x, model.light.position.y + model.light.lensDiameter / 2 ) ),
        accessibleObjectResponseStringProperty: new DerivedStringProperty( [
            model.detector.pathLengthProperty,
            model.cuvette.widthProperty,
            model.light.isOnProperty,
            BeersLawLabStrings.a11y.rulerNode.jumpResponses.measuringOpticalPathLengthStringProperty,
            BeersLawLabStrings.a11y.rulerNode.jumpResponses.measuringOpticalPathLengthLightOffStringProperty,
            BeersLawLabStrings.a11y.unitsDescription.centimetersStringProperty
          ],
          ( pathLength, cuvetteWidth, lightIsOn, pattern, lightOffString, centimetersString ) => {
            if ( lightIsOn ) {
              return StringUtils.fillIn( pattern, {
                width: toFixedNumber( ( pathLength === null ) ? cuvetteWidth : pathLength, BLLConstants.DECIMAL_PLACES_CUVETTE_WIDTH ),
                units: centimetersString
              } );
            }
            else {
              return lightOffString;
            }
          } )
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