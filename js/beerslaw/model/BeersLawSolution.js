// Copyright 2013-2020, University of Colorado Boulder

/**
 * Solution model for the Beer's Law screen.
 * <p/>
 * The numeric values for specific solutions were arrived at by running lab experiments,
 * and are documented in doc/Beers-Law-Lab-design.pdf and doc/BeersLawLabData.xlsx.
 * <p/>
 * Note that this model does not use the Solute model from the Concentration screen, because
 * we have very different needs wrt color scheme, properties, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import beersLawLabStrings from '../../beersLawLabStrings.js';
import beersLawLab from '../../beersLawLab.js';
import Solvent from '../../common/model/Solvent.js';
import BeersLawSolutionIO from './BeersLawSolutionIO.js';

// strings
const pattern0Formula1NameString = beersLawLabStrings.pattern[ '0formula' ][ '1name' ];

class BeersLawSolution extends PhetioObject {

  /**
   * @param {string} internalName - used internally, not displayed to the user
   * @param {string} name - name that is visible to the user
   * @param {string} formula - formula that is visible to the user
   * @param {MolarAbsorptivityData} molarAbsorptivityData
   * @param {RangeWithValue} concentrationRange
   * @param {ConcentrationTransform} concentrationTransform
   * @param {ColorRange} colorRange
   * @param {Object} [options]
   */
  constructor( internalName, name, formula, molarAbsorptivityData, concentrationRange, concentrationTransform,
               colorRange, options ) {

    assert && assert( internalName.indexOf( ' ' ) === -1, 'internalName cannot contain spaces: ' + internalName );

    options = merge( {
      saturatedColor: colorRange.max, // {Color} color to use when the solution is saturated
      phetioType: BeersLawSolutionIO,
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // @public (read-only)
    this.solvent = Solvent.WATER;
    this.internalName = internalName;
    this.name = name;
    this.formula = formula;
    this.molarAbsorptivityData = molarAbsorptivityData;
    this.concentrationProperty = new NumberProperty( concentrationRange.defaultValue, {
      units: 'moles/liter',
      range: concentrationRange,
      tandem: options.tandem.createTandem( 'concentrationProperty' )
    } );
    this.concentrationRange = concentrationRange;
    this.concentrationTransform = concentrationTransform;
    this.colorRange = colorRange;
    this.saturatedColor = options.saturatedColor;

    // @public Solution color is derived from concentration
    this.fluidColorProperty = new DerivedProperty( [ this.concentrationProperty ],
      concentration => {
        let color = this.solvent.colorProperty.get();
        if ( concentration > 0 ) {
          const distance = Utils.linear( this.concentrationRange.min, this.concentrationRange.max, 0, 1, concentration );
          color = this.colorRange.interpolateLinear( distance );
        }
        return color;
      } );

    // @public - the name of the solution in tandem id format. Used to other make tandems that pertain to this solution.
    this.tandemName = options.tandem.name;
  }

  // @public
  reset() {
    this.concentrationProperty.reset();
  }

  // @public
  getDisplayName() {
    if ( this.formula === this.name ) {
      return this.name;
    }
    return StringUtils.format( pattern0Formula1NameString, this.formula, this.name );
  }
}

beersLawLab.register( 'BeersLawSolution', BeersLawSolution );

export default BeersLawSolution;