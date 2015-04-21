// Copyright 2002-2013, University of Colorado Boulder

/**
 * Stock solution coming out of the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConcentrationSolution = require( 'BEERS_LAW_LAB/concentration/model/ConcentrationSolution' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Solvent} solvent
   * @param {Property.<Solute>} soluteProperty
   * @param {Dropper} dropper
   * @param {Beaker} beaker
   * @param {number} tipWidth
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function StockSolutionNode( solvent, soluteProperty, dropper, beaker, tipWidth, modelViewTransform ) {

    var thisNode = this;

    Rectangle.call( thisNode, 0, 0, 0, 0, { lineWidth: 1 } );

    // shape and location
    var updateShapeAndLocation = function() {
      // path
      if ( dropper.dispensingProperty.get() && !dropper.emptyProperty.get() ) {
        thisNode.setRect( -tipWidth / 2, 0, tipWidth, beaker.location.y - dropper.locationProperty.get().y );
      }
      else {
        thisNode.setRect( 0, 0, 0, 0 );
      }
      // move this node to the dropper's location
      thisNode.translation = modelViewTransform.modelToViewPosition( dropper.locationProperty.get() );
    };
    dropper.locationProperty.link( updateShapeAndLocation );
    dropper.dispensingProperty.link( updateShapeAndLocation );
    dropper.emptyProperty.link( updateShapeAndLocation );

    // set color to match solute
    soluteProperty.link( function( solute ) {
      var color = ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration );
      thisNode.fill = color;
      thisNode.stroke = color.darkerColor();
    } );

    // hide this node when the dropper is invisible
    dropper.visibleProperty.link( function( visible ) {
      thisNode.setVisible( visible );
    } );
  }

  return inherit( Rectangle, StockSolutionNode );
} );