$(document).ready(function() {
	
	$("#iHoogte").change(function() {calcSD($(this))});
	$("#iDiepte").change(function() {calcSD($(this))});
	$("#iDrukZn").change(function() {calcSD($(this))});
	$("#iSnelheidZn").change(function() {calcSD($(this))});
	$("#iNitrox").change(function() {calcSD($(this))});
	
	$("#iHoogte").keyup(function() {calcSD($(this))});
	$("#iDiepte").keyup(function() {calcSD($(this))});
	$("#iDrukZn").keyup(function() {calcSD($(this))});
	$("#iSnelheidZn").keyup(function() {calcSD($(this))});
	$("#iNitrox").keyup(function() {calcSD($(this))});
	
	calcSD();
	});

function calcSD() {
	
	var dieptezn = $("#iDiepte").val();
	var hoogtebm = $("#iHoogte").val();
	var drukzn = $("#iDrukZn").val();
	var snelheidzn = $("#iSnelheidZn").val();
	var nitrox = $("#iNitrox").val();
	
	dieptezn = dieptezn.replace(/,/,".");
	hoogtebm = hoogtebm.replace(/,/,".");
	drukzn = drukzn.replace(/,/,".");
	snelheidzn = snelheidzn.replace(/,/,".");
	nitrox = nitrox.replace(/,/,".");
	
	if(isNaN(dieptezn) || isNaN(hoogtebm) || isNaN(drukzn) || isNaN(snelheidzn) || isNaN(nitrox) || dieptezn*1<1 || hoogtebm*1<0 || hoogtebm*1>5000) {
		$("#oDrukBm").text('n/a');
		$("#oCoefficient").text('n/a');
		$("#oPercentage").text('n/a');		
		$("#oDiepteBm").text('n/a');
		$("#oSnelheidBm").text('10.0');
		$("#oTrap3").text('3.0');
		$("#oTrap6").text('6.0');
		$("#oTrap9").text('9.0');
		$("#oTrap12").text('12.0');
		
		$('#oFormula').html('n/a');
		
		return(false);
	}
	
	dieptezn = dieptezn*1;
	hoogtebm = hoogtebm*1;
	drukzn = drukzn*1;
	snelheidzn = snelheidzn*1;
	nitrox = nitrox*1;
	
	var adrukbm = drukzn - (hoogtebm/1000)*100;
	var acoeff = drukzn/adrukbm;
	var apercentage = ((Math.round(acoeff*100)/100)*100)-100; //Make Sure answers match
	var adieptebm = 1.0*(dieptezn*acoeff);
	var asnelheidbm = 1.0*(snelheidzn/acoeff);
	var atrap3 = 3.0/acoeff;
	var atrap6 = 6.0/acoeff;
	var atrap9 = 9.0/acoeff;
	var atrap12 = 12.0/acoeff;
	
	$("#oDrukBm").text(jQuery.sprintf("%d",adrukbm));
	$("#oCoefficient").text(jQuery.sprintf("%.2f",acoeff));
	$("#oPercentage").text(jQuery.sprintf("%d",apercentage));
	$("#oDiepteBm").text(jQuery.sprintf("%.1f",adieptebm));
	$("#oSnelheidBm").text(jQuery.sprintf("%.1f",asnelheidbm));
	$("#oTrap3").text(jQuery.sprintf("%.1f",atrap3));
	$("#oTrap6").text(jQuery.sprintf("%.1f",atrap6));
	$("#oTrap9").text(jQuery.sprintf("%.1f",atrap9));
	$("#oTrap12").text(jQuery.sprintf("%.1f",atrap12));
	
	$('#oFormula').html(
	'<br />' +
	'<ol>' +
	'<li>Luchtdruk op hoogte   = luchtdruk zeeniveau - (100 mBar per 1000 m) = <b>'+drukzn+'</b> - (100 * <b>'+Math.round(100*hoogtebm/1000)/100+'</b>)'+
	'<li>Co&euml;ffici&euml;nt = luchtdruk zeeniveau / luchtdruk op hoogte = <b>'+drukzn+'</b> / <b>'+adrukbm+'</b> = <b>'+Math.round(acoeff*100)/100+'</b>'+
	'<li>Schijnbare duikdiepte = werkelijke diepte * co&euml;ffici&euml;nt = <b>'+dieptezn+'</b> * <b>'+Math.round(acoeff*100)/100+'</b>'+
	'<li>Stijgsnelheid op hoogte = stijgsnelheid zeeniveau / co&euml;ffici&euml;nt = <b>'+snelheidzn+'</b> / <b>'+Math.round(acoeff*100)/100+'</b>'+
	'<li>Trapdieptes op hoogte = trapdiepte zeeniveau / co&euml;ffici&euml;nt'+
	/*
	'<li><font color="yellow">ELD</font>=(<b>stikstof percentage in nitrox</b> * (diepte+10)/<b>stikstof percentage in lucht</b>) - 10'+
	'<li><font color="yellow">ELD</font>=((<b>100 - zuurstof percentage in nitrox</b>) * (diepte+10)/<b>79</b>) - 10'+
	'<li><font color="yellow">ELD</font>=((100 - <b>' + nitrox + '</b>) * (<b>' + diepte + '</b>+10)/79) - 10'+
	'<li><font color="yellow">ELD</font>=(<b>' + (100 - nitrox) + '</b> * <b>' + ( diepte + 10) + '</b>/79) - 10'+
	'<li><font color="yellow">ELD</font>='+$("#oEld").text()+
	*/
	'</ol>');
}
