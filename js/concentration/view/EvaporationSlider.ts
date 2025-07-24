// Copyright 2025, University of Colorado Boulder

/**
 * EvaporationSlider is the slider used to control evaporation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import HSlider from '../../../../sun/js/HSlider.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Evaporator from '../model/Evaporator.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BLLPreferences from '../../common/model/BLLPreferences.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import BLLConstants from '../../common/BLLConstants.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

export default class EvaporationSlider extends HSlider {

  public constructor( evaporator: Evaporator, tandem: Tandem ) {

    super( evaporator.evaporationRateProperty, evaporator.evaporationRateProperty.range, {
      trackSize: new Dimension2( 150, 6 ),
      thumbSize: new Dimension2( 22, 45 ),
      enabledProperty: evaporator.enabledProperty,

      // At end of pointer drag, snap evaporation rate back to zero.
      endDrag: event => {
        if ( event && !event.isFromPDOM() ) {
          evaporator.evaporationRateProperty.value = 0;
        }
      },
      accessibleName: BeersLawLabStrings.a11y.evaporationSlider.accessibleNameStringProperty,

      pdomCreateAriaValueText: value => {

        const valueString = ( BLLPreferences.beakerUnitsProperty.value === 'liters' ) ?
                            toFixed( value, BLLConstants.DECIMAL_PLACES_EVAPORATION_RATE_LITERS_PER_SECOND ) :
                            toFixed( value * 1000, BLLConstants.DECIMAL_PLACES_EVAPORATION_RATE_MILLILITERS_PER_SECOND );

        const units = ( BLLPreferences.beakerUnitsProperty.value === 'liters' ) ?
                      BeersLawLabStrings.a11y.unitsDescription.litersPerSecondStringProperty.value :
                      BeersLawLabStrings.a11y.unitsDescription.millilitersPerSecondStringProperty.value;

        return StringUtils.format( BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ].value, valueString, units );
      },

      // Dynamic dependencies used in pdomCreateAriaValueText.
      pdomDependencies: [
        BLLPreferences.beakerUnitsProperty,
        BeersLawLabStrings.pattern[ '0value' ][ '1unitsStringProperty' ],
        BeersLawLabStrings.a11y.unitsDescription.litersPerSecondStringProperty,
        BeersLawLabStrings.a11y.unitsDescription.millilitersPerSecondStringProperty
      ],
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: false
      }
    } );

    // Tick marks
    const tickOptions = {
      font: new PhetFont( 16 ),
      maxWidth: 50
    };
    this.addMajorTick( 0, new Text( BeersLawLabStrings.noneStringProperty, tickOptions ) );
    this.addMajorTick( evaporator.maxEvaporationRate, new Text( BeersLawLabStrings.lotsStringProperty, tickOptions ) );

    // Evaporation should turn off when focus moves somewhere else.
    this.addInputListener( {
      blur: () => {
        evaporator.evaporationRateProperty.value = 0;
      }
    } );
  }
}

beersLawLab.register( 'EvaporationSlider', EvaporationSlider );