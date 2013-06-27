// Copyright 2002-2013, University of Colorado

/**
 * Model container for the "Beer's Law" tab.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Absorbance = require( "beerslaw/model/Absorbance" );
  var ATDetector = require( "beerslaw/model/ATDetector" );
  var Beam = require( "beerslaw/model/Beam" );
  var BeersLawSolution = require( "beerslaw/model/BeersLawSolution" );
  var Bounds2 = require( "DOT/Bounds2" );
  var Cuvette = require( "beerslaw/model/Cuvette" );
  var Light = require( "beerslaw/model/Light" );
  var Property = require( "AXON/Property" );
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
    thisModel.solutions = [
      BeersLawSolution.DRINK_MIX,
      BeersLawSolution.COBALT_II_NITRATE,
      BeersLawSolution.COBALT_CHLORIDE,
      BeersLawSolution.POTASSIUM_DICHROMATE,
      BeersLawSolution.POTASSIUM_CHROMATE,
      BeersLawSolution.NICKEL_II_CHLORIDE,
      BeersLawSolution.COPPER_SULFATE,
      BeersLawSolution.POTASSIUM_PERMANGANATE
    ];

    thisModel.solution = new Property( thisModel.solutions[0] );

    thisModel.cuvette = new Cuvette( new Vector2( 3, 0.8 ), new Range( 0.5, 2.0, 1.0 ), 3 );

    thisModel.light = new Light( new Vector2( thisModel.cuvette.location.x - 1.5, thisModel.cuvette.location.y + ( thisModel.cuvette.height / 2 ) ),
      false, 0.45, thisModel.solution );

    var rulerWidth = 2; // cm
    thisModel.ruler = new Ruler( rulerWidth, 0.1, 0.35,
      new Vector2( 0.4, 4.9 ),
      new Bounds2( 0, 0, 6, 5 ) );

    this.absorbance = new Absorbance( thisModel.light, thisModel.solution, thisModel.cuvette );

    this.detector = new ATDetector( new Vector2( 6, 0.5 ), new Bounds2( 0, 0, 7.9, 5.25 ),
      new Vector2( 6, thisModel.light.location.y ), new Bounds2( 0, 0, 7.9, 5.25 ),
      thisModel.light, thisModel.cuvette, thisModel.absorbance );

    this.beam = new Beam( thisModel.light, thisModel.cuvette, thisModel.detector, thisModel.absorbance, mvt );
  }

  BeersLawModel.prototype = {

    // Resets all model elements
    reset: function() {
      for ( var i = 0; i < this.solutions.length; i++ ) {
        this.solutions[i].reset();
      }
      this.solution.reset();
      this.light.reset();
      this.cuvette.reset();
      this.detector.reset();
      this.ruler.reset();
    },

    /*
     * Moves time forward by the specified amount.
     * @param {Number} deltaSeconds clock time change, in seconds.
     */
    step: function( deltaSeconds ) {
      // do nothing, nothing time-based in this model
    }
  };

  return BeersLawModel;
} );
