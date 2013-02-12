// Copyright 2002-2013, University of Colorado

/**
 *  A solvent (in this case a liquid) that dissolves another liquid (the solute) to create a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [],
  function () {

    /**
     * Constructor.
     * @param {String} name
     * @param {String} formula
     * @param {Color} color
     * @constructor
     */
    function Solvent( name, formula, color ) {
      this.name = name;
      this.formula = formula;
      this.color = color;
    }

    return Solvent;
  } );
