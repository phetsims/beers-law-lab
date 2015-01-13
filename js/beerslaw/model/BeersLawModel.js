// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model container for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Absorbance = require( 'BEERS_LAW_LAB/beerslaw/model/Absorbance' );
  var ATDetector = require( 'BEERS_LAW_LAB/beerslaw/model/ATDetector' );
  var Beam = require( 'BEERS_LAW_LAB/beerslaw/model/Beam' );
  var BeersLawSolution = require( 'BEERS_LAW_LAB/beerslaw/model/BeersLawSolution' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Cuvette = require( 'BEERS_LAW_LAB/beerslaw/model/Cuvette' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Light = require( 'BEERS_LAW_LAB/beerslaw/model/Light' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Ruler = require( 'BEERS_LAW_LAB/beerslaw/model/Ruler' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BeersLawModel( modelViewTransform ) {

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

    thisModel.solution = new Property( thisModel.solutions[ 0 ] );

    //NOTE: All locations are relative to the location of the cuvette.
    thisModel.cuvette = new Cuvette( new Vector2( 3.3, 0.5 ), new Range( 0.5, 2.0, 1.0 ), 3 );

    thisModel.light = new Light( new Vector2( thisModel.cuvette.location.x - 1.5, thisModel.cuvette.location.y + ( thisModel.cuvette.height / 2 ) ),
      false, 0.45, thisModel.solution );

    thisModel.ruler = new Ruler( 2.1, 0.1, 0.35,
      new Vector2( thisModel.cuvette.location.x - 2.6, thisModel.cuvette.location.y + 4 ),
      new Bounds2( 0, 0, 6, 5 ) );

    this.absorbance = new Absorbance( thisModel.light, thisModel.solution, thisModel.cuvette );

    this.detector = new ATDetector( new Vector2( thisModel.cuvette.location.x + 3, thisModel.cuvette.location.y - 0.3 ),
      new Bounds2( 0, 0, 7.9, 5.25 ),
      new Vector2( thisModel.cuvette.location.x + 3, thisModel.light.location.y ),
      new Bounds2( 0, 0, 7.9, 5.25 ),
      thisModel.light, thisModel.cuvette, thisModel.absorbance );

    this.beam = new Beam( thisModel.light, thisModel.cuvette, thisModel.detector, thisModel.absorbance, modelViewTransform );
  }

  return inherit( Object, BeersLawModel, {

    // Resets all model elements
    reset: function() {
      for ( var i = 0; i < this.solutions.length; i++ ) {
        this.solutions[ i ].reset();
      }
      this.solution.reset();
      this.light.reset();
      this.cuvette.reset();
      this.detector.reset();
      this.ruler.reset();
    }
  } );
} );
