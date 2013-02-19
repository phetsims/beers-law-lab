// Copyright 2002-2013, University of Colorado

/**
 *  A solvent (in this case a liquid) that dissolves another liquid (the solute) to create a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "PHETCOMMON/model/Inheritance",
    "common/Symbols",
    "common/model/Color",
    "common/model/Fluid",
    "i18n!../../../nls/beers-law-lab-strings"
  ],
  function ( Inheritance, Symbols, Color, Fluid, Strings ) {

    /**
     * Constructor.
     * @param {String} name
     * @param {String} formula
     * @param {Color} color
     * @constructor
     */
    function Solvent( name, formula, color ) {

      Fluid.call( this, color ); // constructor stealing

      this.name = name;
      this.formula = formula;
    }

    Inheritance.inheritPrototype( Solvent, Fluid ); // prototype chaining

    Solvent.WATER = new Solvent( Strings.water, Symbols.WATER, new Color( 224, 255, 255 ) );

    return Solvent;
  } );
