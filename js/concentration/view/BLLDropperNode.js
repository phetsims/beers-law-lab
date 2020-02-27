// Copyright 2013-2020, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const ConcentrationSolution = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationSolution' );
  const EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Shape = require( 'KITE/Shape' );

  class BLLDropperNode extends EyeDropperNode {

    /**
     * @param {Dropper} dropper
     * @param {Solvent} solvent
     * @param {Property.<Solute>} soluteProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Tandem} tandem
     */
    constructor( dropper, solvent, soluteProperty, modelViewTransform, tandem ) {

      super( {
        dispensingProperty: dropper.dispensingProperty,
        enabledProperty: dropper.enabledProperty,
        emptyProperty: dropper.emptyProperty,
        tandem: tandem
      } );

      // label background, so the label shows up on various fluid colors
      const labelBackground = new Path( null, {
        fill: 'rgba( 240, 240, 240, 0.6 )' // translucent gray
      } );
      this.addChild( labelBackground );

      // label
      const label = new RichText( '', {
        maxWidth: 80, // determined empirically, to cover only the glass portion of the dropper
        font: new PhetFont( { size: 18, weight: 'bold' } ),
        fill: 'black',
        tandem: tandem.createTandem( 'label' )
      } );
      this.addChild( label );

      // position
      dropper.positionProperty.link( position => {
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );

      // visibility
      dropper.visibleProperty.link( visible => {
        this.visible = visible;
        if ( !visible ) { dropper.flowRateProperty.set( 0 ); }
      } );

      // Change the label and color when the solute changes.
      soluteProperty.link( solute => {

        // fluid color
        this.fluidColor = ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration );

        // label, centered in the dropper's glass
        label.text = solute.formula;

        // rotate to vertical, center the label in the dropper's glass
        label.rotation = -Math.PI / 2;
        label.centerX = 0;
        label.centerY = EyeDropperNode.GLASS_MAX_Y - ( EyeDropperNode.GLASS_MAX_Y - EyeDropperNode.GLASS_MIN_Y ) / 2;

        // translucent background for the label, so that it's visible on all solution colors
        const width = 0.75 * EyeDropperNode.GLASS_WIDTH;
        const height = 1.2 * label.height;
        const x = label.centerX - ( width / 2 );
        const y = label.centerY - ( height / 2 );
        labelBackground.shape = Shape.roundRect( x, y, width, height, 5, 5 );
      } );

      // dilate touch area
      this.touchArea = this.localBounds.dilatedX( 0.25 * this.width );

      // move the dropper
      const movableDragHandler = new MovableDragHandler( dropper.positionProperty, {
        tandem: tandem.createTandem( 'movableDragHandler' ),
        dragBounds: dropper.dragBounds,
        modelViewTransform: modelViewTransform
      } );
      this.addInputListener( movableDragHandler );
    }
  }

  return beersLawLab.register( 'BLLDropperNode', BLLDropperNode );
} );
