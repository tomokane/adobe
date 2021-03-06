/* 
 * @fileoverview: Guides Generator
 * @description: Script to easily generate guides in Photoshop
 * Tested with CS2 and CS4 Mac
 * I haven't find an equivalent of onFocus
 * @version: 0.1
 * @author: getphuture ( github ), yakeson_chihiro ( twitter )
 *
 */


// WORKING IN WEB :-)
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;


var doc = activeDocument;
var res = doc.resolution;


var dlg = new Window( 'dialog', 'Guides Generator', [ 100, 100, 480, 380 ] );

// SETTING PANELS
dlg.settingsPanel = dlg.add( 'panel', [ 25, 15, 355, 200 ], 'Settings' );

// Width / Height
dlg.settingsPanel.sizeFieldLabel = dlg.settingsPanel.add( 'statictext', [ 15, 15, 185, 35 ], 'Column ( Width, Height )');
dlg.settingsPanel.widthFieldInput = dlg.settingsPanel.add( 'edittext', [ 205, 15, 245, 35 ], '100' );
dlg.settingsPanel.heightFieldInput = dlg.settingsPanel.add( 'edittext', [ 265, 15, 305, 35 ], '100' );

// Start Point
dlg.settingsPanel.originPointLabel = dlg.settingsPanel.add( 'statictext', [ 15, 55, 185, 75 ], 'Start Position ( X, Y )' );
dlg.settingsPanel.originPointXInput = dlg.settingsPanel.add( 'edittext', [ 205, 55, 245, 75 ], '0' );
dlg.settingsPanel.originPointYInput = dlg.settingsPanel.add( 'edittext', [ 265, 55, 305, 75 ], '0' );

// Numbers
dlg.settingsPanel.numbersFieldLabel = dlg.settingsPanel.add( 'statictext', [ 15, 95, 185, 115 ], 'Column Numbers' );
dlg.settingsPanel.hSizeFieldInput = dlg.settingsPanel.add( 'edittext', [ 205, 95, 245, 115 ], 'auto' );
dlg.settingsPanel.vSizeFieldInput = dlg.settingsPanel.add( 'edittext', [ 265, 95, 305, 115 ], 'auto' );

// Margins
dlg.settingsPanel.marginFieldLabel = dlg.settingsPanel.add( 'statictext', [ 15, 135, 185, 155 ], 'Column space ( X, Y )' );
dlg.settingsPanel.hMarginFieldInput = dlg.settingsPanel.add( 'edittext', [ 205, 135, 245, 155 ], '0' );
dlg.settingsPanel.vMarginFieldInput = dlg.settingsPanel.add( 'edittext', [ 265, 135, 305, 155 ], '0' );

dlg.buildButton = dlg.add( 'button', [145,235,225,255], 'Generate', {name:'ok'} );
dlg.closeButton = dlg.add( 'button', [255,235,330,255], 'Cancel', {name:'close'} );


with ( dlg.settingsPanel ) {

	widthFieldInput.originalValue = '100';
	widthFieldInput.onChange = blurField;

	heightFieldInput.originalValue = '100';
	heightFieldInput.onChange = blurField;

	originPointXInput.originalValue = '0';
	originPointXInput.onChange = blurField;

	originPointYInput.originalValue = '0';
	originPointYInput.onChange = blurField;

	hSizeFieldInput.originalValue = 'auto';
	hSizeFieldInput.onChange = blurField;

	vSizeFieldInput.originalValue = 'auto';
	vSizeFieldInput.onChange = blurField;

	hMarginFieldInput.originalValue = '0';
	hMarginFieldInput.onChange = blurField;

	vMarginFieldInput.originalValue = '0';
	vMarginFieldInput.onChange = blurField;

}

with ( dlg ) {

	buildButton.onClick = function () {
		// Get the settings
		var width = parseInt( dlg.settingsPanel.widthFieldInput.text, 10 ),
			height = parseInt( dlg.settingsPanel.heightFieldInput.text, 10 )
			position = {
				x: parseInt( dlg.settingsPanel.originPointXInput.text, 10 ),
				y: parseInt( dlg.settingsPanel.originPointYInput.text, 10 )
			},
			total = {
				x: parseInt( dlg.settingsPanel.hSizeFieldInput.text, 10 ),
				y: parseInt( dlg.settingsPanel.vSizeFieldInput.text, 10 )
			},
			margin = {
				x: parseInt( dlg.settingsPanel.hMarginFieldInput.text, 10 ),
				y: parseInt( dlg.settingsPanel.vMarginFieldInput.text, 10 )
			};
		// Check the settings
		if ( isNaN( width ) ) {
			width = 0;
		}
		if ( isNaN( height ) ) {
			height = 0;
		}
		if ( isNaN( position.x ) ) {
			position.x = 0;
		}
		if ( isNaN( position.y ) ) {
			position.y = 0;
		}
		if ( isNaN( margin.x ) ) {
			margin.x = 0;
		}
		if ( isNaN( margin.y ) ) {
			margin.y = 0;
		}
		if ( isNaN( total.x ) ) {
			total.x = Math.round( doc.width / ( width + margin.x ) ) * 2;
		}
		else {
 				total.x *= 2;
		}
		if ( isNaN( total.y ) ) {
			total.y = Math.round( doc.height / ( height + margin.y ) ) * 2;
		}
		else {
 			total.y *= 2;
		}
		// Draw Vertical Guides
		for ( var i = position.x, j = 0; j < total.x; j++ ) {
			guideLine( i, "Vrtc" );
	  		if ( ( j % 2) != 0 ) {
				i += margin.x;
			}
			else {
				i += width;
			}
		}
		// Draw Horizontal Guides
		for ( var i = position.y, j = 0; j < total.y; j++  ) {
			guideLine( i, "Hrzn" );
		  	if ( ( j % 2) != 0 ) {
				i += margin.y;
			}
			else {
				i += height;
			}
		}
		// Completed
		this.parent.close();
	};

	// Cancel button
	closeButton.onClick = function () {
		this.parent.close();
	};

}; 


dlg.show();


function blurField() {
	if ( this.text && ( this.text != '' ) && ( this.text != this.originalValue ) ) {
		this.originalValue = this.text;
	}
	else {
		this.text = this.originalValue;
	}
}


function guideLine( position, type ) {
	var desc27 = new ActionDescriptor();
	var desc28 = new ActionDescriptor();
	desc28.putUnitDouble( app.charIDToTypeID('Pstn'), app.charIDToTypeID('#Pxl'), position );
	desc28.putEnumerated( app.charIDToTypeID('Ornt'), app.charIDToTypeID('Ornt'), app.charIDToTypeID(type) );
	desc27.putObject( app.charIDToTypeID('Nw  '), app.charIDToTypeID('Gd  '), desc28 );
	executeAction( app.charIDToTypeID('Mk  '), desc27, DialogModes.NO );
};
