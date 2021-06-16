[object Promise]

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
import beersLawLabStrings from '../../beersLawLabStrings.js';

class ConcentrationTransform {

  /**
   * @param {number} scale scale factor used to convert model units (Moles, M) to view units
   * @param {string} units
   */
  constructor( scale, units ) {
    assert && assert( typeof scale === 'number' );
    assert && assert( typeof units === 'string' );

    // @public (read-only)
    this.scale = scale;
    this.units = units;
  }

  /**
   * Converts from model (M) to view (solution specific).
   * @param {number} modelConcentration
   * @returns {number}
   * @public
   */
  modelToView( modelConcentration ) {
    return modelConcentration * this.scale;
  }

  /**
   * Converts from view (solution specific) to model (M).
   * @param {number} viewConcentration
   * @returns {number}
   * @public
   */
  viewToModel( viewConcentration ) {
    return viewConcentration / this.scale;
  }
}

// specific transforms
ConcentrationTransform.mM = new ConcentrationTransform( 1000, beersLawLabStrings.units.mM );
ConcentrationTransform.uM = new ConcentrationTransform( 1000000, beersLawLabStrings.units.uM );

beersLawLab.register( 'ConcentrationTransform', ConcentrationTransform );
export default ConcentrationTransform;