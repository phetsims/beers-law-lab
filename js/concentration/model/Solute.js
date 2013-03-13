// Copyright 2002-2013, University of Colorado

/**
 * Model of a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [],
  function () {
    "use strict";

    /**
     * Constructor.
     * @param {String} name
     * @param {String} formula
     * @param {SoluteColorScheme} colorScheme
     * @param {Number} stockSolutionConcentration
     * @param {Number} particleSize
     * @param {Number} particlesPerMole
     * @param {Color} particleColor (optional)
     * @constructor
     */
    function Solute( name, formula, colorScheme, stockSolutionConcentration, particleSize, particlesPerMole, particleColor ) {
      this.name = name;
      this.formula = formula;
      this.colorScheme = colorScheme;
      this.stockSolutionConcentration = stockSolutionConcentration;
      this.particleSize = particleSize;
      this.particlesPerMole = particlesPerMole;
      this.particleColor = particleColor || colorScheme.maxColor;
    }

    // convenience method
    Solute.prototype.getSaturatedConcentration = function () {
      return this.colorScheme.maxConcentration;
    };

    return Solute;
  } );
