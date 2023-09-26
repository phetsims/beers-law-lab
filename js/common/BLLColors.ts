// Copyright 2023, University of Colorado Boulder

/**
 * Colors that are used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import beersLawLab from '../beersLawLab.js';
import { ProfileColorProperty } from '../../../scenery/js/imports.js';

const BLLColors = {

  screenBackgroundColorProperty: new ProfileColorProperty( beersLawLab, 'screenBackgroundColor', {
    default: 'white'
  } ),

  panelFillProperty: new ProfileColorProperty( beersLawLab, 'panelFill', {
    default: '#F0F0F0'
  } )
};

beersLawLab.register( 'BLLColors', BLLColors );
export default BLLColors;