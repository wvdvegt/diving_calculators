////////////////////////////
//Deco Graph Funtions
////////////////////////////

var queryString = '';
var dataUrl = '';

var depth = 20;				// [m]
var divetime = 30;			// [min]
var stop_03 = 0;			// [min]
var stop_06 = 0;			// [min]
var stop_09 = 0;			// [min]
var stop_12 = 0;			// [min]
var stop_safety = 5;		// [min]
var ascend_speed = 10; 		// [m/min]
var descend_speed = 20; 	// [m/min]
var afont = 9;

function pad2(number) {
	return (number < 10 ? '0' : '') + number
}

function isdecodive() {
	return (stop_12!=0 || stop_09!=0 || stop_06!=0 || stop_03!=0);
}

function diveduration () {
	//NOTE: Either exact (below) or use divetime + Math.ceil(depth/10) + stops.
	//      For the chart we use the actual times.
	return divetime+stop_12+stop_09+stop_06+stop_safety+stop_03+Math.ceil(depth/10);

	return Math.ceil(divetime +
	((depth-12)/ascend_speed) + stop_12 +
	((12-09)/ascend_speed) + stop_09 +
	((09-06)/ascend_speed) + stop_06 +
	((06-05)/ascend_speed) + stop_safety +
	((05-03)/ascend_speed) + stop_03 +
	((03-00)/ascend_speed));
}

function onLoadCallback() {
	if (dataUrl.length > 0) {
		var query = new google.visualization.Query(dataUrl);
		query.setQuery(queryString);
		query.send(handleQueryResponse);
		} else if (google.visualization) {
		var dataTable = new google.visualization.DataTable();

		x=0;
		y=1;

		//if (isdecodive()) {
			dataTable.addRows(16);

			//x                             	y
			dataTable.addColumn('number');  	dataTable.addColumn('number');

			ndx = 0;
			t = -5;
			dataTable.setValue(ndx, x, t);	  	dataTable.setValue(ndx, y, 0);

			ndx++; //1
			t = 0;
			dataTable.setValue(ndx, x, t);	  	dataTable.setValue(ndx, y, 0);

			ndx++; //2
			t += depth/descend_speed;
			dataTable.setValue(ndx, x, t);	  	dataTable.setValue(ndx, y, -depth);

			ndx++; //3
			t = divetime;
			dataTable.setValue(ndx, x, t);	  	dataTable.setValue(ndx, y, -depth);

			//Stop @ 12m
			ndx++; //4
			t += ((depth-12)/ascend_speed);
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, -12);
			ndx++; //5
			t += stop_12;
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, -12);

			//Stop @ 9m
			ndx++; //6
			t += ((12 - 09)/ascend_speed);
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, -9);
			ndx++; //7
			t += stop_09;
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, -9);

			//Stop @ 6m
			ndx++; //8
			t += ((09 - 06)/ascend_speed);
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, -6);
			ndx++; //9
			t += stop_06;
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, -6);

			//Stop @ 5m
			ndx++; //10
			t += ((06 - 05)/ascend_speed);
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, -5);
			ndx++; //11
			t += stop_safety;
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, -5);

			//Stop @ 3m
			ndx++; //12
			t += ((05 - 03)/ascend_speed);
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, -3);
			ndx++; //13
			t += stop_03;
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, -3);

			ndx++; //14
			t += ((03 - 00)/ascend_speed);
			dataTable.setValue(ndx, x, t);		dataTable.setValue(ndx, y, 0);

			ndx++; //15
			dataTable.setValue(ndx, x, (Math.ceil((diveduration()+1)/5)*5));		dataTable.setValue(ndx, y, 0);
		//}

		draw(dataTable);
	}
}

function getticks() {
	result = '';

	return result;
}

function getlabels() {
	//Sample 'tStart Deco,FF0000,0,1,10|s,000020,0,1,5'
	result = '';

	if (stop_12 != 0) {
		//result += '|s,000020,0,04:04,5';
		result += '|AStop: '+stop_12+'min. at 12m,FF0000,0,04,'+afont;
		result += '|H,FF000040,0,04,1,1';
	}

	if (stop_09 != 0) {
		//result += '|s,FF0000,0,06:06,5';
		result += '|AStop: '+stop_09+'min. at 9m,FF0000,0,06,'+afont;
		result += '|H,FF000040,0,06,1,1';
	}

	if (stop_06 != 0) {
		//result += '|s,FF0000,0,08:08,5';
		result += '|AStop: '+stop_06+'min. at 6m,FF0000,0,08,'+afont;
		result += '|H,FF000040,0,08,1,1';
	}

	if (stop_safety != 0) {
		//result += '|s,FF0000,0,10:10,5';
		result += '|ASafety stop: '+stop_safety+'min. at 5m,007700,0,10,'+afont;
		result += '|H,FF000040,0,10,1,1';
	}

	if (stop_03 != 0) {
		//result += '|s,FF0000,0,12:12,5';
		result += '|AStop '+stop_03+'min. at 3m,FF0000,0,12,'+afont;
		result += '|H,FF000040,0,12,1,1';
	}

	result += '|AStart of dive,,0,01,8';
	result += '|AStart of ascend,,0,03,8';
	result += '|ASurfacing after '+diveduration()+' [min],,0,14,'+afont;

	result += '|s,FF0000,0,01:01,5';
	result += '|s,FF0000,0,03:03,5';
	result += '|s,FF0000,0,14:14,5';

	result += '|H,FF000040,0,02,1,1';

	result += '|v,FF000040,0,01,1,1';
	result += '|v,FF000040,0,03,1,1';
	result += '|V,FF000040,0,14,1,1';

	result = result.substr(1);

	return result;
}

function draw(dataTable) {
	//Note the second x,y axis is only used for displaying the axis name

	var vis = new google.visualization.ImageChart(document.getElementById('chart'));
	var options = {
		chxl: '1:|time [min]|3:|Depth [m]',						//Custom axis labels
		chxp: '1,50|3,100',										//Axis label position
		chxr: '0,-5,'+(Math.ceil((diveduration()+1)/5)*5)+
		'|2,'+(-Math.ceil((depth+1)/10)*10)+',10'+
		'|4,'+(-Math.ceil((depth+1)/10)*10)+',10',			//Axis range
		chxs: '0,lt,676767,2,676767,11.5',						//Axis label styles
		chxtc:''+getticks(),										//Axis tick markers
		chxt: 'x,x,y,y,r',										//Visible axis
		chs:  '800x320',											//Chart Size
		cht:  'lxy',												//Chart type (x,y)
			chco: '3072F3',											//Series colors '3072F3,FF0000'
		chds: '-5,'+(Math.ceil((diveduration()+1)/5)*5)+','+(-Math.ceil((depth+1)/10)*10)+
		',10'+','+(-Math.ceil((depth+1)/10)*10)+',10', 		//Axis scale
		//chdl: 'dive profile',									//Legend text
		chdlp:'b',												//Legend location
		chls: '2',												//Line styles '2,4,1|1',
		chma: '15,15,15,25',										//Chart margins
		chtt: 'Dive of ' + divetime + ' [min] at '+depth+' [m]',	//Chart title
		chm: ''+getlabels()										//Tekst & Marker
		};
	vis.draw(dataTable, options);

	// jquery.loupe.js
	// setTimeout("$('.goog-serverchart-image').loupe({width:100,height:50})", 100);

	// jquery.jloupe.js
	// setTimeout("$('.goog-serverchart-image').jloupe({radiusLT: 0,radiusRT: 10,radiusRB: 0,radiusLB: 10,width: 300,height: 150,borderColor: '#f2730b',backgroundColor: '#000',fade: false})", 2000);
}

function handleQueryResponse(response) {
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}
	draw(response.getDataTable());
}

// google.load("visualization", "1", {packages:["imagechart"]});
// google.setOnLoadCallback(onLoadCallback);

////////////////////////////
//Deco Table Entry Object
////////////////////////////

function TableEntry(){};

function TableEntry(adepth, aduration, asaturation, astop3, astop6, astop9, astop12)
{
	this.depth	  = adepth;
	this.duration	  = aduration;
	this.saturation = asaturation;

	this.stop3=0;
	this.stop6=0;
	this.stop9=0;
	this.stop12=0;

	if (TableEntry.arguments.length>3) {
		this.stop3=astop3;
		};
	if (TableEntry.arguments.length>4) {
		this.stop6=astop6;
		};
	if (TableEntry.arguments.length>5) {
		this.stop9=astop9;
		};
	if (TableEntry.arguments.length>6) {
		this.stop12=astop12;
		};

	//Expose Functions
	if (typeof(_TableEntry_prototype_called) == 'undefined')
	{
		_TableEntry_prototype_called = true;
		TableEntry.prototype.getInfo = getInfo;
		TableEntry.prototype.getSaturation = getSaturation;
		TableEntry.prototype.getDeco = getDeco;
		TableEntry.prototype.getAscendTime= getAscendTime;
		TableEntry.prototype.getStopTime= getStopTime;
	}

	//Diagnostic Dump of Deco Table Entry.
	function getInfo()
	{
		return ''+
		this.depth + ' [m], ' +
		this.duration.toString() + ' [minutes], ' +
		this.saturation + ', ' +
		this.stop3.toString() + ', ' +
		this.stop6.toString() + ', ' +
		this.stop9.toString() + ', ' +
		this.stop12.toString();
		};

	function getAscendTime(actualdepth) {
		return Math.ceil(actualdepth/10);
	}

	//Adjust Saturation for Cold.
	function getSaturation(cold)
	{
		result = '';
		if (cold) {
			return this.saturation + ' -> ' + String.fromCharCode(this.saturation.charCodeAt(0)+1) + ' (koude)';
			} else {
			return this.saturation;
		}
	}

	//Return Total Time of Deco Stops.
	function getStopTime(roughsea, cold)
	{
		result = 0;

		result += this.stop12;
		result += this.stop9;
		result += this.stop6;

		if (this.stop3!=0)
		{
			//Compensate for rough sea
			if (roughsea) {
				result += 2*this.stop3;
			} else {
				result += this.stop3;
			}
		} else {
			//No Deco Dive
			if (cold) {
				result += 0;
			} else {
				result += 5;
			}
		}

		return result;
	}

	//Return Deco Profile.
	function getDeco(roughsea, cold)
	{
		result = '';
		cnt = 1;
		if (this.stop12!=0) {
			result += 'Decostop #'+cnt+' = ' + this.stop12 + ' min. op 12 meter\r\n';
			cnt++;
		}

		if (this.stop9!=0) {
			result += 'Decostop #'+cnt+' = ' + this.stop9 + ' min. op 9 meter\r\n';
			cnt++;
		}

		if (this.stop6!=0) {
			result += 'Decostop #'+cnt+' = ' + this.stop6 + ' min. op 6 meter\r\n';
			cnt++;
		}

		if (this.stop3!=0) {
			if (roughsea) {
				result += 'Decostop #'+cnt+' = 2 x ' + this.stop3 + ' min. op 6 meter (ruwe zee)\r\n';
				cnt++;
			} else {
				result += 'Decostop #'+cnt+' = ' + this.stop3 + ' min. op 3 meter\r\n';
				cnt++;
			}
			$("#oTypeStop").html("Tijd Decostop(s):");
		} else {
			if (cold) {
				result += 'Veiligheidsstop = Geen (koude)\r\n';
				} else {
				result += 'Veiligheidsstop = 5 min. op 5 meter\r\n';
			}
			$("#oTypeStop").html("Tijd Veiligheidsstop:");
		}

		//Adjust Saturation for Cold.
		result += 'Saturatie = '+this.getSaturation(cold);

		return result;
	}

	};

////////////////////////////
//Fill Deco Table
////////////////////////////

table = new Array();
table[table.length] = new TableEntry(3,  60, 'A');
table[table.length] = new TableEntry(3, 120, 'B');
table[table.length] = new TableEntry(3, 210, 'C');

table[table.length] = new TableEntry(6,  50, 'B');
table[table.length] = new TableEntry(6,  75, 'C');
table[table.length] = new TableEntry(6, 100, 'D');
table[table.length] = new TableEntry(6, 135, 'E');

table[table.length] = new TableEntry(9,  30, 'B');
table[table.length] = new TableEntry(9,  45, 'C');
table[table.length] = new TableEntry(9,  60, 'D');
table[table.length] = new TableEntry(9,  75, 'E');
table[table.length] = new TableEntry(9,  95, 'F');
table[table.length] = new TableEntry(9, 120, 'G');

table[table.length] = new TableEntry(12,  15, 'B');
table[table.length] = new TableEntry(12,  25, 'C');
table[table.length] = new TableEntry(12,  30, 'D');
table[table.length] = new TableEntry(12,  40, 'E');
table[table.length] = new TableEntry(12,  50, 'F');
table[table.length] = new TableEntry(12,  70, 'G');
table[table.length] = new TableEntry(12,  80, 'H');
table[table.length] = new TableEntry(12, 100, 'I');
table[table.length] = new TableEntry(12, 110, 'J');
table[table.length] = new TableEntry(12, 130, 'K');
table[table.length] = new TableEntry(12, 150, 'L');
table[table.length] = new TableEntry(12, 170, 'M');

table[table.length] = new TableEntry(15,  15, 'C');
table[table.length] = new TableEntry(15,  25, 'D');
table[table.length] = new TableEntry(15,  30, 'E');
table[table.length] = new TableEntry(15,  40, 'F');
table[table.length] = new TableEntry(15,  50, 'G');
table[table.length] = new TableEntry(15,  60, 'H');
table[table.length] = new TableEntry(15,  70, 'I');
table[table.length] = new TableEntry(15,  80, 'J');
table[table.length] = new TableEntry(15,  90, 'K');
table[table.length] = new TableEntry(15, 100, 'L');
table[table.length] = new TableEntry(15, 110, 'L',  3);
table[table.length] = new TableEntry(15, 120, 'M',  5);
table[table.length] = new TableEntry(15, 140, 'M', 10);
table[table.length] = new TableEntry(15, 160, 'N', 21);

table[table.length] = new TableEntry(18,  15, 'C');
table[table.length] = new TableEntry(18,  20, 'D');
table[table.length] = new TableEntry(18,  25, 'E');
table[table.length] = new TableEntry(18,  30, 'F');
table[table.length] = new TableEntry(18,  40, 'G');
table[table.length] = new TableEntry(18,  50, 'H');
table[table.length] = new TableEntry(18,  55, 'I');
table[table.length] = new TableEntry(18,  60, 'J');
table[table.length] = new TableEntry(18,  70, 'K',  2);
table[table.length] = new TableEntry(18,  80, 'L',  7);
table[table.length] = new TableEntry(18, 100, 'M', 14);

table[table.length] = new TableEntry(21,  10, 'C');
table[table.length] = new TableEntry(21,  15, 'D');
table[table.length] = new TableEntry(21,  20, 'E');
table[table.length] = new TableEntry(21,  30, 'F');
table[table.length] = new TableEntry(21,  35, 'G');
table[table.length] = new TableEntry(21,  40, 'H');
table[table.length] = new TableEntry(21,  45, 'I');
table[table.length] = new TableEntry(21,  50, 'J');
table[table.length] = new TableEntry(21,  60, 'K',  8);
table[table.length] = new TableEntry(21,  70, 'L', 14);
table[table.length] = new TableEntry(21,  80, 'M', 18);
table[table.length] = new TableEntry(21,  90, 'N', 23);
table[table.length] = new TableEntry(21, 100, 'N', 33);

table[table.length] = new TableEntry(24,   5, 'B');
table[table.length] = new TableEntry(24,  10, 'C');
table[table.length] = new TableEntry(24,  15, 'D');
table[table.length] = new TableEntry(24,  20, 'E');
table[table.length] = new TableEntry(24,  25, 'F');
table[table.length] = new TableEntry(24,  30, 'G');
table[table.length] = new TableEntry(24,  35, 'H');
table[table.length] = new TableEntry(24,  40, 'I');
table[table.length] = new TableEntry(24,  50, 'K', 10);
table[table.length] = new TableEntry(24,  60, 'L', 17);
table[table.length] = new TableEntry(24,  70, 'M', 23);

table[table.length] = new TableEntry(27,  10, 'C');
table[table.length] = new TableEntry(27,  15, 'E');
table[table.length] = new TableEntry(27,  20, 'F');
table[table.length] = new TableEntry(27,  25, 'G');
table[table.length] = new TableEntry(27,  30, 'H');
table[table.length] = new TableEntry(27,  40, 'J',  7);
table[table.length] = new TableEntry(27,  50, 'L', 18);
table[table.length] = new TableEntry(27,  60, 'M', 25);
table[table.length] = new TableEntry(27,  70, 'N', 30,  7);

table[table.length] = new TableEntry(30,  10, 'D');
table[table.length] = new TableEntry(30,  15, 'E');
table[table.length] = new TableEntry(30,  20, 'F');
table[table.length] = new TableEntry(30,  25, 'H');
table[table.length] = new TableEntry(30,  30, 'I',  3);
table[table.length] = new TableEntry(30,  40, 'K', 15);
table[table.length] = new TableEntry(30,  50, 'L', 24,  2);
table[table.length] = new TableEntry(30,  60, 'N', 28,  9);

table[table.length] = new TableEntry(33,  10, 'D');
table[table.length] = new TableEntry(33,  15, 'F');
table[table.length] = new TableEntry(33,  20, 'G');
table[table.length] = new TableEntry(33,  25, 'H',  3);
table[table.length] = new TableEntry(33,  30, 'J',  7);
table[table.length] = new TableEntry(33,  40, 'L', 21,  2);
table[table.length] = new TableEntry(33,  50, 'M', 26, 18);
table[table.length] = new TableEntry(33,  60, 'N', 36, 18);

table[table.length] = new TableEntry(33,   5, 'C');
table[table.length] = new TableEntry(33,  10, 'D');
table[table.length] = new TableEntry(33,  15, 'F');
table[table.length] = new TableEntry(33,  20, 'H',  2);
table[table.length] = new TableEntry(33,  25, 'I',  6);
table[table.length] = new TableEntry(33,  30, 'J', 14);
table[table.length] = new TableEntry(33,  40, 'L', 25,  5);
table[table.length] = new TableEntry(33,  50, 'M', 31, 15);

table[table.length] = new TableEntry(39,   5, 'C');
table[table.length] = new TableEntry(39,  10, 'E');
table[table.length] = new TableEntry(39,  15, 'F', 1);
table[table.length] = new TableEntry(39,  20, 'H', 4);
table[table.length] = new TableEntry(39,  25, 'J', 10);
table[table.length] = new TableEntry(39,  30, 'M', 18,  3);
table[table.length] = new TableEntry(39,  40, 'N', 25, 10);

table[table.length] = new TableEntry(42,   5, 'C');
table[table.length] = new TableEntry(42,  10, 'E');
table[table.length] = new TableEntry(42,  15, 'G',  2);
table[table.length] = new TableEntry(42,  20, 'I',  6);
table[table.length] = new TableEntry(42,  25, 'J', 14,  2);
table[table.length] = new TableEntry(42,  30, 'K', 21,  5);
table[table.length] = new TableEntry(42,  40, 'N', 26, 16,  2);

table[table.length] = new TableEntry(45,   5, 'C');
table[table.length] = new TableEntry(45,  10, 'E',  1);
table[table.length] = new TableEntry(45,  15, 'G',  3);
table[table.length] = new TableEntry(45,  20, 'I',  7,  2);
table[table.length] = new TableEntry(45,  25, 'H', 17,  4);
table[table.length] = new TableEntry(45,  30, 'L', 24,  8);
table[table.length] = new TableEntry(45,  40, 'N', 33, 19,  5);

table[table.length] = new TableEntry(48,   5, 'D');
table[table.length] = new TableEntry(48,  10, 'F',  1);
table[table.length] = new TableEntry(48,  15, 'H',  4,  1);
table[table.length] = new TableEntry(48,  20, 'J', 11,  3);
table[table.length] = new TableEntry(48,  25, 'K', 20,  7);
table[table.length] = new TableEntry(48,  30, 'M', 25, 11,  2);
table[table.length] = new TableEntry(48,  40, 'N', 39, 23,  7);

table[table.length] = new TableEntry(51,   5, 'D');
table[table.length] = new TableEntry(51,  10, 'F',  2)
	table[table.length] = new TableEntry(51,  15, 'H',  5,  1);
table[table.length] = new TableEntry(51,  20, 'J', 15,  4);
table[table.length] = new TableEntry(51,  25, 'L', 23,  7,  2);
table[table.length] = new TableEntry(51,  30, 'M', 26, 13,  4);

table[table.length] = new TableEntry(54,   5, 'D');
table[table.length] = new TableEntry(54,  10, 'F',  2)
	table[table.length] = new TableEntry(54,  15, 'I',  6,  3);
table[table.length] = new TableEntry(54,  20, 'K', 17,  5,  1);
table[table.length] = new TableEntry(54,  25, 'L', 24, 10,  3);
table[table.length] = new TableEntry(54,  30, 'N', 27, 17,  6);

table[table.length] = new TableEntry(57,   5, 'D');
table[table.length] = new TableEntry(57,  10, 'G',  3,  1);
table[table.length] = new TableEntry(57,  15, 'I',  7,  4);
table[table.length] = new TableEntry(57,  20, 'K', 20,  6,  2);
table[table.length] = new TableEntry(57,  25, 'M', 25, 11,  5);

table[table.length] = new TableEntry(60,   5, 'n/a');
table[table.length] = new TableEntry(60,  10, 'n/a',  4,  1);
table[table.length] = new TableEntry(60,  15, 'n/a', 10,  4,  1);
table[table.length] = new TableEntry(60,  20, 'n/a', 27,  7,  3);
table[table.length] = new TableEntry(60,  25, 'n/a', 25, 14,  7);

table[table.length] = new TableEntry(63,   5, 'n/a',  1);
table[table.length] = new TableEntry(63,  10, 'n/a',  4,  2);
table[table.length] = new TableEntry(63,  15, 'n/a', 13,  5,  1);
table[table.length] = new TableEntry(63,  20, 'n/a', 23, 10,  4);

table[table.length] = new TableEntry(66,   5, 'n/a',  1);
table[table.length] = new TableEntry(66,  10, 'n/a',  5,  2);
table[table.length] = new TableEntry(66,  15, 'n/a', 16,  5,  2);
table[table.length] = new TableEntry(66,  20, 'n/a', 24, 11,  3,  1);

table[table.length] = new TableEntry(69,   5, 'n/a',  2);
table[table.length] = new TableEntry(69,  10, 'n/a',  6,  2,  1);
table[table.length] = new TableEntry(69,  15, 'n/a', 18,  6,  3);

table[table.length] = new TableEntry(72,   5, 'n/a',  2);
table[table.length] = new TableEntry(72,  10, 'n/a',  6,  3,  1);
table[table.length] = new TableEntry(72,  15, 'n/a', 21,  6,  4);

table[table.length] = new TableEntry(75,   5, 'n/a',  2,  1);
table[table.length] = new TableEntry(75,  10, 'n/a',  7,  4,  1);
table[table.length] = new TableEntry(75,  15, 'n/a', 22,  7,  4,  1);

table[table.length] = new TableEntry(78,   5, 'n/a',  2,  1);
table[table.length] = new TableEntry(78,  10, 'n/a',  9,  4,  2);
table[table.length] = new TableEntry(78,  15, 'n/a', 22, 10,  4,  2);

table[table.length] = new TableEntry(81,   5, 'n/a',  3,  1);
table[table.length] = new TableEntry(81,  10, 'n/a', 11,  5,  2);
table[table.length] = new TableEntry(81,  15, 'n/a', 24, 11,  4,  3);

table[table.length] = new TableEntry(84,   5, 'n/a',  2,  2);
table[table.length] = new TableEntry(84,  10, 'n/a', 13,  5,  4,  3);

table[table.length] = new TableEntry(87,   5, 'n/a',  2,  2);
table[table.length] = new TableEntry(87,  10, 'n/a', 16,  5,  3,  1);

table[table.length] = new TableEntry(90,   5, 'n/a',  3,  3);
table[table.length] = new TableEntry(90,  10, 'n/a', 17,  6,  3,  1);


////////////////////////////
//Tussentijden Table Entry Object
////////////////////////////

function TTEntry(){};

function TTEntry(start, uren, min, end)
{
	this.startsat   = start;
	this.between    = (uren*60)+min;
	this.endsat     = end;
	};

////////////////////////////
//Fill Tussentijden Table
//Note the order (time) of table is reversed, easier searching.
////////////////////////////

tt = new Array();
tt[tt.length] = new TTEntry('A', 12, 00, 'A');
tt[tt.length] = new TTEntry('A', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('B', 12, 00, 'A');
tt[tt.length] = new TTEntry('B', 03, 21, 'B');
tt[tt.length] = new TTEntry('B', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('C', 12, 00, 'A');
tt[tt.length] = new TTEntry('C', 04, 50, 'B');
tt[tt.length] = new TTEntry('C', 01, 40, 'C');
tt[tt.length] = new TTEntry('C', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('D', 12, 00, 'A');
tt[tt.length] = new TTEntry('D', 05, 49, 'B');
tt[tt.length] = new TTEntry('D', 02, 39, 'C');
tt[tt.length] = new TTEntry('D', 01, 10, 'D');
tt[tt.length] = new TTEntry('D', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('E', 12, 00, 'A');
tt[tt.length] = new TTEntry('E', 06, 35, 'B');
tt[tt.length] = new TTEntry('E', 03, 25, 'C');
tt[tt.length] = new TTEntry('E', 01, 58, 'D');
tt[tt.length] = new TTEntry('E', 00, 55, 'E');
tt[tt.length] = new TTEntry('E', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('F', 12, 00, 'A');
tt[tt.length] = new TTEntry('F', 07, 06, 'B');
tt[tt.length] = new TTEntry('F', 03, 58, 'C');
tt[tt.length] = new TTEntry('F', 02, 29, 'D');
tt[tt.length] = new TTEntry('F', 01, 30, 'E');
tt[tt.length] = new TTEntry('F', 00, 46, 'F');
tt[tt.length] = new TTEntry('F', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('G', 12, 00, 'A');
tt[tt.length] = new TTEntry('G', 07, 36, 'B');
tt[tt.length] = new TTEntry('G', 04, 26, 'C');
tt[tt.length] = new TTEntry('G', 02, 59, 'D');
tt[tt.length] = new TTEntry('G', 02, 00, 'E');
tt[tt.length] = new TTEntry('G', 01, 16, 'F');
tt[tt.length] = new TTEntry('G', 00, 41, 'G');
tt[tt.length] = new TTEntry('G', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('H', 12, 00, 'A');
tt[tt.length] = new TTEntry('H', 08, 00, 'B');
tt[tt.length] = new TTEntry('H', 04, 50, 'C');
tt[tt.length] = new TTEntry('H', 03, 21, 'D');
tt[tt.length] = new TTEntry('H', 02, 24, 'E');
tt[tt.length] = new TTEntry('H', 01, 42, 'F');
tt[tt.length] = new TTEntry('H', 01, 07, 'G');
tt[tt.length] = new TTEntry('H', 00, 37, 'H');
tt[tt.length] = new TTEntry('H', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('I', 12, 00, 'A');
tt[tt.length] = new TTEntry('I', 08, 22, 'B');
tt[tt.length] = new TTEntry('I', 05, 13, 'C');
tt[tt.length] = new TTEntry('I', 03, 44, 'D');
tt[tt.length] = new TTEntry('I', 02, 45, 'E');
tt[tt.length] = new TTEntry('I', 02, 03, 'F');
tt[tt.length] = new TTEntry('I', 01, 30, 'G');
tt[tt.length] = new TTEntry('I', 01, 00, 'H');
tt[tt.length] = new TTEntry('I', 00, 34, 'I');
tt[tt.length] = new TTEntry('I', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('J', 12, 00, 'A');
tt[tt.length] = new TTEntry('J', 08, 51, 'B');
tt[tt.length] = new TTEntry('J', 05, 41, 'C');
tt[tt.length] = new TTEntry('J', 04, 03, 'D');
tt[tt.length] = new TTEntry('J', 03, 05, 'E');
tt[tt.length] = new TTEntry('J', 02, 21, 'F');
tt[tt.length] = new TTEntry('J', 01, 48, 'G');
tt[tt.length] = new TTEntry('J', 01, 20, 'H');
tt[tt.length] = new TTEntry('J', 00, 55, 'I');
tt[tt.length] = new TTEntry('J', 00, 32, 'J');
tt[tt.length] = new TTEntry('J', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('K', 12, 00, 'A');
tt[tt.length] = new TTEntry('K', 08, 59, 'B');
tt[tt.length] = new TTEntry('K', 05, 49, 'C');
tt[tt.length] = new TTEntry('K', 04, 20, 'D');
tt[tt.length] = new TTEntry('K', 03, 22, 'E');
tt[tt.length] = new TTEntry('K', 02, 39, 'F');
tt[tt.length] = new TTEntry('K', 02, 04, 'G');
tt[tt.length] = new TTEntry('K', 01, 36, 'H');
tt[tt.length] = new TTEntry('K', 01, 12, 'I');
tt[tt.length] = new TTEntry('K', 00, 50, 'J');
tt[tt.length] = new TTEntry('K', 00, 29, 'K');
tt[tt.length] = new TTEntry('K', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('L', 12, 00, 'A');
tt[tt.length] = new TTEntry('L', 09, 13, 'B');
tt[tt.length] = new TTEntry('L', 06, 03, 'C');
tt[tt.length] = new TTEntry('L', 04, 36, 'D');
tt[tt.length] = new TTEntry('L', 03, 37, 'E');
tt[tt.length] = new TTEntry('L', 02, 54, 'F');
tt[tt.length] = new TTEntry('L', 02, 20, 'G');
tt[tt.length] = new TTEntry('L', 01, 50, 'H');
tt[tt.length] = new TTEntry('L', 01, 26, 'I');
tt[tt.length] = new TTEntry('L', 01, 05, 'J');
tt[tt.length] = new TTEntry('L', 00, 46, 'K');
tt[tt.length] = new TTEntry('L', 00, 27, 'L');
tt[tt.length] = new TTEntry('L', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('M', 12, 00, 'A');
tt[tt.length] = new TTEntry('M', 09, 29, 'B');
tt[tt.length] = new TTEntry('M', 06, 19, 'C');
tt[tt.length] = new TTEntry('M', 04, 50, 'D');
tt[tt.length] = new TTEntry('M', 03, 53, 'E');
tt[tt.length] = new TTEntry('M', 03, 09, 'F');
tt[tt.length] = new TTEntry('M', 02, 35, 'G');
tt[tt.length] = new TTEntry('M', 02, 06, 'H');
tt[tt.length] = new TTEntry('M', 01, 40, 'I');
tt[tt.length] = new TTEntry('M', 01, 19, 'J');
tt[tt.length] = new TTEntry('M', 01, 00, 'K');
tt[tt.length] = new TTEntry('M', 00, 43, 'L');
tt[tt.length] = new TTEntry('M', 00, 26, 'M');
tt[tt.length] = new TTEntry('M', 00, 10, 'n/a');

tt[tt.length] = new TTEntry('N', 12, 00, 'A');
tt[tt.length] = new TTEntry('N', 09, 44, 'B');
tt[tt.length] = new TTEntry('N', 06, 33, 'C');
tt[tt.length] = new TTEntry('N', 05, 04, 'D');
tt[tt.length] = new TTEntry('N', 04, 05, 'E');
tt[tt.length] = new TTEntry('N', 03, 23, 'F');
tt[tt.length] = new TTEntry('N', 02, 48, 'G');
tt[tt.length] = new TTEntry('N', 02, 19, 'H');
tt[tt.length] = new TTEntry('N', 01, 54, 'I');
tt[tt.length] = new TTEntry('N', 01, 31, 'J');
tt[tt.length] = new TTEntry('N', 01, 12, 'K');
tt[tt.length] = new TTEntry('N', 00, 55, 'L');
tt[tt.length] = new TTEntry('N', 00, 40, 'M');
tt[tt.length] = new TTEntry('N', 00, 25, 'N');
tt[tt.length] = new TTEntry('N', 00, 10, 'n/a');

////////////////////////////
//Staftijden Table Entry Object
////////////////////////////

function STEntry(){};

function STEntry(saturation, depth, penalty)
{
	this.saturation = saturation;
	this.depth      = depth;
	this.penalty    = penalty;
	};

////////////////////////////
//Fill Staftijden Table
////////////////////////////

st = new Array();
st[st.length] = new STEntry('A', 12, 007);
st[st.length] = new STEntry('A', 15, 006);
st[st.length] = new STEntry('A', 18, 005);
st[st.length] = new STEntry('A', 21, 004);
st[st.length] = new STEntry('A', 24, 004);
st[st.length] = new STEntry('A', 27, 003);
st[st.length] = new STEntry('A', 30, 003);
st[st.length] = new STEntry('A', 33, 003);
st[st.length] = new STEntry('A', 36, 003);
st[st.length] = new STEntry('A', 39, 003);
st[st.length] = new STEntry('A', 42, 002);
st[st.length] = new STEntry('A', 45, 002);
st[st.length] = new STEntry('A', 48, 002);
st[st.length] = new STEntry('A', 51, 002);
st[st.length] = new STEntry('A', 54, 002);
st[st.length] = new STEntry('A', 57, 002);

st[st.length] = new STEntry('B', 12,  17);
st[st.length] = new STEntry('B', 15,  13);
st[st.length] = new STEntry('B', 18,  11);
st[st.length] = new STEntry('B', 21,   9);
st[st.length] = new STEntry('B', 24,   8);
st[st.length] = new STEntry('B', 27,   7);
st[st.length] = new STEntry('B', 30,   7);
st[st.length] = new STEntry('B', 33,   6);
st[st.length] = new STEntry('B', 36,   6);
st[st.length] = new STEntry('B', 39,   6);
st[st.length] = new STEntry('B', 42,   5);
st[st.length] = new STEntry('B', 45,   5);
st[st.length] = new STEntry('B', 48,   4);
st[st.length] = new STEntry('B', 51,   4);
st[st.length] = new STEntry('B', 54,   4);
st[st.length] = new STEntry('B', 57,   4);

st[st.length] = new STEntry('C', 12, 025);
st[st.length] = new STEntry('C', 15, 021);
st[st.length] = new STEntry('C', 18, 017);
st[st.length] = new STEntry('C', 21, 015);
st[st.length] = new STEntry('C', 24, 013);
st[st.length] = new STEntry('C', 27, 011);
st[st.length] = new STEntry('C', 30, 010);
st[st.length] = new STEntry('C', 33, 010);
st[st.length] = new STEntry('C', 36, 009);
st[st.length] = new STEntry('C', 39, 008);
st[st.length] = new STEntry('C', 42, 007);
st[st.length] = new STEntry('C', 45, 007);
st[st.length] = new STEntry('C', 48, 006);
st[st.length] = new STEntry('C', 51, 006);
st[st.length] = new STEntry('C', 54, 006);
st[st.length] = new STEntry('C', 57, 006);

st[st.length] = new STEntry('D', 12, 037);
st[st.length] = new STEntry('D', 15, 029);
st[st.length] = new STEntry('D', 18, 024);
st[st.length] = new STEntry('D', 21, 020);
st[st.length] = new STEntry('D', 24, 018);
st[st.length] = new STEntry('D', 27, 016);
st[st.length] = new STEntry('D', 30, 014);
st[st.length] = new STEntry('D', 33, 013);
st[st.length] = new STEntry('D', 36, 012);
st[st.length] = new STEntry('D', 39, 011);
st[st.length] = new STEntry('D', 42, 010);
st[st.length] = new STEntry('D', 45, 009);
st[st.length] = new STEntry('D', 48, 009);
st[st.length] = new STEntry('D', 51, 008);
st[st.length] = new STEntry('D', 54, 008);
st[st.length] = new STEntry('D', 57, 008);

st[st.length] = new STEntry('E', 12, 049);
st[st.length] = new STEntry('E', 15, 038);
st[st.length] = new STEntry('E', 18, 030);
st[st.length] = new STEntry('E', 21, 026);
st[st.length] = new STEntry('E', 24, 023);
st[st.length] = new STEntry('E', 27, 020);
st[st.length] = new STEntry('E', 30, 018);
st[st.length] = new STEntry('E', 33, 016);
st[st.length] = new STEntry('E', 36, 015);
st[st.length] = new STEntry('E', 39, 013);
st[st.length] = new STEntry('E', 42, 012);
st[st.length] = new STEntry('E', 45, 012);
st[st.length] = new STEntry('E', 48, 011);
st[st.length] = new STEntry('E', 51, 010);
st[st.length] = new STEntry('E', 54, 010);
st[st.length] = new STEntry('E', 57, 010);

st[st.length] = new STEntry('F', 12, 061);
st[st.length] = new STEntry('F', 15, 047);
st[st.length] = new STEntry('F', 18, 036);
st[st.length] = new STEntry('F', 21, 031);
st[st.length] = new STEntry('F', 24, 028);
st[st.length] = new STEntry('F', 27, 024);
st[st.length] = new STEntry('F', 30, 022);
st[st.length] = new STEntry('F', 33, 020);
st[st.length] = new STEntry('F', 36, 018);
st[st.length] = new STEntry('F', 39, 016);
st[st.length] = new STEntry('F', 42, 015);
st[st.length] = new STEntry('F', 45, 014);
st[st.length] = new STEntry('F', 48, 013);
st[st.length] = new STEntry('F', 51, 012);
st[st.length] = new STEntry('F', 54, 011);
st[st.length] = new STEntry('F', 57, 010);

st[st.length] = new STEntry('G', 12, 073);
st[st.length] = new STEntry('G', 15, 056);
st[st.length] = new STEntry('G', 18, 044);
st[st.length] = new STEntry('G', 21, 037);
st[st.length] = new STEntry('G', 24, 032);
st[st.length] = new STEntry('G', 27, 029);
st[st.length] = new STEntry('G', 30, 026);
st[st.length] = new STEntry('G', 33, 024);
st[st.length] = new STEntry('G', 36, 021);
st[st.length] = new STEntry('G', 39, 019);
st[st.length] = new STEntry('G', 42, 018);
st[st.length] = new STEntry('G', 45, 017);
st[st.length] = new STEntry('G', 48, 016);
st[st.length] = new STEntry('G', 51, 015);
st[st.length] = new STEntry('G', 54, 014);
st[st.length] = new STEntry('G', 57, 013);

st[st.length] = new STEntry('H', 12, 087);
st[st.length] = new STEntry('H', 15, 066);
st[st.length] = new STEntry('H', 18, 052);
st[st.length] = new STEntry('H', 21, 043);
st[st.length] = new STEntry('H', 24, 038);
st[st.length] = new STEntry('H', 27, 033);
st[st.length] = new STEntry('H', 30, 030);
st[st.length] = new STEntry('H', 33, 027);
st[st.length] = new STEntry('H', 36, 025);
st[st.length] = new STEntry('H', 39, 022);
st[st.length] = new STEntry('H', 42, 020);
st[st.length] = new STEntry('H', 45, 019);
st[st.length] = new STEntry('H', 48, 018);
st[st.length] = new STEntry('H', 51, 017);
st[st.length] = new STEntry('H', 54, 016);
st[st.length] = new STEntry('H', 57, 015);

st[st.length] = new STEntry('I', 12, 101);
st[st.length] = new STEntry('I', 15, 076);
st[st.length] = new STEntry('I', 18, 061);
st[st.length] = new STEntry('I', 21, 050);
st[st.length] = new STEntry('I', 24, 043);
st[st.length] = new STEntry('I', 27, 038);
st[st.length] = new STEntry('I', 30, 034);
st[st.length] = new STEntry('I', 33, 031);
st[st.length] = new STEntry('I', 36, 028);
st[st.length] = new STEntry('I', 39, 025);
st[st.length] = new STEntry('I', 42, 023);
st[st.length] = new STEntry('I', 45, 022);
st[st.length] = new STEntry('I', 48, 020);
st[st.length] = new STEntry('I', 51, 019);
st[st.length] = new STEntry('I', 54, 018);
st[st.length] = new STEntry('I', 57, 017);

st[st.length] = new STEntry('J', 12, 116);
st[st.length] = new STEntry('J', 15,  87);
st[st.length] = new STEntry('J', 18,  70);
st[st.length] = new STEntry('J', 21,  57);
st[st.length] = new STEntry('J', 24,  48);
st[st.length] = new STEntry('J', 27,  43);
st[st.length] = new STEntry('J', 30,  38);
st[st.length] = new STEntry('J', 33,  34);
st[st.length] = new STEntry('J', 36,  32);
st[st.length] = new STEntry('J', 39,  28);
st[st.length] = new STEntry('J', 42,  26);
st[st.length] = new STEntry('J', 45,  24);
st[st.length] = new STEntry('J', 48,  23);
st[st.length] = new STEntry('J', 51,  22);
st[st.length] = new STEntry('J', 54,  20);
st[st.length] = new STEntry('J', 57,  19);

st[st.length] = new STEntry('K', 12, 138);
st[st.length] = new STEntry('K', 15, 099);
st[st.length] = new STEntry('K', 18, 079);
st[st.length] = new STEntry('K', 21, 064);
st[st.length] = new STEntry('K', 24, 054);
st[st.length] = new STEntry('K', 27, 047);
st[st.length] = new STEntry('K', 30, 043);
st[st.length] = new STEntry('K', 33, 038);
st[st.length] = new STEntry('K', 36, 035);
st[st.length] = new STEntry('K', 39, 031);
st[st.length] = new STEntry('K', 42, 029);
st[st.length] = new STEntry('K', 45, 027);
st[st.length] = new STEntry('K', 48, 026);
st[st.length] = new STEntry('K', 51, 024);
st[st.length] = new STEntry('K', 54, 022);
st[st.length] = new STEntry('K', 57, 021);

st[st.length] = new STEntry('L', 12, 161);
st[st.length] = new STEntry('L', 15, 111);
st[st.length] = new STEntry('L', 18, 088);
st[st.length] = new STEntry('L', 21, 072);
st[st.length] = new STEntry('L', 24, 061);
st[st.length] = new STEntry('L', 27, 053);
st[st.length] = new STEntry('L', 30, 048);
st[st.length] = new STEntry('L', 33, 042);
st[st.length] = new STEntry('L', 36, 039);
st[st.length] = new STEntry('L', 39, 035);
st[st.length] = new STEntry('L', 42, 032);
st[st.length] = new STEntry('L', 45, 030);
st[st.length] = new STEntry('L', 48, 028);
st[st.length] = new STEntry('L', 51, 026);
st[st.length] = new STEntry('L', 54, 025);
st[st.length] = new STEntry('L', 57, 024);

st[st.length] = new STEntry('M', 12, 187);
st[st.length] = new STEntry('M', 15, 124);
st[st.length] = new STEntry('M', 18, 097);
st[st.length] = new STEntry('M', 21, 080);
st[st.length] = new STEntry('M', 24, 068);
st[st.length] = new STEntry('M', 27, 058);
st[st.length] = new STEntry('M', 30, 052);
st[st.length] = new STEntry('M', 33, 047);
st[st.length] = new STEntry('M', 36, 043);
st[st.length] = new STEntry('M', 39, 038);
st[st.length] = new STEntry('M', 42, 035);
st[st.length] = new STEntry('M', 45, 032);
st[st.length] = new STEntry('M', 48, 031);
st[st.length] = new STEntry('M', 51, 029);
st[st.length] = new STEntry('M', 54, 027);
st[st.length] = new STEntry('M', 57, 026);

st[st.length] = new STEntry('N', 12, 213);
st[st.length] = new STEntry('N', 15, 142);
st[st.length] = new STEntry('N', 18, 107);
st[st.length] = new STEntry('N', 21, 087);
st[st.length] = new STEntry('N', 24, 073);
st[st.length] = new STEntry('N', 27, 064);
st[st.length] = new STEntry('N', 30, 057);
st[st.length] = new STEntry('N', 33, 051);
st[st.length] = new STEntry('N', 36, 046);
st[st.length] = new STEntry('N', 39, 040);
st[st.length] = new STEntry('N', 42, 038);
st[st.length] = new STEntry('N', 45, 035);
st[st.length] = new STEntry('N', 48, 033);
st[st.length] = new STEntry('N', 51, 031);
st[st.length] = new STEntry('N', 54, 029);
st[st.length] = new STEntry('N', 57, 028);

////////////////////////////

$(document).ready(function() {

	$("#iDuikDiepte").change(function() {calcDP($(this))});
	$("#iDuiktijd").change(function() {calcDP($(this))});
	$("#iKoude").change(function() {calcDP($(this))});
	$("#iRuweZee").change(function() {calcDP($(this))});
	$("#iInspanning").change(function() {calcDP($(this))});
	$("#iSaturatie").change( function(){ calcDP($(this))});
	$("#iTussentijd").change( function(){ calcDP($(this))});
	$("#iGOV").change( function(){ calcDP($(this))});

	$("#iDuikDiepte").keyup(function() {calcDP($(this))});
	$("#iDuiktijd").keyup(function() {calcDP($(this))});
	$("#iKoude").keyup(function() {calcDP($(this))});
	$("#iRuweZee").keyup(function() {calcDP($(this))});
	$("#iInspanning").keyup(function() {calcDP($(this))});
	$("#iSaturatie").keyup( function(){ calcDP($(this))});
	$("#iTussentijd").keyup( function(){ calcDP($(this))});
	$("#iGOV").keyup( function(){ calcDP($(this))});

	$("#iKoude").mouseup(function() {calcDP($(this))});
	$("#iRuweZee").mouseup(function() {calcDP($(this))});
	$("#iInspanning").mouseup(function() {calcDP($(this))});

	calcDP();
});


function calcDP() {
	stop_03 = 0;			// [min]
	stop_06 = 0;			// [min]
	stop_09 = 0;			// [min]
	stop_12 = 0;			// [min]
	stop_safety = 5;		// [min]

	var duikdiepte = $("#iDuikDiepte").val();
	var duiktijd = $("#iDuiktijd").val();
	var koude = $("#iKoude").is(':checked');
	var ruwezee = $("#iRuweZee").is(':checked');
	var inspanning = $("#iInspanning").is(':checked');
	var gov = $("#iGOV").val();

	var startsaturatie = $("#iSaturatie").val();
	var tussentijd = $("#iTussentijd").val();

	////////////////////////////

	duikdiepte = duikdiepte.replace(/,/,".");
	duiktijd = duiktijd.replace(/,/,".");
	gov = gov.replace(/,/,".");

	////////////////////////////
	//Validatie...
	////////////////////////////

	if(isNaN(duikdiepte ) || isNaN(duiktijd )  || isNaN(gov )|| duikdiepte *1<1 || duikdiepte *1>90 || duiktijd *1<0) {
		$("#oSaturatie").html('n/a');
		$("#oStijgTijd").html('n/a');
		$("#oStopTijden").html('n/a');
		$("#oVerbuik").html('n/a');

		$('#oFormula').html('n/a');

		return(false);
	}

	$('#iTussentijd').removeAttr("disabled");
	if (startsaturatie=='0') {
		$("#iTussentijd").attr("disabled", true);
	}

	$('#oBetween').html("n/a");
	if ((startsaturatie*1)!=0 && tussentijd<10) {
		$('#oFormula').html('Tijd sinds vorige duik moet minimaal 10 min zijn');

		return(false);
		} else {
		$('#oBetween').html(pad2(Math.floor(tussentijd/60))+":"+pad2(tussentijd%60));
	}

	////////////////////////////
	//Restsaturatie...
	////////////////////////////

	aRestSat = 'n/a';
	if (startsaturatie!='0') {
		// && !isNaN(tussentijd
		for (entry in tt) {
			if (tt[entry].startsat==startsaturatie && tt[entry].between>tussentijd) {
				aRestSat = tt[entry].endsat;
			}
		}
	}
	$("#oRestSat").html(jQuery.sprintf("%s",aRestSat));

	////////////////////////////

	duikdiepte = duikdiepte *1;
	duiktijd = duiktijd *1;
	gov = gov * 1;
	koude = koude==1;

	////////////////////////////
	//Straftijd...
	////////////////////////////

	tmpdepth = -1;
	for (entry in table) {
		if (table[entry].depth>=duikdiepte && table[entry].duration>=duiktijd) {
			tmpdepth = table[entry].depth;
			break;
		}
	}

	aPenalty = 0;
	for (entryst in st) {
		if (st[entryst].depth==tmpdepth && st[entryst].saturation==aRestSat) {
			//console.log("Match: "+st[entryst].saturation+" "+st[entryst].depth+" "+st[entryst].penalty);
			//console.log("Match: "+tmpdepth);

			aPenalty=st[entryst].penalty;

			break;
		}
	}
	//console.log(aPenalty);
	$("#oPenalty").html(jQuery.sprintf("%s",aPenalty));

	////////////////////////////
	//Calculate Dive...
	////////////////////////////

	index = -1;
	for (entry in table) {
		if (table[entry].depth>=duikdiepte && table[entry].duration>=duiktijd + aPenalty) {
			index = entry;
			break;
		}
	}

	////////////////////////////
	//Take next depth when available and cold/work
	////////////////////////////

	if (koude || inspanning) {
		//Check if still the same depth...
		if (index+1!=table.length &&
		table[1*index+1].depth==table[index].depth) {
			index++;
			} else {
			index = -1;
		}
	}

	////////////////////////////
	//Show Results
	////////////////////////////

	if (index==-1) {
		$("#oSaturatie").html('n/a');
		$("#oStijgTijd").html('n/a');
		$("oStopTijden").html('n/a');
		$("oVerbruik").html('n/a');

		$('#oFormula').html('n/a');

		return(false);
	}

	aSaturatie = table[index].getSaturation(koude);
	aStijgtijd = table[index].getAscendTime(duikdiepte);
	aStoptijd  = table[index].getStopTime(ruwezee, koude);


	$("#oStijgTijd").html(jQuery.sprintf("%d",aStijgtijd));
	$("#oSaturatie").html(jQuery.sprintf("%s",aSaturatie));
	$("#oStopTijden").html(jQuery.sprintf("%s",aStoptijd));
	$("#oDuikDuur").html(jQuery.sprintf("%d", duiktijd + aStijgtijd + aStoptijd));

	if (aPenalty==0) {
		$('#oFormula').html('<br />Toelichting:\r\n<pre>' +
		'Gebruikte regel uit Nelos (US Navy \'93) tabel: '+table[index].depth+' meter en '+table[index].duration+ ' min.\r\n\r\n'+
		table[index].getDeco(ruwezee, koude)+'</pre>');
		} else {
		$('#oFormula').html('<br />Toelichting:\r\n<pre>' +
		'Gebruikte regel uit Nelos (US Navy \'93) tabel: '+table[index].depth+' meter en '+ aPenalty + '+' +table[index].duration+ ' = '+(aPenalty+table[index].duration)+' min.\r\n\r\n'+
		table[index].getDeco(ruwezee, koude)+'</pre>');
	}

	changed = false;

	if (divetime!=duiktijd)
	{
		changed = true;
		divetime 	= duiktijd;
	}

	if (depth!=duikdiepte)
	{
		changed = true;
		depth 		= duikdiepte;
	}

	if (stop_12!=table[index].stop12)
	{
		changed = true;
		stop_12 = table[index].stop12;
	}

	if (stop_09!=table[index].stop9)
	{
		changed = true;
		stop_09 = table[index].stop9;
	}

	if (stop_06!=table[index].stop6)
	{
		changed = true;
		stop_06	= table[index].stop6;
	}

	if (table[index].stop3!=0)
	{
		//Compensate for rough sea
		if (ruwezee) {
			if (stop_06!=stop_06+2*table[index].stop3)
			{
				changed = true;
				stop_06	+= 2*table[index].stop3;
			}
		} else {
			if (stop_03!=table[index].stop3)
			{
				changed = true;
				stop_03	= table[index].stop3;
			}
		}
	}

	// No additional SafetyStop when making Decostops or Cold.
	if (koude || isdecodive()) {
		if (stop_safety!=0)
		{
			changed = true;
			stop_safety = 0;
		}
		} else {
		if (stop_safety!=5)
		{
			changed = true;
			stop_safety = 5;
		}
	}


//	if (stop_12!=0 || stop_09!=0 || stop_06!=0 || stop_03!=0) {
//		stop_safety=0;
//	}

	// Calculate Air Usage as:
	// pressure@depth * gov * time.
	// pressure_halfway_depth * gov * time (so not halfway until first decostop).
	// presure@stops * gov * stoptime.
        aDruk = ((duikdiepte / 10) + 1);

	aVerbruik = 0;
	aVerbruik = aVerbruik + gov * aDruk * duiktijd;
	aVerbruik = aVerbruik + gov * 0.5 * (aDruk + 1)  * aStijgtijd;

        if (stop_12) {
	        aDruk = ((12 / 10) + 1);
		aVerbruik = aVerbruik + gov * aDruk * stop_12;
	}

        if (stop_09) {
	        aDruk = ((9 / 10) + 1);
		aVerbruik = aVerbruik + gov * aDruk * stop_09;
	}

        if (stop_06) {
	        aDruk = ((6 / 10) + 1);
		aVerbruik = aVerbruik + gov * aDruk * stop_06;
	}

        if (stop_03) {
		aDruk = ((3 / 10) + 1);
		aVerbruik = aVerbruik + gov * aDruk * stop_03;
	}

        if (stop_safety) {
		aDruk = ((5 / 10) + 1);
		aVerbruik = aVerbruik + gov * aDruk * stop_safety;
	}

	$("#oVerbruik").html(jQuery.sprintf("%d",aVerbruik));

	//google.load("visualization", "1", {packages:["imagechart"]});
	//google.setOnLoadCallback(onLoadCallback);
	//if (changed) {
		onLoadCallback();
	//}

	return index;
}
