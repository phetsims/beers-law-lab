// Copyright 2013-2022, University of Colorado Boulder

/**
 * BeersLawModel is the top-level model for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import AbsorbanceModel from './AbsorbanceModel.js';
import ATDetector from './ATDetector.js';
import Beam from './Beam.js';
import BeersLawSolution from './BeersLawSolution.js';
import Cuvette from './Cuvette.js';
import Light from './Light.js';
import Ruler from './Ruler.js';

class BeersLawModel {

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

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
      tandem: options.tandem.createTandem( 'solutionProperty' ),
      phetioValueType: BeersLawSolution.BeersLawSolutionIO
    } );

    // @public NOTE: All positions are relative to the position of the cuvette.
    this.cuvette = new Cuvette( {
      position: new Vector2( 3.3, 0.5 ),
      tandem: options.tandem.createTandem( 'cuvette' )
    } );

    // @public
    this.light = new Light( this.solutionProperty, {
      position: new Vector2( this.cuvette.position.x - 1.5, this.cuvette.position.y + ( this.cuvette.height / 2 ) ),
      tandem: options.tandem.createTandem( 'light' )
    } );

    // @public
    this.ruler = new Ruler( {
      position: new Vector2( this.cuvette.position.x - 2.6, this.cuvette.position.y + 4 ),
      dragBounds: new Bounds2( 0, 0, 6, 5 ),
      tandem: options.tandem.createTandem( 'ruler' )
    } );

    // @public
    this.absorbanceModel = new AbsorbanceModel( this.light, this.solutionProperty, this.cuvette );

    // @public
    this.detector = new ATDetector( this.light, this.cuvette, this.absorbanceModel, {
      bodyPosition: new Vector2( this.cuvette.position.x + 3, this.cuvette.position.y - 0.3 ),
      probePosition: new Vector2( this.cuvette.position.x + 3, this.light.position.y ),
      probeDragBounds: new Bounds2( 0, 0, 7.9, 5.25 ),
      tandem: options.tandem.createTandem( 'detector' )
    } );

    // @public
    this.beam = new Beam( this.light, this.cuvette, this.detector, this.absorbanceModel, modelViewTransform );
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

beersLawLab.register( 'BeersLawModel', BeersLawModel );
export default BeersLawModel;