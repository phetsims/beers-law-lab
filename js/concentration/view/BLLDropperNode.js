// Copyright 2013-2015, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var ConcentrationSolution = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationSolution' );
  var EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Dropper} dropper
   * @param {Solvent} solvent
   * @param {Property.<Solute>} soluteProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function BLLDropperNode( dropper, solvent, soluteProperty, modelViewTransform, tandem ) {

    var self = this;

    EyeDropperNode.call( this, {
      dispensingProperty: dropper.dispensingProperty,
      enabledProperty: dropper.enabledProperty,
      emptyProperty: dropper.emptyProperty,
      tandem: tandem.createSupertypeTandem() // supertype handles tandem registration for the momentary button
    } );

    // label background, so the label shows up on various fluid colors
    var labelBackground = new Path( null, {
      fill: 'rgba( 240, 240, 240, 0.6 )' // translucent gray
    } );
    this.addChild( labelBackground );

    // label
    var label = new RichText( '', {
      maxWidth: 80, // determined empirically, to cover only the glass portion of the dropper
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      fill: 'black',
      tandem: tandem.createTandem( 'label' )
    } );
    this.addChild( label );

    // location
    dropper.locationProperty.link( function( location ) {
      self.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // visibility
    dropper.visibleProperty.link( function( visible ) {
      self.visible = visible;
      if ( !visible ) { dropper.flowRateProperty.set( 0 ); }
    } );

    // Change the label and color when the solute changes.
    soluteProperty.link( function( solute ) {

      // fluid color
      self.fluidColor = ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration );

      // label, centered in the dropper's glass
      label.text = solute.formula;

      // rotate to vertical, center the label in the dropper's glass
      label.rotation = -Math.PI / 2;
      label.centerX = 0;
      label.centerY = EyeDropperNode.GLASS_MAX_Y - ( EyeDropperNode.GLASS_MAX_Y - EyeDropperNode.GLASS_MIN_Y ) / 2;

      // translucent background for the label, so that it's visible on all solution colors
      var width = 0.75 * EyeDropperNode.GLASS_WIDTH;
      var height = 1.2 * label.height;
      var x = label.centerX - ( width / 2 );
      var y = label.centerY - ( height / 2 );
      labelBackground.shape = Shape.roundRect( x, y, width, height, 5, 5 );
    } );

    // dilate touch area
    this.touchArea = this.localBounds.dilatedX( 0.25 * this.width );

    // move the dropper
    var movableDragHandler = new MovableDragHandler( dropper.locationProperty, {
      tandem: tandem.createTandem( 'movableDragHandler' ),
      dragBounds: dropper.dragBounds,
      modelViewTransform: modelViewTransform
    } );
    this.addInputListener( movableDragHandler );

    // tandem support
    this.mutate( {
      tandem: tandem
    } );
  }

  beersLawLab.register( 'BLLDropperNode', BLLDropperNode );

  return inherit( EyeDropperNode, BLLDropperNode );
} );
