// Copyright 2002-2013, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConcentrationSolution = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationSolution' );
  var EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  /**
   * @param {Dropper} dropper
   * @param {Solvent} solvent
   * @param {Property.<Solute>} soluteProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BLLDropperNode( dropper, solvent, soluteProperty, modelViewTransform ) {

    var thisNode = this;

    EyeDropperNode.call( thisNode, {
      onProperty: dropper.onProperty,
      enabledProperty: dropper.enabledProperty,
      emptyProperty: dropper.emptyProperty,
      togetherID: 'concentrationScreen.dropper',
      buttonTogetherID: 'concentrationScreen.dropperButton'
    } );

    // label background, so the label shows up on various fluid colors
    var labelBackground = new Path( null, {
      fill: 'rgba( 240, 240, 240, 0.6 )' // translucent gray
    } );
    thisNode.addChild( labelBackground );

    // label
    var label = new SubSupText( '', {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      fill: 'black'
    } );
    thisNode.addChild( label );

    // location
    dropper.locationProperty.link( function( location ) {
      thisNode.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // visibility
    dropper.visibleProperty.link( function( visible ) {
      thisNode.visible = visible;
      if ( !visible ) { dropper.flowRateProperty.set( 0 ); }
    } );

    // Change the label and color when the solute changes.
    soluteProperty.link( function( solute ) {

      // fluid color
      thisNode.fluidColor = ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration );

      // label, centered in the dropper's glass
      label.text = solute.formula;

      // rotate to vertical, center the label in the dropper's glass
      label.rotation = -Math.PI / 2;
      label.centerX = 0;
      label.centerY = thisNode.GLASS_MAX_Y - ( thisNode.GLASS_MAX_Y - thisNode.GLASS_MIN_Y ) / 2;

      // translucent background for the label, so that it's visible on all solution colors
      var width = 0.75 * thisNode.GLASS_WIDTH;
      var height = 1.2 * label.height;
      var x = label.centerX - ( width / 2 );
      var y = label.centerY - ( height / 2 );
      labelBackground.shape = Shape.roundRect( x, y, width, height, 5, 5 );
    } );

    // dilate touch area
    thisNode.touchArea = thisNode.localBounds.dilatedX( 0.25 * thisNode.width );

    // move the dropper
    this.movableDragHandler = new MovableDragHandler( dropper.locationProperty, {
      dragBounds: dropper.dragBounds,
      modelViewTransform: modelViewTransform,
      togetherID: thisNode.togetherID
    } );
    thisNode.addInputListener( this.movableDragHandler );
  }

  return inherit( EyeDropperNode, BLLDropperNode );
} );
