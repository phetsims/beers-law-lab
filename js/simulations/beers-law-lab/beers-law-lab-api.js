// Copyright 2016, University of Colorado Boulder

/**
 * This is the public API for the beers-law-lab sim, which is also reused for concentration (a derived-sim).  It can be
 * used in concert with phetio.js and phetioEvents.js for interoperable features.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var PhETIOCommon = require( 'PHET_IO/PhETIOCommon' );
  var phetio = require( 'PHET_IO/phetio' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TArray = require( 'PHET_IO/types/TArray' );
  var TBoolean = require( 'PHET_IO/types/TBoolean' );
  var TButton = require( 'PHET_IO/types/sun/buttons/TButton' );
  var TColor = require( 'PHET_IO/types/scenery/util/TColor' );
  var TComboBox = require( 'PHET_IO/types/sun/TComboBox' );
  var TDerivedProperty = require( 'PHET_IO/types/axon/TDerivedProperty' );
  var TFaucet = require( 'PHET_IO/types/scenery-phet/TFaucet' );
  var TGroup = require( 'PHET_IO/types/TGroup' );
  var THSlider = require( 'PHET_IO/types/sun/THSlider' );
  var TMomentaryButton = require( 'PHET_IO/types/sun/buttons/TMomentaryButton' );
  var TNode = require( 'PHET_IO/types/scenery/nodes/TNode' );
  var TNumber = require( 'PHET_IO/types/TNumber' );
  var TObject = require( 'PHET_IO/types/TObject' );
  var TPanel = require( 'PHET_IO/types/sun/TPanel' );
  var TPrecipitateParticle = require( 'PHET_IO/simulations/beers-law-lab/types/TPrecipitateParticle' );
  var TProperty = require( 'PHET_IO/types/axon/TProperty' );
  var TRadioButton = require( 'PHET_IO/types/sun/buttons/TRadioButton' );
  var TResetAllButton = require( 'PHET_IO/types/sun/buttons/TResetAllButton' );
  var TShaker = require( 'PHET_IO/simulations/beers-law-lab/types/TShaker' );
  var TShakerParticle = require( 'PHET_IO/simulations/beers-law-lab/types/TShakerParticle' );
  var TSolute = require( 'PHET_IO/simulations/beers-law-lab/types/TSolute' );
  var TSolution = require( 'PHET_IO/simulations/beers-law-lab/types/TSolution' );
  var TString = require( 'PHET_IO/types/TString' );
  var TTandemDragHandler = require( 'PHET_IO/types/tandem/scenery/input/TTandemDragHandler' );
  var TTandemText = require( 'PHET_IO/types/tandem/scenery/nodes/TTandemText' );
  var TToggleButton = require( 'PHET_IO/types/sun/buttons/TToggleButton' );
  var TVector2 = require( 'PHET_IO/types/dot/TVector2' );
  var TVoid = require( 'PHET_IO/types/TVoid' );
  var TWavelengthSlider = require( 'PHET_IO/types/scenery-phet/TWavelengthSlider' );

  var TShakerParticles = phetioInherit( TObject, 'TShakerParticles', function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.ShakerParticles );
  }, {
    setValue: {
      implementation: function() {
        this.instance.removeAllParticles();
      }
    }
  }, {
    toStateObject: function( instance ) {

      // TODO: Just returning a string from here doesn't work.... why?
      return { phetioID: instance.phetioID };
    },
    fromStateObject: function( stateObject ) {
      return phetio.getInstance( stateObject.phetioID );
    }
  } );

  var TPrecipitate = phetioInherit( TObject, 'TPrecipitate', function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.Precipitate );
  }, {
    setValue: {
      implementation: function() {
        this.instance.removeAllParticles();
      }
    }
  }, {
    toStateObject: function( instance ) {

      // TODO: Just returning a string from here doesn't work.... why?
      return { phetioID: instance.phetioID };
    },
    fromStateObject: function( stateObject ) {
      return phetio.getInstance( stateObject.phetioID );
    }
  } );

  var TConcentrationModel = phetioInherit( TObject, 'TConcentrationModel', function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.ConcentrationModel );
  }, {

    // For instance:
    // http://localhost/concentration/concentration_en.html?ea&brand=phet-io&phet-io.standalone&phet-io.log=lines&phet-io.expressions=[["concentration.concentrationScreen.model","setSolutes",[["concentration.solutes.cobaltIINitrate","concentration.solutes.cobaltChloride","concentration.solutes.drinkMix"]]]]
    setSolutes: {
      parameterTypes: [ TArray( TSolute ) ],
      returnType: TVoid,
      implementation: function( solutes ) {
        this.instance.setSolutes( solutes );
      }
    }
  }, {} );

  var beersLawLabAPI = PhETIOCommon.createAPI( {

    beersLawLab: PhETIOCommon.createSim( {
      solutes: {

        // Available Solutes
        drinkMix: TSolute,
        cobaltIINitrate: TSolute,
        cobaltChloride: TSolute,
        potassiumDichromate: TSolute,
        potassiumChromate: TSolute,
        nickelIIChloride: TSolute,
        copperSulfate: TSolute,
        potassiumPermanganate: TSolute,
        sodiumChloride: TSolute
      },

      solutions: {
        drinkMix: TSolution,
        cobaltIINitrate: TSolution,
        cobaltChloride: TSolution,
        potassiumDichromate: TSolution,
        potassiumChromate: TSolution,
        nickelIIChloride: TSolution,
        copperSulfate: TSolution,
        potassiumPermanganate: TSolution
      },

      concentrationScreen: {
        model: TConcentrationModel.extend( {
          soluteFormProperty: TProperty( TString, { values: [ 'liquid', 'solid' ] } ),

          soluteProperty: TProperty( TSolute ),

          solution: {
            soluteAmountProperty: TProperty( TNumber( 'moles' ) ),
            soluteGramsProperty: TDerivedProperty( TNumber( 'grams' ) ),
            volumeProperty: TProperty( TNumber( 'liters' ), { min: 0, max: 1 } ),
            concentrationProperty: TDerivedProperty( TNumber( 'moles/liter' ) ),
            percentConcentrationProperty: TDerivedProperty( TNumber( 'percent' ) ),
            precipitateAmountProperty: TDerivedProperty( TNumber( 'moles' ) ),
            saturatedProperty: TDerivedProperty( TBoolean )
          },

          shaker: TShaker.extend( {
            locationProperty: TProperty( TVector2 ),
            labelOverrideProperty: TProperty( TString ),
            previousLocationProperty: TProperty( TVector2 )
          } ),

          shakerParticles: TShakerParticles.extend( {
            shakerParticle: TGroup( TShakerParticle )
          } ),

          dropper: {
            flowRateProperty: TProperty( TNumber( 'liters/second' ) ),
            locationProperty: TProperty( TVector2 ),
            dispensingProperty: TProperty( TBoolean ),
            emptyProperty: TProperty( TBoolean )
          },

          evaporator: {
            evaporationRateProperty: TProperty( TNumber( 'liters/second' ) ),
            enabledProperty: TProperty( TBoolean )
          },

          solventFaucet: {
            flowRateProperty: TProperty( TNumber( 'liters/second' ) )
          },

          drainFaucet: {
            flowRateProperty: TProperty( TNumber( 'liters/second' ) )
          },

          concentrationMeter: {
            valueProperty: TProperty( TNumber( 'moles/liter' ) ),
            probe: {
              locationProperty: TProperty( TVector2 )
            },
            body: {
              locationProperty: TProperty( TVector2 )
            }
          },

          precipitate: TPrecipitate.extend( {
            precipitateParticle: TGroup( TPrecipitateParticle )
          } )
        } ),
        view: {
          resetAllButton: TResetAllButton,

          removeSoluteButton: TButton,

          shakerNode: TNode.extend( {
            inputListener: TTandemDragHandler
          } ),

          dropperNode: TNode.extend( {
            button: TMomentaryButton,
            movableDragHandler: TTandemDragHandler
          } ),

          solventFaucetNode: TFaucet,

          drainFaucetNode: TFaucet,
          beakerNode: TNode.extend( {
            tickLabel0: TTandemText,
            tickLabel1: TTandemText
          } ),

          concentrationMeterNode: TNode.extend( {
            bodyNode: TNode.extend( {

              // The readout on the concentration meter, indicating the text on the screen.
              // This includes the value (limited to some number of decimal places) and the units.
              // The value and units displayed depend on the concentrationMeterUnits query parameter,
              // and may be mol/L (the default) or percent concentration. The units and order of
              // value and units are subject to i18n, so parsing this string is not advised.
              readoutTextNode: TTandemText,
              movableDragHandler: TTandemDragHandler
            } ),
            probeNode: TNode.extend( {
              movableDragHandler: TTandemDragHandler
            } )
          } ),

          soluteControls: TPanel.extend( {
            // TSolute Combo Box
            soluteComboBox: TComboBox( TSolute ).extend( {
              listVisibleProperty: TProperty( TBoolean )
            } ),
            soluteFormNode: {
              solidRadioButton: TRadioButton( TString ),
              solutionRadioButton: TRadioButton( TString )
            }
          } ),

          evaporationControl: TPanel.extend( {
            slider: THSlider
          } )
        },
        solutionColorProperty: TProperty( TColor )
      },

      beersLawScreen: {
        model: {

          solutionProperty: TProperty( TSolution ),

          cuvette: {
            widthProperty: TProperty( TNumber( 'centimeters', { min: 0.5, max: 2 } ) ) // goes from 0.5 to 2 cm
          },

          light: {
            onProperty: TProperty( TBoolean ),
            wavelengthProperty: TProperty( TNumber( 'meters' ) )
          },

          ruler: {
            locationProperty: TProperty( TVector2 )
          },

          detector: {
            modeProperty: TProperty( TString ), // 'transmittance'|'absorbance'
            valueProperty: TDerivedProperty( TNumber( 'percent' ) ),
            body: {
              locationProperty: TProperty( TVector2 )
            },
            probe: {
              locationProperty: TProperty( TVector2 )
            }
          }
        },
        view: {
          resetAllButton: TResetAllButton,

          lightNode: TNode.extend( {
            button: TToggleButton( TBoolean )
          } ),

          detectorNode: {
            bodyNode: TNode.extend( {
              valueNode: TTandemText,
              transmittanceRadioButton: TRadioButton( TString ),
              absorbanceRadioButton: TRadioButton( TString )
            } ),
            probeNode: TNode.extend( {
              movableDragHandler: TTandemDragHandler
            } )
          },

          wavelengthControls: {
            variableWavelengthProperty: TProperty( TBoolean ),
            presetWavelengthRadioButton: TRadioButton( TBoolean ),
            variableWavelengthRadioButton: TRadioButton( TBoolean ),
            wavelengthSlider: TWavelengthSlider.extend( {
              plusButton: TButton,
              minusButton: TButton
            } )
          },

          cuvetteNode: TNode.extend( {
            cuvetteDragHandler: TTandemDragHandler
          } ),

          rulerNode: TNode.extend( {
            movableDragHandler: TTandemDragHandler
          } ),

          solutionControls: {
            track: {
              inputListener: TTandemDragHandler
            },

            // TSolute Combo Box
            comboBox: TComboBox( TSolute ).extend( {
              listVisibleProperty: TProperty( TBoolean )
            } ),

            concentrationControl: {
              slider: TNode.extend( {
                thumb: TNode.extend( {
                  dragHandler: TTandemDragHandler
                } ),
                track: {
                  inputListener: TTandemDragHandler
                },
                plusButton: TButton,
                minusButton: TButton
              } )
            }
          }
        }
      }
    } )
  } );
  phetioNamespace.register( 'beers-law-lab-api', beersLawLabAPI );

  // Set the phetio.api after it was declared
  phetio.api = beersLawLabAPI;

  // Register phetio as a tandem instance after API assigned
  new Tandem( 'phetio' ).addInstance( phetio );

  return beersLawLabAPI;
} );

