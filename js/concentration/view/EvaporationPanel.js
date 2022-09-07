// Copyright 2013-2022, University of Colorado Boulder

/**
 * Evaporation control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';
import Evaporator from '../model/Evaporator.js';

class EvaporationPanel extends Panel {

  /**
   * @param {Evaporator} evaporator
   * @param {Object} [options]
   */
  constructor( evaporator, options ) {
    assert && assert( evaporator instanceof Evaporator );

    options = merge( {
      xMargin: 15,
      yMargin: 8,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: Tandem.REQUIRED
    }, options );

    const labelString = StringUtils.format( BeersLawLabStrings.pattern[ '0label' ], BeersLawLabStrings.evaporation );
    const labelNode = new Text( labelString, {
      font: new PhetFont( 22 ),
      maxWidth: 130,
      tandem: options.tandem.createTandem( 'labelNode' )
    } );

    const slider = new HSlider( evaporator.evaporationRateProperty, new Range( 0, evaporator.maxEvaporationRate ), {
      trackSize: new Dimension2( 150, 6 ),
      thumbSize: new Dimension2( 22, 45 ),
      enabledProperty: evaporator.enabledProperty,

      // at end of drag, snap evaporation rate back to zero
      endDrag: () => {
        evaporator.evaporationRateProperty.value = 0;
      },
      tandem: options.tandem.createTandem( 'slider' )
    } );

    // Tick marks
    const tickFont = new PhetFont( 16 );
    slider.addMajorTick( 0, new Text( BeersLawLabStrings.none, { font: tickFont } ) );
    slider.addMajorTick( evaporator.maxEvaporationRate, new Text( BeersLawLabStrings.lots, { font: tickFont } ) );

    const content = new HBox( {
      spacing: 10,
      children: [ labelNode, slider ]
    } );

    super( content, options );
  }
}

beersLawLab.register( 'EvaporationPanel', EvaporationPanel );
export default EvaporationPanel;