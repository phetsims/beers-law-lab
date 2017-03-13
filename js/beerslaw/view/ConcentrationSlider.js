// Copyright 2013-2015, University of Colorado Boulder

/**
 * Slider for changing a solution's concentration.
 * <p>
 * Note that this slider has some things in common with HSlider, but also subtle differences.
 * So it's probably more trouble than it's worth to factor out a base class.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SUN/buttons/ArrowButton' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var FillHighlightListener = require( 'SCENERY_PHET/input/FillHighlightListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var TandemSimpleDragHandler = require( 'TANDEM/scenery/input/TandemSimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var TNode = require( 'SCENERY/nodes/TNode' );

  // track constants
  var TRACK_SIZE = new Dimension2( 200, 15 );

  // thumb constants
  var THUMB_SIZE = new Dimension2( 22, 45 );
  var THUMB_LINE_WIDTH = 1;
  var THUMB_FILL_NORMAL = new Color( 89, 156, 212 );
  var THUMB_FILL_HIGHLIGHT = THUMB_FILL_NORMAL.brighterColor();
  var THUMB_STROKE = Color.BLACK;
  var THUMB_CENTER_LINE_STROKE = Color.WHITE;

  // tick constants
  var TICK_LENGTH = 16;
  var TICK_FONT = new PhetFont( 16 );
  var TICK_DECIMAL_PLACES = 0;

  /**
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function ConcentrationSlider( solutionProperty, tandem ) {

    Node.call( this );

    // nodes
    // @private (phet-io)
    this.track = new Track( TRACK_SIZE, solutionProperty, tandem.createTandem( 'track' ) );

    // @private (phet-io)
    this.thumb = new Thumb( THUMB_SIZE, TRACK_SIZE, solutionProperty, tandem.createTandem( 'thumb' ) );
    var minTickLine = new TickLine();
    var maxTickLine = new TickLine();
    var minTickLabel = new TickLabel( 0 ); // correct value will be set when observer is registered
    var maxTickLabel = new TickLabel( 0 ); // correct value will be set when observer is registered

    // buttons for single-unit increments
    var plusButton = new ArrowButton( 'right', function() {
      var solution = solutionProperty.get();
      var delta = solution.concentrationTransform.viewToModel( 1 );
      solution.concentrationProperty.set( Math.min( solution.concentrationProperty.get() + delta, solution.concentrationRange.max ) );
    }, {
      tandem: tandem.createTandem( 'plusButton' )
    } );
    var minusButton = new ArrowButton( 'left', function() {
      var solution = solutionProperty.get();
      var delta = solution.concentrationTransform.viewToModel( 1 );
      solution.concentrationProperty.set( Math.max( solution.concentrationProperty.get() - delta, solution.concentrationRange.min ) );
    }, {
      tandem: tandem.createTandem( 'minusButton' )
    } );

    // rendering order
    this.addChild( minTickLine );
    this.addChild( maxTickLine );
    this.addChild( minTickLabel );
    this.addChild( maxTickLabel );
    this.addChild( this.track );
    this.addChild( this.thumb );
    this.addChild( plusButton );
    this.addChild( minusButton );

    // layout
    minTickLine.left = this.track.left;
    minTickLine.bottom = this.track.top;
    minTickLabel.bottom = minTickLine.top - 2;
    maxTickLine.right = this.track.right;
    maxTickLine.bottom = this.track.top;
    maxTickLabel.bottom = maxTickLine.top - 2;
    this.thumb.centerY = this.track.centerY;
    minusButton.right = this.track.left - ( this.thumb.width / 2 ) - 2;
    minusButton.bottom = this.track.bottom;
    plusButton.left = this.track.right + ( this.thumb.width / 2 ) + 2;
    plusButton.bottom = this.track.bottom;

    var concentrationObserver = function( concentration ) {
      // buttons
      plusButton.enabled = ( concentration < solutionProperty.get().concentrationRange.max );
      minusButton.enabled = ( concentration > solutionProperty.get().concentrationRange.min );
    };

    // update the tick labels to match the solution
    solutionProperty.link( function( solution, oldSolution ) {
      var concentrationRange = solution.concentrationRange;
      var transform = solution.concentrationTransform;
      // update label values
      minTickLabel.setValue( transform.modelToView( concentrationRange.min ) );
      maxTickLabel.setValue( transform.modelToView( concentrationRange.max ) );
      // center values below tick lines
      minTickLabel.centerX = minTickLine.centerX;
      maxTickLabel.centerX = maxTickLine.centerX;
      // re-wire observer
      if ( oldSolution ) {
        oldSolution.concentrationProperty.unlink( concentrationObserver );
      }
      solution.concentrationProperty.link( concentrationObserver );
    } );

    tandem.addInstance( this, TNode );
  }

  beersLawLab.register( 'ConcentrationSlider', ConcentrationSlider );

  /**
   * Track that the thumb moves in.
   * Filled with a gradient that matches the solution.
   * Clicking in the track changes the value.
   *
   * @param {Dimension2} trackSize
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function Track( trackSize, solutionProperty, tandem ) {

    var self = this;

    Rectangle.call( this, 0, 0, trackSize.width, trackSize.height,
      { cursor: 'pointer', stroke: 'black', lineWidth: 1 } );

    // sync view with model
    var positionToConcentration;
    solutionProperty.link( function( solution ) {
      // change the view-to-model function to match the solution's concentration range
      var concentrationRange = solution.concentrationRange;
      positionToConcentration = new LinearFunction( 0, trackSize.width, concentrationRange.min, concentrationRange.max, true /* clamp */ );

      // fill with a gradient that matches the solution's color range
      self.fill = new LinearGradient( 0, 0, trackSize.width, 0 )
        .addColorStop( 0, solution.colorRange.min )
        .addColorStop( 1, solution.colorRange.max );
    } );

    // click in the track to change the value, continue dragging if desired
    var handleEvent = function( event ) {
      var x = self.globalToLocalPoint( event.pointer.point ).x;
      var concentration = positionToConcentration( x );
      solutionProperty.get().concentrationProperty.set( concentration );
    };
    this.addInputListener( new TandemSimpleDragHandler( {
      tandem: tandem.createTandem( 'inputListener' ),
      start: function( event ) {
        handleEvent( event );
      },
      drag: function( event ) {
        handleEvent( event );
      }
    } ) );
  }

  beersLawLab.register( 'ConcentrationSlider.Track', Track );

  inherit( Rectangle, Track );

  /**
   * Vertical tick line.
   * @constructor
   */
  function TickLine() {
    Path.call( this, Shape.lineSegment( 0, 0, 0, TICK_LENGTH ), { stroke: 'black', lineWidth: 1 } );
  }

  beersLawLab.register( 'ConcentrationSlider.TickLine', TickLine );

  inherit( Path, TickLine );

  /**
   * Tick label.
   * @param {number} value
   * @constructor
   */
  function TickLabel( value ) {
    var self = this;
    Text.call( this, '?', { font: TICK_FONT, fill: 'black' } );
    this.setValue = function( value ) {
      self.text = Util.toFixed( value, TICK_DECIMAL_PLACES );
    };
    this.setValue( value );
  }

  beersLawLab.register( 'ConcentrationSlider.TickLabel', TickLabel );

  inherit( Text, TickLabel );

  /**
   * The slider thumb, a rounded rectangle with a vertical line through its center.
   * @param {Dimension2} thumbSize
   * @param {Dimension2} trackSize
   * @param {Property.<BeersLawSolution>} solutionProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function Thumb( thumbSize, trackSize, solutionProperty, tandem ) {

    var self = this;
    Node.call( this, { cursor: 'pointer' } );

    // nodes
    var arcWidth = 0.25 * thumbSize.width;
    var body = new Rectangle( -thumbSize.width / 2, -thumbSize.height / 2, thumbSize.width, thumbSize.height, arcWidth, arcWidth,
      { fill: THUMB_FILL_NORMAL, stroke: THUMB_STROKE, lineWidth: THUMB_LINE_WIDTH } );
    var centerLineYMargin = 3;
    var centerLine = new Path( Shape.lineSegment( 0, -( thumbSize.height / 2 ) + centerLineYMargin, 0, ( thumbSize.height / 2 ) - centerLineYMargin ), { stroke: THUMB_CENTER_LINE_STROKE } );

    // rendering order
    this.addChild( body );
    this.addChild( centerLine );

    // interactivity
    body.addInputListener( new FillHighlightListener( THUMB_FILL_NORMAL, THUMB_FILL_HIGHLIGHT ) );

    // touch area
    var dx = 0.25 * this.width;
    var dy = 0.5 * this.height;
    this.touchArea = Shape.rectangle( ( -this.width / 2 ) - dx, ( -this.height / 2 ) - dy, this.width + dx + dx, this.height + dy + dy );

    // set the drag handler and mapping function for the selected solution
    var dragHandler;
    var concentrationToPosition;
    var setSolution = function( solution ) {
      // drag handler with solution's concentration range
      if ( dragHandler ) {
        self.removeInputListener( dragHandler );
        dragHandler.dispose();
      }
      dragHandler = new ThumbDragHandler( self, solution.concentrationProperty,
        new LinearFunction( 0, trackSize.width, solution.concentrationRange.min, solution.concentrationRange.max, true /* clamp */ ),
        tandem.createTandem( 'dragHandler' ) );
      self.addInputListener( dragHandler );

      // linear mapping function with solution's concentration range
      concentrationToPosition = new LinearFunction( solution.concentrationRange.min, solution.concentrationRange.max, 0, trackSize.width, true /* clamp */ );
    };
    setSolution( solutionProperty.get() );

    // move the slider thumb to reflect the concentration value
    var concentrationObserver = function( concentration ) {
      self.x = concentrationToPosition( concentration );
    };
    solutionProperty.get().concentrationProperty.link( concentrationObserver );

    // when the solution changes, wire up to the current solution
    solutionProperty.link( function( newSolution, oldSolution ) {
      setSolution( newSolution );
      if ( oldSolution ) {
        oldSolution.concentrationProperty.unlink( concentrationObserver );
      }
      newSolution.concentrationProperty.link( concentrationObserver );
    } );
  }

  beersLawLab.register( 'ConcentrationSlider.Thumb', Thumb );

  inherit( Node, Thumb );

  /**
   * Drag handler for the slider thumb.
   * @param {Node} dragNode
   * @param {Property.<number>} concentrationProperty
   * @param {LinearFunction} positionToValue
   * @param {Tandem} tandem
   * @constructor
   */
  function ThumbDragHandler( dragNode, concentrationProperty, positionToValue, tandem ) {
    var clickXOffset; // x-offset between initial click and thumb's origin
    TandemSimpleDragHandler.call( this, {
      tandem: tandem,
      allowTouchSnag: true,
      start: function( event ) {
        clickXOffset = dragNode.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
      },
      drag: function( event ) {
        var x = dragNode.globalToParentPoint( event.pointer.point ).x - clickXOffset;
        var newValue = positionToValue( x );
        concentrationProperty.set( newValue );
      }
    } );
  }

  beersLawLab.register( 'ConcentrationSlider.ThumbDragHandler', ThumbDragHandler );

  inherit( TandemSimpleDragHandler, ThumbDragHandler );

  return inherit( Node, ConcentrationSlider );
} );