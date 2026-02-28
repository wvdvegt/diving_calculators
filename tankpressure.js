// Load the Visualization API and the piechart package.
//google.load('visualization', '1.0', {'packages':['corechart']});
//google.load('visualization', '1', {'packages':['table']});

// Set a callback to run when the Google Visualization API is loaded.
//google.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.

function drawChart() {
	// Create and populate the data table.
	var data = new google.visualization.DataTable();

	data.addColumn('string', 'Druk [bar]');
	data.addColumn('number', 'Boyle & Mariotte [barL]');
	data.addColumn('number', 'GERG-2004 [barL]');
	data.addColumn('number', 'Afwijking [%]');

	var gerg = new Array();
	gerg[ 0]=   0/10;
	gerg[ 1]=  99/10;
	gerg[ 2]= 199/10;
	gerg[ 3]= 299/10;
	gerg[ 4]= 399/10;
	gerg[ 5]= 499/10;
	gerg[ 6]= 600/10;
	gerg[ 7]= 700/10;
	gerg[ 8]= 800/10;
	gerg[ 9]= 899/10;
	gerg[10]= 998/10;
	gerg[11]=1096/10;
	gerg[12]=1193/10;
	gerg[13]=1289/10;
	gerg[14]=1383/10;
	gerg[15]=1477/10;
	gerg[16]=1569/10;
	gerg[17]=1659/10;
	gerg[18]=1748/10;
	gerg[19]=1835/10;
	gerg[20]=1920/10;
	gerg[21]=2004/10;
	gerg[22]=2086/10;
	gerg[23]=2166/10;
	gerg[24]=2244/10;
	gerg[25]=2321/10;
	gerg[26]=2395/10;
	gerg[27]=2468/10;
	gerg[28]=2539/10;
	gerg[29]=2609/10;
	gerg[30]=2677/10;
	gerg[31]=2742/10;
	gerg[32]=2807/10;
	gerg[33]=2870/10;
	gerg[34]=2931/10;
	gerg[35]=2991/10;

	bottle = 10;

	for (i=0;i<gerg.length;i++) {
		pressure= i*10;
		if (i==0) {
			data.addRow([""+pressure, pressure*bottle, gerg[i]*bottle, 0]);
			} else {
			data.addRow([""+pressure, pressure*bottle, gerg[i]*bottle, Math.round(1000*(pressure*bottle-gerg[i]*bottle)/(pressure*bottle))/10]);
		}
	}

	var options = {
		//title:"",
		curveType: "none",
		width: 720, height: 480,
		chxt: "x,y,r",
		//legend: 'none',
		series: [
		//{visibleInLegend: false, lineWidth: 0},
		{visibleInLegend: true, lineWidth: 1},
		{visibleInLegend: true, lineWidth: 1},
		{visibleInLegend: true, lineWidth: 1, targetAxisIndex: 1, curveType: "none", pointSize : 3}],
		hAxis:
		{title: "Pressure [bar]", format: "#", showTextEvery: 5, textPosition: "out", minValue: 0, maxValue: 350},
		vAxis: [
		{title: "Air [barL]", minValue: 0, maxValue: 4500},
		{title: "[%]", minValue: 0, maxValue: 15, format: "#%" }]
		};

	// Create and draw the visualization.
	new google.visualization.LineChart(document.getElementById('chart_div')).
	draw(data, options);
}
