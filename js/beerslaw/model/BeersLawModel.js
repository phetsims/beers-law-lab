// Copyright 2002-2013, University of Colorado

/**
 * Model container for the "Beer's Law" module.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BeersLawSolution = require( "beerslaw/model/BeersLawSolution" );
  var Bounds2 = require( "DOT/Bounds2" );
  var Cuvette = require( "beerslaw/model/Cuvette" );
  var Light = require( "beerslaw/model/Light" );
  var ModelViewTransform2D = require( "PHETCOMMON/view/ModelViewTransform2D" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Range = require( "DOT/Range" );
  var Ruler = require( "beerslaw/model/Ruler" );
  var Vector2 = require( "DOT/Vector2" );

  function BeersLawModel() {

    var thisModel = this;

    //TODO move mvt to view or module
    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
    thisModel.mvt = new ModelViewTransform2D( 125, new Vector2( 0, 0 ) );

    // Solutions, in rainbow (ROYGBIV) order.
    thisModel.solutions = new Array(
      BeersLawSolution.DRINK_MIX,
      BeersLawSolution.COBALT_II_NITRATE );
    //TODO add more solutions

    thisModel.solution = new Property( thisModel.solutions[0] );

    thisModel.light = new Light( new Vector2( 1.5, 2.2 ), false, 0.45, thisModel.solution );

    thisModel.cuvette = new Cuvette( new Vector2( thisModel.light.location.x + 1.5, 1.4 ), new Range( 0.5, 2.0, 1.0 ), 3 );

    var rulerWidth = 2; // cm
    thisModel.ruler = new Ruler( rulerWidth, 0.1, 0.35,
                                 new Vector2( thisModel.cuvette.location.x + ( thisModel.cuvette.width.get() / 2 ) - ( rulerWidth / 2.0 ), 4.9 ), // centered under cuvette
                                 new Bounds2( 0, 1, 8, 5.5 ) );
  }

  // Resets all model elements
  BeersLawModel.prototype.reset = function () {
    for ( var i = 0; i < this.solutions.length; i++ ) {
      this.solutions[i].reset();
    }
    this.solution.reset();
    this.light.reset();
    this.cuvette.reset();
//    this.detector.reset();
    this.ruler.reset();
  };

  /*
   * Moves time forward by the specified amount.
   * @param deltaSeconds clock time change, in seconds.
   */
  BeersLawModel.prototype.step = function ( deltaSeconds ) {
    //TODO
  };

  return BeersLawModel;
} );
