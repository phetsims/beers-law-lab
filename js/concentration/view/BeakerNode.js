// Copyright 2013-2017, University of Colorado Boulder

/**
 * Visual representation of a beaker that is filled to the top with a solution.
 * Ticks on the left edge of the beaker. Origin is at the bottom center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BLLQueryParameters = require( 'BEERS_LAW_LAB/common/BLLQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  //strings
  var pattern0Value1UnitsString = require( 'string!BEERS_LAW_LAB/pattern.0value.1units' );
  var unitsLitersString = require( 'string!BEERS_LAW_LAB/units.liters' );
  var unitsMillilitersString = require( 'string!BEERS_LAW_LAB/units.milliliters' );

  // constants
  var RIM_OFFSET = 20;
  var MINOR_TICK_SPACING = 0.1; // L
  var MINOR_TICKS_PER_MAJOR_TICK = 5;
  var MAJOR_TICK_LENGTH = 30;
  var MINOR_TICK_LENGTH = 15;
  var TICK_LABEL_X_SPACING = 8;
  var MAJOR_TICK_VALUES_LITERS = [ '\u00bd', '1' ]; // 1/2 L, 1 L
  var MAJOR_TICK_VALUES_MILLILITERS = [ '500', '1000' ]; // 500 mL, 1000 mL
  assert && assert( MAJOR_TICK_VALUES_LITERS.length === MAJOR_TICK_VALUES_MILLILITERS.length );

  /**
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function BeakerNode( beaker, modelViewTransform, tandem ) {

    Node.call( this, { pickable: false } );

    // outline of the beaker, starting from upper left
    var width = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    var height = modelViewTransform.modelToViewDeltaY( beaker.size.height );
    var outlineShape = new Shape()
      .moveTo( -(width / 2 ) - RIM_OFFSET, -height - RIM_OFFSET )
      .lineTo( -(width / 2), -height )
      .lineTo( -(width / 2), 0 )
      .lineTo( width / 2, 0 )
      .lineTo( width / 2, -height )
      .lineTo( (width / 2) + RIM_OFFSET, -height - RIM_OFFSET );
    this.addChild( new Path( outlineShape, {
      stroke: 'black',
      lineWidth: 3,
      lineCap: 'round',
      lineJoin: 'round'
    } ) );

    // horizontal tick marks, left edge, from bottom up
    var ticksParent = new Node();
    this.addChild( ticksParent );
    var numberOfTicks = Math.round( beaker.volume / MINOR_TICK_SPACING );
    var deltaY = height / numberOfTicks;
    for ( var i = 1; i <= numberOfTicks; i++ ) {

      // tick
      var isMajorTick = ( i % MINOR_TICKS_PER_MAJOR_TICK === 0 );
      var y = -( i * deltaY );
      var leftX = -width / 2;
      var rightX = leftX + ( isMajorTick ? MAJOR_TICK_LENGTH : MINOR_TICK_LENGTH );
      var tickShape = new Shape().moveTo( leftX, y ).lineTo( rightX, y );
      var tickPath = new Path( tickShape,
        {
          stroke: 'black',
          lineWidth: 2,
          lineCap: 'butt',
          lineJoin: 'bevel'
        } );
      ticksParent.addChild( tickPath );

      // major tick label
      if ( isMajorTick ) {
        var labelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
        if ( labelIndex < MAJOR_TICK_VALUES_LITERS.length ) {

          // display ticks in liters or milliliters, see beers-law-lab#150
          var label = ( BLLQueryParameters.beakerUnits === 'liters' ) ?
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

    var location = modelViewTransform.modelToViewPosition( beaker.location );
    this.x = location.x;
    this.y = location.y;

    // tandem support
    this.mutate( {
      tandem: tandem
    } );
  }

  beersLawLab.register( 'BeakerNode', BeakerNode );

  return inherit( Node, BeakerNode );
} );
