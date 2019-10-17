// Copyright 2013-2019, University of Colorado Boulder

/**
 * Evaporation control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HSlider = require( 'SUN/HSlider' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const evaporationString = require( 'string!BEERS_LAW_LAB/evaporation' );
  const lotsString = require( 'string!BEERS_LAW_LAB/lots' );
  const noneString = require( 'string!BEERS_LAW_LAB/none' );
  const pattern0LabelString = require( 'string!BEERS_LAW_LAB/pattern.0label' );

  /**
   * @param {Evaporator} evaporator
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function EvaporationControl( evaporator, tandem, options ) {

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
      endDrag: function() { evaporator.evaporationRateProperty.set( 0 ); },  // at end of drag, snap evaporation rate back to zero
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

    Panel.call( this, content, options );
  }

  beersLawLab.register( 'EvaporationControl', EvaporationControl );

  return inherit( Panel, EvaporationControl );
} );