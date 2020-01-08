// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of the ruler.
 * This is a wrapper around the common-code ruler node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RulerNode = require( 'SCENERY_PHET/RulerNode' );
  const Shape = require( 'KITE/Shape' );

  // strings
  const unitsCentimetersString = require( 'string!BEERS_LAW_LAB/units.centimeters' );

  // constants
  const MAJOR_TICK_WIDTH = 0.5; // in model coordinate frame

  /**
   * @param {Ruler} ruler
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function BLLRulerNode( ruler, modelViewTransform, tandem ) {

    const self = this;
    Node.call( this, { tandem: tandem } );

    // Compute tick labels, 1 major tick for every 0.5 unit of length, labels on the ticks that correspond to integer values.
    const majorTickLabels = [];
    const numberOfTicks = Math.floor( ruler.length / MAJOR_TICK_WIDTH ) + 1;
    for ( let i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[ i ] = ( i % 2 === 0 ) ? ( i / 2 ) : '';
    }

    // use the common ruler node
    const width = modelViewTransform.modelToViewDeltaX( ruler.length );
    const height = modelViewTransform.modelToViewDeltaY( ruler.height );
    const majorTickWidth = modelViewTransform.modelToViewDeltaX( MAJOR_TICK_WIDTH );
    this.addChild( new RulerNode(
      width,
      height,
      majorTickWidth,
      majorTickLabels,
      unitsCentimetersString,
      { minorTicksPerMajorTick: 4, insetsWidth: 0, tandem: tandem.createTandem( 'ruler' ) } )
    );

    // touch area
    const dx = 0.05 * this.width;
    const dy = 0.5 * this.height;
    this.touchArea = Shape.rectangle( -dx, -dy, this.width + dx + dx, this.height + dy + dy );

    // sync with model
    ruler.positionProperty.link( function( position ) {
      const viewPosition = modelViewTransform.modelToViewPosition( position );
      self.x = viewPosition.x;
      self.y = viewPosition.y;
    } );

    // interactivity
    this.cursor = 'pointer';

    // @private (phet-io)
    this.movableDragHandler = new MovableDragHandler( ruler.positionProperty, {
      tandem: tandem.createTandem( 'movableDragHandler' ),
      dragBounds: ruler.dragBounds,
      modelViewTransform: modelViewTransform
    } );
    this.addInputListener( this.movableDragHandler );
  }

  beersLawLab.register( 'BLLRulerNode', BLLRulerNode );

  return inherit( Node, BLLRulerNode );
} );
