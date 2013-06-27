// Copyright 2002-2013, University of Colorado Boulder

/**
 * Stock solution coming out of the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var ConcentrationSolution = require( "concentration/model/ConcentrationSolution" );
  var DropperNode = require( "concentration/view/DropperNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var Path = require( "SCENERY/nodes/Path" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Solvent} solvent
   * @param {Property<Solute>} solute
   * @param {Dropper} dropper
   * @param {Beaker} beaker
   * @param {Number} tipWidth
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function StockSolutionNode( solvent, solute, dropper, beaker, tipWidth, mvt ) {

    var thisNode = this;

    Rectangle.call( thisNode, 0, 0, 0, 0, { lineWidth: 1 } );

    // shape and location
    var updateShapeAndLocation = function() {
      // path
      if ( dropper.on.get() && !dropper.empty.get() ) {
        thisNode.setRect( -tipWidth / 2, 0, tipWidth, beaker.location.y - dropper.location.get().y );
      }
      else {
        thisNode.setRect( 0, 0, 0, 0 );
      }
      // move this node to the dropper's location
      thisNode.translation = mvt.modelToViewPosition( dropper.location.get() );
    };
    dropper.location.link( updateShapeAndLocation );
    dropper.on.link( updateShapeAndLocation );
    dropper.empty.link( updateShapeAndLocation );

    // set color to match solute
    solute.link( function( solute ) {
      var color = ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration );
      thisNode.fill = color;
      thisNode.stroke = color.darkerColor();
    } );

    // hide this node when the dropper is invisible
    dropper.visible.link( function( visible ) {
      thisNode.setVisible( visible );
    } );
  }

  inherit( Rectangle, StockSolutionNode );

  return StockSolutionNode;
} );