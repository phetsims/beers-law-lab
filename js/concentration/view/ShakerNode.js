// Copyright 2013-2020, University of Colorado Boulder

/**
 * Shaker that contains a solute in solid form.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );

  // images
  const shakerImage = require( 'image!BEERS_LAW_LAB/shaker.png' );

  // constants
  const DEBUG_ORIGIN = false;
  const ARROW_LENGTH = 40;
  const ARROW_OPTIONS = {
    tailWidth: 23,
    headWidth: 40,
    headHeight: 30,
    fill: 'yellow',
    stroke: 'rgb(160,160,160)'
  };

  /**
   * @param {Shaker} shaker
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function ShakerNode( shaker, modelViewTransform, tandem ) {

    const self = this;

    Node.call( this, {
      tandem: tandem,

      // Performance optimization so Scenery won't fit blocks around this.
      // See https://github.com/phetsims/beers-law-lab/issues/113
      preventFit: true
    } );

    // shaker image
    const imageNode = new Image( shakerImage );
    imageNode.setScaleMagnitude( 0.75 );

    // label
    const labelNode = new RichText( shaker.soluteProperty.get().formula, {
      font: new PhetFont( { size: 22, weight: 'bold' } ),
      fill: 'black',
      maxWidth: 0.5 * imageNode.width, // constrain width for i18n
      tandem: tandem.createTandem( 'labelNode' )
    } );
    
    // arrows
    const arrowsOffset = imageNode.height / 2 + 4;

    const downArrowNode = new ArrowNode( 0, 0, 0, ARROW_LENGTH, merge( {
      top: arrowsOffset,
      tandem: tandem.createTandem( 'downArrowNode' )
    }, ARROW_OPTIONS ) );

    const upArrowNode = new ArrowNode( 0, 0, 0, -ARROW_LENGTH, merge( {
      bottom: -arrowsOffset,
      tandem: tandem.createTandem( 'upArrowNode' )
    }, ARROW_OPTIONS ) );

    const arrowsParent = new Node( {
      children: [ upArrowNode, downArrowNode ],
      center: imageNode.center,
      pickable: false,
      visible: false
    });

    // common parent, to simplify rotation and label alignment.
    const parentNode = new Node( { children: [ imageNode, labelNode, arrowsParent ] } );
    this.addChild( parentNode );
    parentNode.rotate( shaker.orientation - Math.PI ); // assumes that shaker points to the left in the image file
    
    // Manually adjust these values until the origin is in the middle hole of the shaker.
    parentNode.translate( -12, -imageNode.height / 2 );

    // origin
    if ( DEBUG_ORIGIN ) {
      this.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    // sync position with model
    let shakerWasMoved = false;
    shaker.positionProperty.link( function( position ) {
      self.translation = modelViewTransform.modelToViewPosition( position );
      shakerWasMoved = true;
      arrowsParent.visible = false;
    } );
    shakerWasMoved = false; // reset to false, because function is fired when link is performed

    // sync visibility with model
    shaker.visibleProperty.link( function( visible ) {
      self.setVisible( visible );
    } );

    // sync solute with model
    shaker.soluteProperty.link( function( solute ) {
      // label the shaker with the solute formula
      labelNode.setText( solute.formula );
      // center the label on the shaker
      const capWidth = 0.3 * imageNode.width; // multiplier is dependent on image file
      labelNode.centerX = capWidth + ( imageNode.width - capWidth ) / 2;
      labelNode.centerY = imageNode.centerY;
    } );

    // interactivity
    this.cursor = 'pointer';
    this.addInputListener( new MovableDragHandler( shaker.positionProperty, {
      tandem: tandem.createTandem( 'inputListener' ),
      dragBounds: shaker.dragBounds,
      modelViewTransform: modelViewTransform
    } ) );
    this.addInputListener( {
      enter: function() {
        arrowsParent.visible = !shakerWasMoved;
      },
      exit: function() {
        arrowsParent.visible = false;
      }
    } );
  }

  beersLawLab.register( 'ShakerNode', ShakerNode );

  return inherit( Node, ShakerNode );
} );
