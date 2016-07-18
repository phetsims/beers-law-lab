// Copyright 2013-2015, University of Colorado Boulder

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
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var BeersLawSolution = require( 'BEERS_LAW_LAB/beerslaw/model/BeersLawSolution' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Cuvette = require( 'BEERS_LAW_LAB/beerslaw/model/Cuvette' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Light = require( 'BEERS_LAW_LAB/beerslaw/model/Light' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Ruler = require( 'BEERS_LAW_LAB/beerslaw/model/Ruler' );
  var Vector2 = require( 'DOT/Vector2' );

  var CUVETTE_WIDTH_RANGE = new RangeWithValue( 0.5, 2.0, 1.0 );

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function BeersLawModel( modelViewTransform, tandem ) {

    var thisModel = this;

    // @public Solutions, in rainbow (ROYGBIV) order.
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

    // @public
    thisModel.solutionProperty = new Property( thisModel.solutions[ 0 ], {
      tandem: tandem.createTandem( 'solutionProperty' )
    } );

    // @public NOTE: All locations are relative to the location of the cuvette.
    thisModel.cuvette = new Cuvette( new Vector2( 3.3, 0.5 ), CUVETTE_WIDTH_RANGE, 3, tandem.createTandem( 'cuvette' ) );

    // @public
    thisModel.light = new Light( new Vector2( thisModel.cuvette.location.x - 1.5, thisModel.cuvette.location.y + ( thisModel.cuvette.height / 2 ) ),
      false, 0.45, thisModel.solutionProperty, tandem.createTandem( 'light' ) );

    // @public
    thisModel.ruler = new Ruler( 2.1, 0.1, 0.35,
      new Vector2( thisModel.cuvette.location.x - 2.6, thisModel.cuvette.location.y + 4 ),
      new Bounds2( 0, 0, 6, 5 ),
      tandem.createTandem( 'ruler' )
    );

    // @public
    this.absorbance = new Absorbance( thisModel.light, thisModel.solutionProperty, thisModel.cuvette );

    // @pubic
    this.detector = new ATDetector( new Vector2( thisModel.cuvette.location.x + 3, thisModel.cuvette.location.y - 0.3 ),
      new Bounds2( 0, 0, 7.9, 5.25 ),
      new Vector2( thisModel.cuvette.location.x + 3, thisModel.light.location.y ),
      new Bounds2( 0, 0, 7.9, 5.25 ),
      thisModel.light, thisModel.cuvette, thisModel.absorbance,
      tandem.createTandem( 'detector' )
    );

    // @public
    this.beam = new Beam( thisModel.light, thisModel.cuvette, thisModel.detector, thisModel.absorbance, modelViewTransform );
  }

  beersLawLab.register( 'BeersLawModel', BeersLawModel );

  return inherit( Object, BeersLawModel, {

    // @public Resets all model elements
    reset: function() {
      for ( var i = 0; i < this.solutions.length; i++ ) {
        this.solutions[ i ].reset();
      }
      this.solutionProperty.reset();
      this.light.reset();
      this.cuvette.reset();
      this.detector.reset();
      this.ruler.reset();
    }
  }, {
    CUVETTE_WIDTH_RANGE: CUVETTE_WIDTH_RANGE // Exported for access to phet-io API
  } );
} );

