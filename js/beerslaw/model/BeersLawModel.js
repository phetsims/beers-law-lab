// Copyright 2002-2013, University of Colorado

/**
 * Model container for the "Beer's Law" module.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Absorbance = require( "beerslaw/model/Absorbance" );
  var ATDetector = require( "beerslaw/model/ATDetector" );
  var Beam = require( "beerslaw/model/Beam" );
  var BeersLawSolution = require( "beerslaw/model/BeersLawSolution" );
  var Bounds2 = require( "DOT/Bounds2" );
  var Cuvette = require( "beerslaw/model/Cuvette" );
  var Light = require( "beerslaw/model/Light" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Range = require( "DOT/Range" );
  var Ruler = require( "beerslaw/model/Ruler" );
  var Vector2 = require( "DOT/Vector2" );

  /**
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BeersLawModel( mvt ) {

    var thisModel = this;

    // Solutions, in rainbow (ROYGBIV) order.
    thisModel.solutions = new Array(
      BeersLawSolution.DRINK_MIX,
      BeersLawSolution.COBALT_II_NITRATE );
    //TODO add more solutions

    thisModel.solution = new Property( thisModel.solutions[0] );

    thisModel.cuvette = new Cuvette( new Vector2( 3, 0.8 ), new Range( 0.5, 2.0, 1.0 ), 3 );

    thisModel.light = new Light( new Vector2( thisModel.cuvette.location.x - 1.5, thisModel.cuvette.location.y + ( thisModel.cuvette.height / 2 ) ),
                                 false, 0.45, thisModel.solution );

    var rulerWidth = 2; // cm
    thisModel.ruler = new Ruler( rulerWidth, 0.1, 0.35,
                                 new Vector2( 0.5, 4.7 ),
                                 new Bounds2( 0, 0, 6, 5 ) );

    this.absorbance = new Absorbance( thisModel.light, thisModel.solution, thisModel.cuvette );

    this.detector = new ATDetector( new Vector2( 6, 0.5 ), new Bounds2( 0, 0, 7.9, 5.25 ),
                                    new Vector2( 6, thisModel.light.location.y ), new Bounds2( 0, 0, 7.9, 5.25 ),
                                    thisModel.light, thisModel.cuvette, thisModel.absorbance );

    this.beam = new Beam( thisModel.light, thisModel.cuvette, thisModel.detector, thisModel.absorbance, mvt );
  }

  // Resets all model elements
  BeersLawModel.prototype.reset = function () {
    for ( var i = 0; i < this.solutions.length; i++ ) {
      this.solutions[i].reset();
    }
    this.solution.reset();
    this.light.reset();
    this.cuvette.reset();
    this.detector.reset();
    this.ruler.reset();
  };

  /*
   * Moves time forward by the specified amount.
   * @param deltaSeconds clock time change, in seconds.
   */
  BeersLawModel.prototype.step = function ( deltaSeconds ) {
    // do nothing, nothing time-based in this model
  };

  return BeersLawModel;
} );
