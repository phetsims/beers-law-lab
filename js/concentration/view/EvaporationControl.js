// Copyright 2013-2020, University of Colorado Boulder

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
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel from '../../../../sun/js/Panel.js';
import beersLawLabStrings from '../../beers-law-lab-strings.js';
import beersLawLab from '../../beersLawLab.js';

const evaporationString = beersLawLabStrings.evaporation;
const lotsString = beersLawLabStrings.lots;
const noneString = beersLawLabStrings.none;
const pattern0LabelString = beersLawLabStrings.pattern[ '0label' ];

class EvaporationControl extends Panel {

  /**
   * @param {Evaporator} evaporator
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( evaporator, tandem, options ) {

    options = merge( {
      xMargin: 15,
      yMargin: 8,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: tandem
    }, options );

    const label = new Text( StringUtils.format( pattern0LabelString, evaporationString ), { font: new PhetFont( 22 ) } );

    const slider = new HSlider( evaporator.evaporationRateProperty, new Range( 0, evaporator.maxEvaporationRate ), {
      trackSize: new Dimension2( 150, 6 ),
      thumbSize: new Dimension2( 22, 45 ),
      enabledProperty: evaporator.enabledProperty,

      // at end of drag, snap evaporation rate back to zero
      endDrag: () => evaporator.evaporationRateProperty.set( 0 ),
      tandem: tandem.createTandem( 'slider' )
    } );

    const tickFont = new PhetFont( 16 );
    slider.addMajorTick( 0, new Text( noneString, { font: tickFont } ) );
    slider.addMajorTick( evaporator.maxEvaporationRate, new Text( lotsString, { font: tickFont } ) );

    const content = new Node();
    content.addChild( label );
    content.addChild( slider );

    slider.left = label.right + 10;
    slider.centerY = label.centerY;

    super( content, options );
  }
}

beersLawLab.register( 'EvaporationControl', EvaporationControl );
export default EvaporationControl;