// Copyright 2023-2025, University of Colorado Boulder

/**
 * Colors that are used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Color from '../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import beersLawLab from '../beersLawLab.js';

export default class BLLColors {

  private constructor() {
    // Not intended for instantiation.
  }

  public static readonly screenBackgroundColorProperty = new ProfileColorProperty( beersLawLab, 'screenBackgroundColor', {
    default: Color.WHITE
  } );

  public static readonly panelFillProperty = new ProfileColorProperty( beersLawLab, 'panelFill', {
    default: Color.grayColor( 240 )
  } );

  public static readonly concentrationMeterColorProperty = new ProfileColorProperty( beersLawLab, 'concentrationMeterColor', {
    default: 'rgb( 135, 4, 72 )'
  } );

  public static readonly atDetectorColorProperty = new ProfileColorProperty( beersLawLab, 'atDetectorColor', {
    default: 'rgb( 8, 133, 54 )'
  } );

  public static readonly cuvetteArrowFillProperty = new ProfileColorProperty( beersLawLab, 'cuvetteArrowFill', {
    default: Color.ORANGE
  } );

  public static readonly cuvetteArrowHighlightColorProperty = new ProfileColorProperty( beersLawLab, 'cuvetteArrowHighlightColor', {
    default: 'rgb( 255, 255, 0 )' // brighter version of cuvetteArrowFillProperty
  } );

  public static readonly removeSoluteButtonBaseColorProperty = new ProfileColorProperty( beersLawLab, 'removeSoluteButtonBaseColor', {
    default: 'rgb( 255, 200, 0 )'
  } );

  public static readonly comboBoxHighlightColorProperty = new ProfileColorProperty( beersLawLab, 'comboBoxHighlightColor', {
    default: 'rgb( 218, 255, 255 )'
  } );

  public static readonly WATER = new Color( 224, 255, 255 );

  // Solute colors can be found in Solute.ts - see SoluteOptions colorScheme (3 colors), particleFill, particleStroke

  // Solution colors can be found in BeersLawSolution.ts - see colorRange.
}

console.log( BLLColors.cuvetteArrowHighlightColorProperty.value.brighterColor() );

beersLawLab.register( 'BLLColors', BLLColors );