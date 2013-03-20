// Copyright 2002-2013, University of Colorado

/**
 * Stock solution coming out of the dropper.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var Shape = require( "KITE/Shape" );
  var Path = require( "SCENERY/nodes/Path" );
  var Inheritance = require( "PHETCOMMON/util/Inheritance" );
  var ConcentrationSolution = require( "concentration/model/ConcentrationSolution" );
  var DropperNode = require( "concentration/view/DropperNode" );

  /**
   * @param {Solvent} solvent
   * @param {Property} solute (type Solute)
   * @param {Dropper} dropper
   * @param {Beaker} beaker
   * @param {Number} tipWidth
   * @param {ModelViewTransform2D} mvt
   * @constructor
   */
  function StockSolutionNode( solvent, solute, dropper, beaker, tipWidth, mvt ) {

    var thisNode = this;

    Path.call( thisNode, {
      lineWidth: 1 //TODO is this working?
    } );

    // shape and location
    var updateShapeAndLocation = function () {
      // path
      if ( dropper.on.get() && !dropper.empty.get() ) {
        thisNode.shape = Shape.rect( -tipWidth / 2, 0, tipWidth, beaker.location.y - dropper.location.get().y );
      }
      else {
        thisNode.shape = new Shape();
      }
      // move this node to the dropper's location
      thisNode.translation = mvt.modelToView( dropper.location.get() );
    };
    dropper.location.addObserver( updateShapeAndLocation );
    dropper.on.addObserver( updateShapeAndLocation );
    dropper.empty.addObserver( updateShapeAndLocation );

    // set color to match solute
    solute.addObserver( function ( solute ) {
      var color = ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration );
      thisNode.fill = color.toCSS();
      thisNode.stroke = color.darker().toCSS(); //TODO too dark?
    } );

    // hide this node when the dropper is invisible
    dropper.visible.addObserver( function ( visible ) {
//TODO      thisNode.setVisible( visible );
    } );
  }

  Inheritance.inheritPrototype( StockSolutionNode, Path );

  return StockSolutionNode;
} );