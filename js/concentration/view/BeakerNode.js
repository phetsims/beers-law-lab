// Copyright 2002-2013, University of Colorado

/**
 * Visual representation of a beaker that is filled to the top with a solution.
 * Ticks on the left edge of the beaker. Origin is at the bottom center.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var BLLFont = require( "common/BLLFont" );
  var BLLStrings = require( "common/BLLStrings" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Shape = require( "KITE/Shape" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );

  // constants
  var MAX_VOLUME = 1;
  var RIM_OFFSET = 20;
  var MINOR_TICK_SPACING = 0.1; // L
  var MINOR_TICKS_PER_MAJOR_TICK = 5;
  var MAJOR_TICK_LENGTH = 30;
  var MINOR_TICK_LENGTH = 15;
  var TICK_LABEL_X_SPACING = 8;
  var MAJOR_TICK_LABELS = new Array( "\u00bd", "1" ); // 1/2, 1

  /**
   * Constructor
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BeakerNode( beaker, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // outline of the beaker, starting from upper left
    var width = mvt.modelToViewDeltaX( beaker.size.width );
    var height = mvt.modelToViewDeltaY( beaker.size.height );
    var outlineShape = new Shape()
        .moveTo( -(width / 2 ) - RIM_OFFSET, -height - RIM_OFFSET )
        .lineTo( -(width / 2), -height )
        .lineTo( -(width / 2), 0 )
        .lineTo( width / 2, 0 )
        .lineTo( width / 2, -height )
        .lineTo( (width / 2) + RIM_OFFSET, -height - RIM_OFFSET );
    thisNode.addChild( new Path(
        {
          shape: outlineShape,
          stroke: "black",
          lineWidth: 3,
          lineCap: "round",
          lineJoin: "round"
        } ) );

    // horizontal tick marks, left edge, from bottom up
    var ticksParent = new Node();
    thisNode.addChild( ticksParent );
    var numberOfTicks = Math.round( MAX_VOLUME / MINOR_TICK_SPACING );
    var deltaY = height / numberOfTicks;
    for ( var i = 1; i <= numberOfTicks; i++ ) {

      // tick
      var isMajorTick = ( i % MINOR_TICKS_PER_MAJOR_TICK === 0 );
      var y = -( i * deltaY );
      var leftX = -width / 2;
      var rightX = leftX + ( isMajorTick ? MAJOR_TICK_LENGTH : MINOR_TICK_LENGTH );
      var tickShape = new Shape().moveTo( leftX, y ).lineTo( rightX, y );
      var tickPath = new Path(
          {
            shape: tickShape,
            stroke: "black",
            lineWidth: 2,
            lineCap: "butt",
            lineJoin: "bevel"
          } );
      ticksParent.addChild( tickPath );

      // major tick label
      if ( isMajorTick ) {
        var labelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
        if ( labelIndex < MAJOR_TICK_LABELS.length ) {
          var label = StringUtils.format( BLLStrings.pattern_0value_1units, [MAJOR_TICK_LABELS[labelIndex], BLLStrings.units_liters] );
          ticksParent.addChild( new Text( label, {
            font: new BLLFont( 24 ).toCSS(),
            fill: "black",
            x: rightX + TICK_LABEL_X_SPACING,
            centerY: tickPath.centerY
          } ) );
        }
      }
    }

    var location = mvt.modelToViewPosition( beaker.location );
    thisNode.x = location.x;
    thisNode.y = location.y;
  }

  inherit( BeakerNode, Node );

  return BeakerNode;
} );
