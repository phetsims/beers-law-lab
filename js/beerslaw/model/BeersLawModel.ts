// Copyright 2013-2023, University of Colorado Boulder

/**
 * BeersLawModel is the top-level model for the 'Beer's Law' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import SolutionInCuvette from './SolutionInCuvette.js';
import ATDetector from './ATDetector.js';
import Beam from './Beam.js';
import BeersLawSolution from './BeersLawSolution.js';
import Cuvette from './Cuvette.js';
import Light from './Light.js';
import Ruler from './Ruler.js';

export default class BeersLawModel implements TModel {

  public readonly solutions: BeersLawSolution[];
  public readonly solutionProperty: Property<BeersLawSolution>;

  // NOTE: All positions are relative to the position of the cuvette.
  public readonly cuvette: Cuvette;

  public readonly light: Light;
  public readonly ruler: Ruler;
  public readonly solutionInCuvette: SolutionInCuvette;
  public readonly detector: ATDetector;
  public readonly beam: Beam;

  public constructor( modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    // in rainbow (ROYGBIV) order.
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

    this.solutionProperty = new Property( this.solutions[ 0 ], {
      validValues: this.solutions,
      tandem: tandem.createTandem( 'solutionProperty' ),
      phetioValueType: BeersLawSolution.BeersLawSolutionIO,
      phetioDocumentation: 'The selected solution, which appears in the cuvette'
    } );

    this.cuvette = new Cuvette( {
      position: new Vector2( 3.3, 0.5 ),
      tandem: tandem.createTandem( 'cuvette' )
    } );

    this.light = new Light( this.solutionProperty, {
      position: new Vector2( this.cuvette.position.x - 1.5, this.cuvette.position.y + ( this.cuvette.height / 2 ) ),
      tandem: tandem.createTandem( 'light' )
    } );

    this.ruler = new Ruler( {
      position: new Vector2( this.cuvette.position.x - 2.6, this.cuvette.position.y + 4 ),
      dragBounds: new Bounds2( 0, 0, 6, 5 ),
      tandem: tandem.createTandem( 'ruler' )
    } );

    this.solutionInCuvette = new SolutionInCuvette( this.solutions, this.solutionProperty,
      this.cuvette.widthProperty, this.light.wavelengthProperty, tandem.createTandem( 'solutionInCuvette' ) );

    this.detector = new ATDetector( this.light, this.cuvette, this.solutionInCuvette, {
      bodyPosition: new Vector2( this.cuvette.position.x + 3, this.cuvette.position.y - 0.3 ),
      probePosition: new Vector2( this.cuvette.position.x + 3, this.light.position.y ),
      probeDragBounds: new Bounds2( 0, 0, 7.9, 5.25 ),
      tandem: tandem.createTandem( 'detector' )
    } );

    this.beam = new Beam( this.light, this.cuvette, this.detector, this.solutionInCuvette, modelViewTransform );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
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