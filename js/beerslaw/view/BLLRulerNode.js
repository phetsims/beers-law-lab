// Copyright 2013-2015, University of Colorado Boulder

/**
 * Visual representation of the ruler.
 * This is a wrapper around the common-code ruler node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var Shape = require( 'KITE/Shape' );

  // phet-io modules
  var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );

  // strings
  var unitsCentimetersString = require( 'string!BEERS_LAW_LAB/units.centimeters' );

  // constants
  var MAJOR_TICK_WIDTH = 0.5; // in model coordinate frame

  /**
   * @param {Ruler} ruler
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function BLLRulerNode( ruler, modelViewTransform, tandem ) {

    var thisNode = this;
    Node.call( thisNode );

    // Compute tick labels, 1 major tick for every 0.5 unit of length, labels on the ticks that correspond to integer values.
    var majorTickLabels = [];
    var numberOfTicks = Math.floor( ruler.length / MAJOR_TICK_WIDTH ) + 1;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[ i ] = ( i % 2 === 0 ) ? ( i / 2 ) : '';
    }

    // use the common ruler node
    var width = modelViewTransform.modelToViewDeltaX( ruler.length );
    var height = modelViewTransform.modelToViewDeltaY( ruler.height );
    var majorTickWidth = modelViewTransform.modelToViewDeltaX( MAJOR_TICK_WIDTH );
    thisNode.addChild( new RulerNode( width, height, majorTickWidth, majorTickLabels, unitsCentimetersString,
      { minorTicksPerMajorTick: 4, insetsWidth: 0 } ) );

    // touch area
    var dx = 0.05 * thisNode.width;
    var dy = 0.5 * thisNode.height;
    thisNode.touchArea = Shape.rectangle( -dx, -dy, thisNode.width + dx + dx, thisNode.height + dy + dy );

    // sync with model
    ruler.locationProperty.link( function( location ) {
      var position = modelViewTransform.modelToViewPosition( location );
      thisNode.x = position.x;
      thisNode.y = position.y;
    } );

    // interactivity
    thisNode.cursor = 'pointer';

    // @private (phet-io)
    this.movableDragHandler = new MovableDragHandler( ruler.locationProperty, {
      tandem: tandem.createTandem( 'movableDragHandler' ),
      dragBounds: ruler.dragBounds,
      modelViewTransform: modelViewTransform
    } );
    thisNode.addInputListener( this.movableDragHandler );

    TNode && tandem.addInstance( this, TNode );
  }

  beersLawLab.register( 'BLLRulerNode', BLLRulerNode );

  return inherit( Node, BLLRulerNode );
} );
