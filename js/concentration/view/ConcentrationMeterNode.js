// Copyright 2013-2019, University of Colorado Boulder

/**
 * Concentration meter, with probe.
 * The probe registers the concentration of all possible fluids that it may contact, including:
 *
 * - solution in the beaker
 * - output of the solvent faucet
 * - output of the drain faucet
 * - output of the dropper
 *
 * Rather than trying to model the shapes of all of these fluids, we handle 'probe is in fluid'
 * herein via intersection of node shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  const BLLQueryParameters = require( 'BEERS_LAW_LAB/common/BLLQueryParameters' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ProbeNode = require( 'SCENERY_PHET/ProbeNode' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const concentrationString = require( 'string!BEERS_LAW_LAB/concentration' );
  const pattern0PercentString = require( 'string!BEERS_LAW_LAB/pattern.0percent' );
  const pattern0Value1UnitsString = require( 'string!BEERS_LAW_LAB/pattern.0value.1units' );
  const unitsMolesPerLiterString = require( 'string!BEERS_LAW_LAB/units.molesPerLiter' );

  // constants
  const BODY_IS_DRAGGABLE = true;
  const DECIMAL_PLACES_MOLES_PER_LITER = 3;
  const DECIMAL_PLACES_PERCENT = 1;
  const READOUT_NO_VALUE = MathSymbols.NO_VALUE; // displayed in the readout when the meter is not measuring anything
  const BODY_X_MARGIN = 15;
  const BODY_Y_MARGIN = 15;
  const READOUT_X_MARGIN = 15;
  const READOUT_Y_MARGIN = 4;
  const PROBE_COLOR = 'rgb( 135, 4, 72 )';
  const DISPLAY_MOLES_PER_LITER = ( BLLQueryParameters.concentrationMeterUnits === 'molesPerLiter' );
  const MIN_VALUE_SIZE = new Dimension2( 140, 35 );
  const MIN_BODY_SIZE = new Dimension2( 170, 100 );

  /**
   * @param {ConcentrationMeter} meter
   * @param {ConcentrationSolution} solution
   * @param {Dropper} dropper
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function ConcentrationMeterNode( meter, solution, dropper, solutionNode, stockSolutionNode, solventFluidNode,
                                   drainFluidNode, modelViewTransform, tandem ) {

    const self = this;
    Node.call( this, { tandem: tandem } );

    const bodyNode = new BodyNode( meter, modelViewTransform, tandem.createTandem( 'bodyNode' ) );
    const probeNode = new ConcentrationProbeNode( meter.probe, modelViewTransform, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, tandem.createTandem( 'probeNode' ) );
    const wireNode = new WireNode( meter.body, meter.probe, bodyNode, probeNode );

    // rendering order
    self.addChild( wireNode );
    self.addChild( bodyNode );
    self.addChild( probeNode );

    const updateValue = function() {
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        meter.valueProperty.set( DISPLAY_MOLES_PER_LITER ?
                                 solution.concentrationProperty.get() :
                                 solution.percentConcentrationProperty.get() );
      }
      else if ( probeNode.isInSolvent() ) {
        meter.valueProperty.set( 0 );
      }
      else if ( probeNode.isInStockSolution() ) {
        meter.valueProperty.set( DISPLAY_MOLES_PER_LITER ?
                                 dropper.soluteProperty.get().stockSolutionConcentration :
                                 dropper.soluteProperty.get().stockSolutionPercentConcentration );
      }
      else {
        meter.valueProperty.set( null );
      }
    };

    meter.probe.locationProperty.link( updateValue );
    solution.soluteProperty.link( updateValue );
    if ( DISPLAY_MOLES_PER_LITER ) {
      solution.concentrationProperty.link( updateValue );
    }
    else {
      solution.percentConcentrationProperty.link( updateValue );
    }
    solutionNode.on( 'bounds', updateValue );
    stockSolutionNode.on( 'bounds', updateValue );
    solventFluidNode.on( 'bounds', updateValue );
    drainFluidNode.on( 'bounds', updateValue );
  }

  beersLawLab.register( 'ConcentrationMeterNode', ConcentrationMeterNode );

  /**
   * Meter body, origin at upper left.
   * Note that while the body is a Movable, we have currently decided not to allow it to be moved,
   * so it has no drag handler
   * @param {ConcentrationMeter} meter
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function BodyNode( meter, modelViewTransform, tandem ) {

    const self = this;

    Node.call( this, {
      tandem: tandem,
      cursor: 'pointer'
    } );

    const maxTextWidth = 225; // constrain text width for i18n, determined empirically

    // title
    const titleNode = new Text( concentrationString,
      { font: new PhetFont( 18 ), fill: 'white', maxWidth: maxTextWidth } );

    // readout for the value + units
    const formattedText = StringUtils.format(
      pattern0Value1UnitsString,
      Utils.toFixed( 1, DECIMAL_PLACES_MOLES_PER_LITER ),
      unitsMolesPerLiterString
    );
    const readoutTextNode = new Text( formattedText, {
      font: new PhetFont( 24 ),
      fill: 'black',
      maxWidth: maxTextWidth,
      tandem: tandem.createTandem( 'readoutTextNode' )
    } );
    const readoutWidth = Math.max( MIN_VALUE_SIZE.width, Math.max( titleNode.width, readoutTextNode.width ) + ( 2 * READOUT_X_MARGIN ) );
    const readoutHeight = Math.max( MIN_VALUE_SIZE.height, readoutTextNode.height + ( 2 * READOUT_Y_MARGIN ) );
    const readoutBackgroundNode = new ShadedRectangle( new Bounds2( 0, 0, readoutWidth, readoutHeight ), {
      baseColor: 'white',
      lightSource: 'rightBottom'
    } );
    readoutTextNode.right = readoutBackgroundNode.right - READOUT_X_MARGIN;
    readoutTextNode.centerY = readoutBackgroundNode.centerY;

    // vertical arrangement of stuff in the meter
    const vBox = new LayoutBox( {
      children: [ titleNode, new Node( { children: [ readoutBackgroundNode, readoutTextNode ] } ) ],
      orientation: 'vertical',
      align: 'center',
      spacing: 18
    } );

    // meter body
    const bodyWidth = Math.max( MIN_BODY_SIZE.width, vBox.width + ( 2 * BODY_X_MARGIN ) );
    const bodyHeight = Math.max( MIN_BODY_SIZE.height, vBox.height + ( 2 * BODY_Y_MARGIN ) );
    const bodyNode = new ShadedRectangle( new Bounds2( 0, 0, bodyWidth, bodyHeight ), {
      baseColor: PROBE_COLOR,
      lightOffset: 0.95
    } );

    this.addChild( bodyNode );
    this.addChild( vBox );
    vBox.center = bodyNode.center;

    if ( BODY_IS_DRAGGABLE ) {
      const movableDragHandler = new MovableDragHandler( meter.body.locationProperty, {
        tandem: tandem.createTandem( 'movableDragHandler' ),
        dragBounds: meter.body.dragBounds,
        modelViewTransform: modelViewTransform
      } );
      this.addInputListener( movableDragHandler );
    }

    // body location
    meter.body.locationProperty.link( function( location ) {
      self.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // when the value changes, update the readout
    meter.valueProperty.link( function( value ) {

      if ( value === null ) {
        readoutTextNode.setText( READOUT_NO_VALUE );
        readoutTextNode.centerX = readoutBackgroundNode.centerX; // center justified
      }
      else {

        // display concentration as 'mol/L' or '%', see beers-law-lab#149
        let readoutText = null;
        if ( DISPLAY_MOLES_PER_LITER ) {
          readoutText = StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( value, DECIMAL_PLACES_MOLES_PER_LITER ), unitsMolesPerLiterString );
        }
        else {
          readoutText = StringUtils.format( pattern0PercentString, Utils.toFixed( value, DECIMAL_PLACES_PERCENT ) );
        }
        readoutTextNode.setText( readoutText );
        readoutTextNode.right = readoutBackgroundNode.right - READOUT_X_MARGIN; // right justified
      }
      readoutTextNode.centerY = readoutBackgroundNode.centerY;
    } );
  }

  inherit( Node, BodyNode );

  /**
   * Meter probe, origin at center of crosshairs.
   * @param {Movable} probe
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Node} solutionNode
   * @param {Node} stockSolutionNode
   * @param {Node} solventFluidNode
   * @param {Node} drainFluidNode
   * @param {Tandem} tandem
   * @constructor
   */
  function ConcentrationProbeNode( probe, modelViewTransform, solutionNode, stockSolutionNode, solventFluidNode, drainFluidNode, tandem ) {

    const self = this;

    ProbeNode.call( this, {
      sensorTypeFunction: ProbeNode.crosshairs( {
        intersectionRadius: 6
      } ),
      radius: 34,
      innerRadius: 26,
      handleWidth: 30,
      handleHeight: 25,
      handleCornerRadius: 12,
      lightAngle: 1.75 * Math.PI,
      color: PROBE_COLOR,
      rotation: -Math.PI / 2,
      cursor: 'pointer',
      tandem: tandem
    } );

    // probe location
    probe.locationProperty.link( function( location ) {
      self.translation = modelViewTransform.modelToViewPosition( location );
    } );

    // touch area
    this.touchArea = this.localBounds.dilatedXY( 0.25 * this.width, 0.25 * this.height );

    // drag handler
    const movableDragHandler = new MovableDragHandler( probe.locationProperty, {
      tandem: tandem.createTandem( 'movableDragHandler' ),
      dragBounds: probe.dragBounds,
      modelViewTransform: modelViewTransform
    } );
    this.addInputListener( movableDragHandler );

    const isInNode = function( node ) {
      const localPoint = node.parentToLocalPoint( probe.locationProperty.get() );
      const nodeShape = node.getShape();
      const shapeBounds = nodeShape.bounds;
      return shapeBounds.getWidth() > 0 && shapeBounds.getHeight() > 0 && nodeShape.containsPoint( localPoint ); // see issue #65
    };

    this.isInSolution = function() {
      return isInNode( solutionNode );
    };

    this.isInSolvent = function() {
      return isInNode( solventFluidNode );
    };

    this.isInDrainFluid = function() {
      return isInNode( drainFluidNode );
    };

    this.isInStockSolution = function() {
      return isInNode( stockSolutionNode );
    };
  }

  inherit( Node, ConcentrationProbeNode );

  /**
   * Wire that connects the body and probe.
   * @param {Movable} body
   * @param {Movable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   * @constructor
   */
  function WireNode( body, probe, bodyNode, probeNode ) {

    const self = this;

    Path.call( this, new Shape(), {
      stroke: 'gray',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false // no need to drag the wire, and we don't want to do cubic-curve intersection here, or have it get in the way
    } );

    const updateCurve = function() {

      // Connect bottom-center of body to right-center of probe.
      const bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom - 10 );
      const probeConnectionPoint = new Vector2( probeNode.right, probeNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      const c1Offset = new Vector2( 0, Utils.linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      const c2Offset = new Vector2( 50, 0 );
      const c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      const c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      self.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    body.locationProperty.link( updateCurve );
    probe.locationProperty.link( updateCurve );
  }

  inherit( Path, WireNode );

  return inherit( Node, ConcentrationMeterNode );
} );