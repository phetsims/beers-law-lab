// Copyright 2002-2013, University of Colorado

define(
  [
    "PHETCOMMON/util/Inheritance",
    "common/model/Color",
    "concentration/model/Solute",
    "concentration/model/SoluteColorScheme",
    "i18n!../../../nls/beers-law-lab-strings"
  ],
  function ( Inheritance, Color, Solute, SoluteColorScheme, Strings ) {

    function DrinkMix() {

      Solute.call( this,
                   Strings.drinkMix,
                   Strings.drinkMix,
                   new SoluteColorScheme( 0, new Color( 224, 255, 255 ),
                                          0.05, new Color( 255, 225, 225 ),
                                          5.96, new Color( 255, 0, 0 ) ),
                   5, 200 );
    }

    Inheritance.inheritPrototype( DrinkMix, Solute );

    return DrinkMix;
  } );
