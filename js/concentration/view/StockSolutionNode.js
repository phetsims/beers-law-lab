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
   * @param {Property<Solute>} solute
   * @param {Dropper} dropper
   * @param {Beaker} beaker
   * @param {Number} tipWidth
   * @constructor
   */
  function StockSolutionNode( solvent, solute, dropper, beaker, tipWidth ) {

    var thisNode = this;

    Path.call( thisNode, {
      lineWidth: 1 //TODO is this working?
    } );

    // shape and location
    var updateShapeAndLocation = function () {
      // path
      if ( dropper.on.get() && !dropper.empty.get() ) {
        console.log( "StockSolutionNode rect=" + tipWidth + "x" + (beaker.location.y - dropper.location.get().y) );//XXX
        thisNode.shape = Shape.rect( -tipWidth / 2, 0, tipWidth, beaker.location.y - dropper.location.get().y );
      }
      else {
        thisNode.shape = new Shape();
      }
      // move this node to the dropper's location
      console.log( "StockSolutionNode translation=" + dropper.location.get() );//XXX
      thisNode.translation = dropper.location.get();
    };
    dropper.location.addObserver( updateShapeAndLocation );
    dropper.on.addObserver( updateShapeAndLocation );
    dropper.empty.addObserver( updateShapeAndLocation );

    // set color to match solute
    solute.addObserver( function ( solute ) {
      var color = ConcentrationSolution.createColor( solvent, solute, solute.stockSolutionConcentration );
      console.log( "StockSolutionNode color=" + color.toCSS() );//XXX
      thisNode.fill = color.toCSS();
      thisNode.stroke = color.darker().toCSS();
    } );

    // hide this node when the dropper is invisible
    dropper.visible.addObserver( function ( visible ) {
//TODO      thisNode.setVisible( visible );
    } );
  }

  Inheritance.inheritPrototype( StockSolutionNode, Path );

  return StockSolutionNode;
} );