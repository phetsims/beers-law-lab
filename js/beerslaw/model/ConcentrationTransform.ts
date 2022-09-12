// Copyright 2013-2022, University of Colorado Boulder

/**
 * ConcentrationTransform manages the transformation between how concentration values are stored in
 * the model, and how they are presented in the view.
 *
 * In the model, concentration is stored in moles per liter (M) for all solutions.
 * In the view, the concentration units will vary by solution, such that the
 * concentration can be displayed as integral values (no decimals, no scientific notation.)
 * This class specifies the units to be used for displaying the concentration in
 * the view (eg, M, mM, uM) and handles the conversion between model and view units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import beersLawLab from '../../beersLawLab.js';
import BeersLawLabStrings from '../../BeersLawLabStrings.js';

export default class ConcentrationTransform {

  // specific transforms
  //TODO https://github.com/phetsims/phet-io/issues/1878 dynamic locale
  public static readonly mM = new ConcentrationTransform( 1000, BeersLawLabStrings.units.mM );
  public static readonly uM = new ConcentrationTransform( 1000000, BeersLawLabStrings.units.uM );

  /**
   * @param scale scale factor used to convert model units (Moles, M) to view units
   * @param units
   */
  public constructor( public readonly scale: number, public readonly units: string ) {}

  /**
   * Converts from model (M) to view (solution specific).
   */
  public modelToView( modelConcentration: number ): number {
    return modelConcentration * this.scale;
  }

  /**
   * Converts from view (solution specific) to model (M).
   */
  public viewToModel( viewConcentration: number ): number {
    return viewConcentration / this.scale;
  }
}

beersLawLab.register( 'ConcentrationTransform', ConcentrationTransform );