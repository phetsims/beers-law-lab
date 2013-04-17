// Copyright 2002-2013, University of Colorado

/**
 * Model of a simple light.
 * Origin is at the center of the lens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var Property = require( "PHETCOMMON/model/property/Property" );

  /**
   * @param location cm
   * @param on
   * @param lensDiameter cm
   * @param solution Property, of type BeersLawSolution
   * @constructor
   */
  function Light( location, on, lensDiameter, solution ) {

    var thisLight = this;

    thisLight.location = location;
    thisLight.on = new Property( on );
    thisLight.wavelength = new Property( solution.get().molarAbsorptivityData.lambdaMax ); // nm
    thisLight.lensDiameter = lensDiameter;

    // when the solution changes, set the light to the solution's lambdaMax wavelength
    solution.addObserver( function ( solution ) {
      thisLight.wavelength.set( solution.molarAbsorptivityData.lambdaMax );
    } );
  }

  Light.prototype.getMinY = function () {
    return this.location.getY() - ( this.lensDiameter / 2 );
  };

  Light.prototype.getMaxY = function () {
    return this.location.getY() + ( this.lensDiameter / 2 );
  };

  Light.prototype.reset = function () {
    this.on.reset();
  };

  return Light;
} );