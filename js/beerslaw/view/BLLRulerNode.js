// Copyright 2013-2017, University of Colorado Boulder

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

    var self = this;
    Node.call( this, { tandem: tandem } );

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
    this.addChild( new RulerNode(
      width,
      height,
      majorTickWidth,
      majorTickLabels,
      unitsCentimetersString,
      { minorTicksPerMajorTick: 4, insetsWidth: 0, tandem: tandem.createTandem( 'ruler' ) } )
    );

    // touch area
    var dx = 0.05 * this.width;
    var dy = 0.5 * this.height;
    this.touchArea = Shape.rectangle( -dx, -dy, this.width + dx + dx, this.height + dy + dy );

    // sync with model
    ruler.locationProperty.link( function( location ) {
      var position = modelViewTransform.modelToViewPosition( location );
      self.x = position.x;
      self.y = position.y;
    } );

    // interactivity
    this.cursor = 'pointer';

    // @private (phet-io)
    this.movableDragHandler = new MovableDragHandler( ruler.locationProperty, {
      tandem: tandem.createTandem( 'movableDragHandler' ),
      dragBounds: ruler.dragBounds,
      modelViewTransform: modelViewTransform
    } );
    this.addInputListener( this.movableDragHandler );
  }

  beersLawLab.register( 'BLLRulerNode', BLLRulerNode );

  return inherit( Node, BLLRulerNode );
} );
