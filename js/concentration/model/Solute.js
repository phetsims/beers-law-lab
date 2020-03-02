// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a solute, immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLab from '../../beersLawLab.js';
import Solvent from '../../common/model/Solvent.js';
import SoluteIO from './SoluteIO.js';

class Solute extends PhetioObject {

  /**
   * @param {string} name
   * @param {string} formula
   * @param {number} stockSolutionConcentration - mol/L
   * @param {number} molarMass - g/mol
   * @param {SoluteColorScheme} colorScheme
   * @param {Object} [options]
   */
  constructor( name, formula, stockSolutionConcentration, molarMass, colorScheme, options ) {

    options = merge( {
      particleColor: colorScheme.maxColor,
      particleSize: 5,
      particlesPerMole: 200,
      phetioType: SoluteIO,
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // @public - the name of the solute in tandem id format. Used to other make tandems that pertain to this solute.
    this.tandemName = options.tandem.name;

    // @public (read-only), (read-write, phet-io)
    this.name = name;
    this.formula = formula;

    // @public (read-only)
    this.stockSolutionConcentration = stockSolutionConcentration; // mol/L
    this.molarMass = molarMass; // g/mol
    this.colorScheme = colorScheme;
    this.particleColor = options.particleColor;
    this.particleSize = options.particleSize;
    this.particlesPerMole = options.particlesPerMole;

    // @public (read-only) percent concentration [0,100] of stock solution, see beers-law-lab#149
    this.stockSolutionPercentConcentration = 100 * ( molarMass * stockSolutionConcentration ) /
                                             ( Solvent.WATER.density + ( molarMass * stockSolutionConcentration ) );
    assert && assert( this.stockSolutionPercentConcentration >= 0 && this.stockSolutionPercentConcentration <= 100 );
  }

  // @public gets the saturated concentration, in mol/L
  getSaturatedConcentration() {
    return this.colorScheme.maxConcentration;
  }
}

beersLawLab.register( 'Solute', Solute );

export default Solute;