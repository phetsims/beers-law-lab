// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model container for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Absorbance = require( 'BEERS_LAW_LAB/beerslaw/model/Absorbance' );
  const ATDetector = require( 'BEERS_LAW_LAB/beerslaw/model/ATDetector' );
  const Beam = require( 'BEERS_LAW_LAB/beerslaw/model/Beam' );
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BeersLawSolution = require( 'BEERS_LAW_LAB/beerslaw/model/BeersLawSolution' );
  const BeersLawSolutionIO = require( 'BEERS_LAW_LAB/beerslaw/model/BeersLawSolutionIO' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Cuvette = require( 'BEERS_LAW_LAB/beerslaw/model/Cuvette' );
  const Light = require( 'BEERS_LAW_LAB/beerslaw/model/Light' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Ruler = require( 'BEERS_LAW_LAB/beerslaw/model/Ruler' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const CUVETTE_WIDTH_RANGE = new RangeWithValue( 0.5, 2.0, 1.0 );

  class BeersLawModel {

    /**
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Tandem} tandem
     */
    constructor( modelViewTransform, tandem ) {

      // @public Solutions, in rainbow (ROYGBIV) order.
      this.solutions = [
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
      this.solutionProperty = new Property( this.solutions[ 0 ], {
        tandem: tandem.createTandem( 'solutionProperty' ),
        phetioType: PropertyIO( BeersLawSolutionIO )
      } );

      // @public NOTE: All positions are relative to the position of the cuvette.
      this.cuvette = new Cuvette( new Vector2( 3.3, 0.5 ), CUVETTE_WIDTH_RANGE, 3, tandem.createTandem( 'cuvette' ) );

      // @public
      this.light = new Light( new Vector2( this.cuvette.position.x - 1.5, this.cuvette.position.y + ( this.cuvette.height / 2 ) ),
        false, 0.45, this.solutionProperty, tandem.createTandem( 'light' ) );

      // @public
      this.ruler = new Ruler( 2.1, 0.1, 0.35,
        new Vector2( this.cuvette.position.x - 2.6, this.cuvette.position.y + 4 ),
        new Bounds2( 0, 0, 6, 5 ), {
          tandem: tandem.createTandem( 'ruler' )
        }
      );

      // @public
      this.absorbance = new Absorbance( this.light, this.solutionProperty, this.cuvette );

      // @public
      this.detector = new ATDetector( new Vector2( this.cuvette.position.x + 3, this.cuvette.position.y - 0.3 ),
        new Bounds2( 0, 0, 7.9, 5.25 ),
        new Vector2( this.cuvette.position.x + 3, this.light.position.y ),
        new Bounds2( 0, 0, 7.9, 5.25 ),
        this.light, this.cuvette, this.absorbance, {
          tandem: tandem.createTandem( 'detector' )
        }
      );

      // @public
      this.beam = new Beam( this.light, this.cuvette, this.detector, this.absorbance, modelViewTransform );
    }

    // @public
    reset() {
      for ( let i = 0; i < this.solutions.length; i++ ) {
        this.solutions[ i ].reset();
      }
      this.solutionProperty.reset();
      this.light.reset();
      this.cuvette.reset();
      this.detector.reset();
      this.ruler.reset();
    }
  }

  // Exported for access to phet-io API
  BeersLawModel.CUVETTE_WIDTH_RANGE = CUVETTE_WIDTH_RANGE;

  return beersLawLab.register( 'BeersLawModel', BeersLawModel );
} );

