// Copyright 2023-2025, University of Colorado Boulder

/**
 * Colors that are used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import beersLawLab from '../beersLawLab.js';

export default class BLLColors {

  private constructor() {
    // Not intended for instantiation.
  }

  public static readonly screenBackgroundColorProperty = new ProfileColorProperty( beersLawLab, 'screenBackgroundColor', {
    default: 'white'
  } );

  public static readonly panelFillProperty = new ProfileColorProperty( beersLawLab, 'panelFill', {
    default: '#F0F0F0'
  } );

  public static readonly concentrationMeterColorProperty = new ProfileColorProperty( beersLawLab, 'concentrationMeterColor', {
    default: 'rgb( 135, 4, 72 )'
  } );

  public static readonly atDetectorColorProperty = new ProfileColorProperty( beersLawLab, 'atDetectorColor', {
    default: 'rgb( 8, 133, 54 )'
  } );
}

beersLawLab.register( 'BLLColors', BLLColors );