// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of a beaker that is filled to the top with a solution.
 * Ticks on the left edge of the beaker. Origin is at the bottom center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLQueryParameters = require( 'BEERS_LAW_LAB/common/BLLQueryParameters' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );

  //strings
  const pattern0Value1UnitsString = require( 'string!BEERS_LAW_LAB/pattern.0value.1units' );
  const unitsLitersString = require( 'string!BEERS_LAW_LAB/units.liters' );
  const unitsMillilitersString = require( 'string!BEERS_LAW_LAB/units.milliliters' );

  // constants
  const RIM_OFFSET = 20;
  const MINOR_TICK_SPACING = 0.1; // L
  const MINOR_TICKS_PER_MAJOR_TICK = 5;
  const MAJOR_TICK_LENGTH = 30;
  const MINOR_TICK_LENGTH = 15;
  const TICK_LABEL_X_SPACING = 8;
  const MAJOR_TICK_VALUES_LITERS = [ '\u00bd', '1' ]; // 1/2 L, 1 L
  const MAJOR_TICK_VALUES_MILLILITERS = [ '500', '1000' ]; // 500 mL, 1000 mL
  assert && assert( MAJOR_TICK_VALUES_LITERS.length === MAJOR_TICK_VALUES_MILLILITERS.length );

  class BeakerNode extends Node {

    /**
     * @param {Beaker} beaker
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Tandem} tandem
     */
    constructor( beaker, modelViewTransform, tandem ) {

      super( { pickable: false, tandem: tandem } );

      // outline of the beaker, starting from upper left
      const width = modelViewTransform.modelToViewDeltaX( beaker.size.width );
      const height = modelViewTransform.modelToViewDeltaY( beaker.size.height );
      const outlineShape = new Shape()
        .moveTo( -( width / 2 ) - RIM_OFFSET, -height - RIM_OFFSET )
        .lineTo( -( width / 2 ), -height )
        .lineTo( -( width / 2 ), 0 )
        .lineTo( width / 2, 0 )
        .lineTo( width / 2, -height )
        .lineTo( ( width / 2 ) + RIM_OFFSET, -height - RIM_OFFSET );
      this.addChild( new Path( outlineShape, {
        stroke: 'black',
        lineWidth: 3,
        lineCap: 'round',
        lineJoin: 'round'
      } ) );

      // horizontal tick marks, left edge, from bottom up
      const ticksParent = new Node();
      this.addChild( ticksParent );
      const numberOfTicks = Utils.roundSymmetric( beaker.volume / MINOR_TICK_SPACING );
      const deltaY = height / numberOfTicks;
      for ( let i = 1; i <= numberOfTicks; i++ ) {

        // tick
        const isMajorTick = ( i % MINOR_TICKS_PER_MAJOR_TICK === 0 );
        const y = -( i * deltaY );
        const leftX = -width / 2;
        const rightX = leftX + ( isMajorTick ? MAJOR_TICK_LENGTH : MINOR_TICK_LENGTH );
        const tickShape = new Shape().moveTo( leftX, y ).lineTo( rightX, y );
        const tickPath = new Path( tickShape,
          {
            stroke: 'black',
            lineWidth: 2,
            lineCap: 'butt',
            lineJoin: 'bevel'
          } );
        ticksParent.addChild( tickPath );

        // major tick label
        if ( isMajorTick ) {
          const labelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
          if ( labelIndex < MAJOR_TICK_VALUES_LITERS.length ) {

            // display ticks in liters or milliliters, see beers-law-lab#150
            const label = ( BLLQueryParameters.beakerUnits === 'liters' ) ?
                          StringUtils.format( pattern0Value1UnitsString, MAJOR_TICK_VALUES_LITERS[ labelIndex ], unitsLitersString ) :
                          StringUtils.format( pattern0Value1UnitsString, MAJOR_TICK_VALUES_MILLILITERS[ labelIndex ], unitsMillilitersString );

            ticksParent.addChild( new Text( label, {
              tandem: tandem.createTandem( 'tickLabel' + labelIndex ),
              font: new PhetFont( 24 ),
              fill: 'black',
              x: rightX + TICK_LABEL_X_SPACING,
              centerY: tickPath.centerY,
              maxWidth: 0.25 * beaker.size.width // constrain width for i18n
            } ) );
          }
        }
      }

      const position = modelViewTransform.modelToViewPosition( beaker.position );
      this.x = position.x;
      this.y = position.y;
    }
  }

  return beersLawLab.register( 'BeakerNode', BeakerNode );
} );
