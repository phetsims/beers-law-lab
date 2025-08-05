// Copyright 2025, University of Colorado Boulder

/**
 * ConcentrationProbeJumpPositions is the set of jump positions for the concentration probe, used by the 'J' shortcut.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import JumpPosition from '../../common/model/JumpPosition.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import BLLConstants from '../../common/BLLConstants.js';
import ConcentrationModel from './ConcentrationModel.js';
import beersLawLab from '../../beersLawLab.js';

export default class ConcentrationProbeJumpPositions extends Array<JumpPosition> {

  public constructor( model: ConcentrationModel ) {

    super(

      // Inside the beaker, bottom center. The beaker may be empty or may contain solution.
      new JumpPosition( {
        positionProperty: new Vector2Property( model.beaker.position.minusXY( 0, 0.0001 ) ),
        accessibleObjectResponseStringProperty: new DerivedStringProperty( [
            BeersLawLabStrings.a11y.concentrationProbeNode.jumpResponses.insideEmptyBeakerStringProperty,
            BeersLawLabStrings.a11y.concentrationProbeNode.jumpResponses.inBeakerStringProperty,
            model.concentrationMeter.probe.positionProperty,
            model.solution.concentrationProperty,
            model.solution.percentConcentrationProperty,
            BeersLawLabStrings.a11y.unitsDescription.molesPerLiterStringProperty,
            BeersLawLabStrings.a11y.unitsDescription.percentStringProperty
          ],
          ( insideEmptyBeakerString, inBeakerString ) => {
            if ( model.solution.volumeProperty.value === 0 ) {
              return insideEmptyBeakerString;
            }
            else if ( BLLPreferences.concentrationMeterUnitsProperty.value === 'molesPerLiter' ) {
              return StringUtils.fillIn( inBeakerString, {
                concentration: toFixed( model.solution.concentrationProperty.value, BLLConstants.DECIMAL_PLACES_CONCENTRATION_MOLES_PER_LITER ),
                units: BeersLawLabStrings.a11y.unitsDescription.molesPerLiterStringProperty.value
              } );
            }
            else {
              return StringUtils.fillIn( inBeakerString, {
                concentration: toFixed( model.solution.percentConcentrationProperty.value, BLLConstants.DECIMAL_PLACES_CONCENTRATION_PERCENT ),
                units: BeersLawLabStrings.a11y.unitsDescription.percentStringProperty.value
              } );
            }
          }
        )
      } ),

      // Below the water faucet, close to the spigot, and above the max solution level in the beaker.
      new JumpPosition( {
        positionProperty: new Vector2Property( model.solventFaucet.position.plusXY( 0, 10 ) ),
        accessibleObjectResponseStringProperty: BeersLawLabStrings.a11y.concentrationProbeNode.jumpResponses.belowWaterFaucetStringProperty
      } ),

      // Below the dropper, and above the max solution level in the beaker.
      new JumpPosition( {
        positionProperty: new Vector2Property( model.dropper.position.plusXY( 0, 10 ) ),
        isRelevant: () => model.dropper.visibleProperty.value,
        accessibleObjectResponseStringProperty: BeersLawLabStrings.a11y.concentrationProbeNode.jumpResponses.belowDropperStringProperty
      } ),

      // Below the drain faucet, close to the spigot.
      new JumpPosition( {
        positionProperty: new Vector2Property( model.drainFaucet.position.plusXY( 0, 10 ) ),
        accessibleObjectResponseStringProperty: BeersLawLabStrings.a11y.concentrationProbeNode.jumpResponses.belowDrainFaucetStringProperty
      } ),

      // Outside the beaker, where the probe is initially positioned.
      new JumpPosition( {
        positionProperty: new Vector2Property( model.concentrationMeter.probe.positionProperty.value ),
        accessibleObjectResponseStringProperty: BeersLawLabStrings.a11y.concentrationProbeNode.jumpResponses.outsideBeakerStringProperty
      } )
    );
  }
}

beersLawLab.register( 'ConcentrationProbeJumpPositions', ConcentrationProbeJumpPositions );