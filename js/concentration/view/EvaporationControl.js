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
import beersLawLab from '../../beersLawLab.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';

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

    const label = new Text( StringUtils.format( beersLawLabStrings.pattern[ '0label' ], beersLawLabStrings.evaporation ),
      { font: new PhetFont( 22 ) } );

    const slider = new HSlider( evaporator.evaporationRateProperty, new Range( 0, evaporator.maxEvaporationRate ), {
      trackSize: new Dimension2( 150, 6 ),
      thumbSize: new Dimension2( 22, 45 ),
      enabledProperty: evaporator.enabledProperty,

      // at end of drag, snap evaporation rate back to zero
      endDrag: () => evaporator.evaporationRateProperty.set( 0 ),
      tandem: tandem.createTandem( 'slider' )
    } );

    const tickFont = new PhetFont( 16 );
    slider.addMajorTick( 0, new Text( beersLawLabStrings.none, { font: tickFont } ) );
    slider.addMajorTick( evaporator.maxEvaporationRate, new Text( beersLawLabStrings.lots, { font: tickFont } ) );

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