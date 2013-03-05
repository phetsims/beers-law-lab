// Copyright 2002-2013, University of Colorado

define(
  [
    "SCENERY/nodes/Node",
    "SCENERY/Shape",
    "SCENERY/nodes/Path",
    "SCENERY/nodes/Text",
    "PHETCOMMON/util/Inheritance",
    "common/util/StringUtils"
  ],
  function ( Node, Shape, Path, Text, Inheritance, StringUtils ) {

    /**
     * Constructor
     * @param {Beaker} beaker
     * @param {ModelViewTransform2D} mvt
     * @param strings
     * @constructor
     */
    function BeakerNode( beaker, mvt, strings ) {

      Node.call( this ); // constructor stealing

      // constants
      var MAX_VOLUME = 1;
      var RIM_OFFSET = 20;
      var MINOR_TICK_SPACING = 0.1; // L
      var MINOR_TICKS_PER_MAJOR_TICK = 5;
      var MAJOR_TICK_LENGTH = 30;
      var MINOR_TICK_LENGTH = 15;
      var TICK_LABEL_X_SPACING = 8;
      var MAJOR_TICK_LABELS = new Array( "\u00bd", "1" ); // 1/2, 1

      // outline of the beaker, starting from upper left
      var width = mvt.modelToView( beaker.size.width );
      var height = mvt.modelToView( beaker.size.height );
      var outlineShape = new Shape()
        .moveTo( -(width / 2 ) - RIM_OFFSET, -height - RIM_OFFSET )
        .lineTo( -(width / 2), -height )
        .lineTo( -(width / 2), 0 )
        .lineTo( width / 2, 0 )
        .lineTo( width / 2, -height )
        .lineTo( (width / 2) + RIM_OFFSET, -height - RIM_OFFSET );
      this.addChild( new Path(
        {
          shape: outlineShape,
          stroke: "black",
          lineWidth: 3,
          lineCap: "square", //TODO change to "round" when supported by scenery
          lineJoin: "square" //TODO change to "round" when supported by scenery
        } ) );

      // horizontal tick marks, left edge, from bottom up
      var ticksParent = new Node();
      this.addChild( ticksParent );
      var numberOfTicks = Math.round( MAX_VOLUME / MINOR_TICK_SPACING );
      var deltaY = height / numberOfTicks;
      for ( var i = 1; i <= numberOfTicks; i++ ) {

        // tick
        var isMajorTick = ( i % MINOR_TICKS_PER_MAJOR_TICK == 0 );
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
            var label = StringUtils.messageFormat( strings.pattern_0value_1units, [MAJOR_TICK_LABELS[labelIndex], strings.units_liters] );
            ticksParent.addChild( new Text( label, {
              font: "24px Arial",
              fill: "black",
              x: rightX + TICK_LABEL_X_SPACING,
              centerY: tickPath.centerY
            } ) );
          }
        }
      }

      var location = mvt.modelToView( beaker.location );
      this.x = location.x;
      this.y = location.y;
    }

    // prototype chaining
    Inheritance.inheritPrototype( BeakerNode, Node );

    return BeakerNode;
  } );
