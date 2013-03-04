// Copyright 2002-2013, University of Colorado

/**
 * To debug the origin of a composite node, add an instance of this node as a child.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "SCENERY/nodes/Path",
    "SCENERY/Shape",
    "PHETCOMMON/model/Inheritance"
  ],
  function ( Path, Shape, Inheritance ) {

    function DebugOriginNode( color ) {
      Path.call( this, {
        shape: Shape.circle( 0, 0, 3 ),
        fill: color
      } );
    }

    Inheritance.inheritPrototype( DebugOriginNode, Path );

    return DebugOriginNode;
  } );
