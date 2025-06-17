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

export default class EvaporationSlider extends HSlider {

  public constructor( evaporator: Evaporator, tandem: Tandem ) {

    super( evaporator.evaporationRateProperty, evaporator.evaporationRateProperty.range, {
      trackSize: new Dimension2( 150, 6 ),
      thumbSize: new Dimension2( 22, 45 ),
      enabledProperty: evaporator.enabledProperty,

      // At end of drag, snap evaporation rate back to zero
      endDrag: () => {
        evaporator.evaporationRateProperty.value = 0;
      },
      accessibleName: BeersLawLabStrings.evaporationStringProperty,
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
  }
}

beersLawLab.register( 'EvaporationSlider', EvaporationSlider );