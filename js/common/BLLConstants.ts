// Copyright 2014-2025, University of Colorado Boulder

/**
 * Constants that are global to this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import Range from '../../../dot/js/Range.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import beersLawLab from '../beersLawLab.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';
import VisibleColor from '../../../scenery-phet/js/VisibleColor.js';
import HotkeyData from '../../../scenery/js/input/HotkeyData.js';
import BeersLawLabStrings from '../BeersLawLabStrings.js';

export default class BLLConstants {

  private constructor() {
    // Not intended for instantiation.
  }

  // While these layoutBounds differ from the default, PhET-iO customizations may rely on these bounds.
  // So do not change. See https://github.com/phetsims/beers-law-lab/issues/289.
  public static readonly LAYOUT_BOUNDS = new Bounds2( 0, 0, 1100, 700 );

  // Credits are shared by beers-law-lab and concentration
  public static readonly CREDITS: CreditsData = {
    leadDesign: 'Julia Chamberlain',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
    team: 'Kelly Lancaster, Emily B. Moore, Ariel Paul, Kathy Perkins, Amy Rouinfar',
    qualityAssurance: 'Steele Dalton, Jaron Droder, Bryce Griebenow, Clifford Hardin, Emily Miller, Elise Morgan, ' +
                      'Liam Mulhall, Oliver Orejola, Benjamin Roberts, Nancy Salpepi, Kathryn Woessner, Bryan Yoelin',
    thanks: 'Conversion of this simulation to HTML5 was funded by the Royal Society of Chemistry.'
  };

  public static readonly BEAKER_VOLUME = 1; // L
  public static readonly RADIO_BUTTON_RADIUS = 11;
  public static readonly SOLUTION_LINE_WIDTH = 1;

  public static readonly SOLUTE_AMOUNT_RANGE = new RangeWithValue( 0, 7, 0 ); // moles
  public static readonly SOLUTION_VOLUME_RANGE = new RangeWithValue( 0, BLLConstants.BEAKER_VOLUME, 0.5 ); // L
  public static readonly CUVETTE_WIDTH_RANGE = new RangeWithValue( 0.5, 2.0, 1.0 ); // cm
  public static readonly CUVETTE_SNAP_INTERVAL_RANGE = new Range( 0, 0.5 ); // cm - Careful! This depends on CUVETTE_WIDTH_RANGE
  public static readonly WAVELENGTH_RANGE = new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH );

  // Decimal places for various quantities. These are used in the visual UI and in description strings.
  public static readonly DECIMAL_PLACES_CONCENTRATION_MOLES_PER_LITER = 3;
  public static readonly DECIMAL_PLACES_CONCENTRATION_PERCENT = 1;
  public static readonly DECIMAL_PLACES_CONCENTRATION_MOLAR = 0; // for mM and uM
  public static readonly DECIMAL_PLACES_ABSORBANCE = 2;
  public static readonly DECIMAL_PLACES_TRANSMITTANCE = 2;
  public static readonly DECIMAL_PLACES_WAVELENGTH = 0;
  public static readonly DECIMAL_PLACES_SOLUTE_AMOUNT = 0;
  public static readonly DECIMAL_PLACES_LITERS_PER_SECOND = 3;
  public static readonly DECIMAL_PLACES_MILLILITERS_PER_SECOND = 0;
  public static readonly DECIMAL_PLACES_EVAPORATION_RATE_LITERS_PER_SECOND = 3;
  public static readonly DECIMAL_PLACES_EVAPORATION_RATE_MILLILITERS_PER_SECOND = 0;
  public static readonly DECIMAL_PLACES_CUVETTE_WIDTH = 2;

  // Keyboard shortcut used for probes and ruler.
  public static readonly JUMP_TO_POSITION_HOTKEY_DATA = new HotkeyData( {
    keys: [ 'j' ],
    repoName: beersLawLab.name,
    keyboardHelpDialogLabelStringProperty: BeersLawLabStrings.keyboardHelpDialog.jumpToPositionStringProperty
  } );
}

beersLawLab.register( 'BLLConstants', BLLConstants );