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
   * @param {Tandem} tandem - support for exporting instances from the sim
   * @constructor
   */
  function BLLDropperNode( dropper, solvent, soluteProperty, modelViewTransform, tandem ) {

    var thisNode = this;

    EyeDropperNode.call( thisNode, {
      dispensingProperty: dropper.dispensingProperty,
      enabledProperty: dropper.enabledProperty,
      emptyProperty: dropper.emptyProperty,

      // Using the movableDragHander below to report its locations for the BLLDropperNode (for now?)
      // So we cannot use the same ID in the base class.  The ID in the base class is not currently used.
      tandem: tandem
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
    } );
    thisNode.addInputListener( this.movableDragHandler );

    /*
     * TODO: If/when EyeDropperNode registers itself with tandem, this will be a problem since
     * togetherIDs would get overwritten.  One solution would be to make EyeDropperNode draggable.
     */
    // no corresponding removeInstance is needed because this object exists for the lifetime of the sim
    tandem.addInstance( this );
  }

  return inherit( EyeDropperNode, BLLDropperNode );
} );
