$(document).ready(function() {
	
	$("#iSgMateriaal").change( function(){ DoCalculate($(this))});
	$("#iCapaciteit").change( function() { DoCalculate($(this))});
	$("#iVulDruk").change( function() 	 { DoCalculate($(this))});
	$("#iGewichtFles").change( function(){ DoCalculate($(this))});
	$("#iSgWater").change( function()	 { DoCalculate($(this))});
	
	$("#iSgMateriaal").keyup( function() { DoCalculate($(this))});
	$("#iCapaciteit").keyup( function()  { DoCalculate($(this))});
	$("#iVulDruk").keyup( function() 	 { DoCalculate($(this))});
	$("#iGewichtFles").keyup( function() { DoCalculate($(this))});
	$("#iSgWater").keyup( function() 	 { DoCalculate($(this))});
	
	DoCalculate();
	});

function DoCalculate() {
	
	//Constants
	//Allow choice of Nitrox too...
	
	var cSGAir 	= 0.001293;
	
	//Input
	var aCapaciteit	= $("#iCapaciteit").val().replace(/,/,".");
	var aPressure 	= $("#iVulDruk").val().replace(/,/,".");
	
	//Add Sg Carbon too..
	var aSgMateriaal= $("#iSgMateriaal").val().replace(/,/,".");
	var aGewichtFles= $("#iGewichtFles").val().replace(/,/,".");
	var aSgWater 	= $("#iSgWater").val().replace(/,/,".");
	
	//Intermediate Results and Output
	if( isNaN(aCapaciteit) 	|| aCapaciteit 	== "" ||
	isNaN(aPressure) 	|| aPressure 	== "") 
	{
		$("#oGewichtVulling").text('n/a');	
		} else {
		aCapaciteit	= 1.0 * aCapaciteit;
		aPressure 	= 1.0 * aPressure;
		
		var aGewichtVulling	= cSGAir * aPressure * aCapaciteit;
		var aGewichtReserve= cSGAir * 50 * aCapaciteit;
		
		$("#oGewichtVulling").text(jQuery.sprintf("%.2f",aGewichtVulling));
	}
	
	//Inhoud + Gewicht => volume fleswand
	
	if( isNaN(aCapaciteit) 	|| aCapaciteit 	== "" ||
	isNaN(aGewichtFles) || aGewichtFles == "") 
	{
		$("#oVolumeMateriaal").text('n/a');
		} else {
		aSgMateriaal= 1.0 * aSgMateriaal;
		aGewichtFles= 1.0 * aGewichtFles;
		aSgWater 	= 1.0 * aSgWater;
		
		var aVolume = (aGewichtFles / aSgMateriaal) + aCapaciteit;
		
		$("#oVolumeMateriaal").text(jQuery.sprintf("%.2f",aGewichtFles / aSgMateriaal));
	}
	
	if( isNaN(aCapaciteit) 	|| aCapaciteit 	== "" ||
	isNaN(aGewichtFles) || aGewichtFles == "" ||
	isNaN(aPressure) 	|| aPressure 	== "") 
	{
		$("#oTotaalVolume").text('n/a');
		$("#oLiftLeeg").text('n/a');
		$("#oLiftVol").text('n/a');
		$("#oLiftReserve").text('n/a');
		$("#oTotaalGewicht").text('n/a');		
		
		$('#oFormula').html('n/a');
		
		return(false);
		} else {
		aSgMateriaal= 1.0 * aSgMateriaal;
		aGewichtFles= 1.0 * aGewichtFles;
		aSgWater 	= 1.0 * aSgWater;
		
		var aVolume 		= (aGewichtFles / aSgMateriaal) + aCapaciteit;
		var aWaterWeight 	= aVolume * aSgWater;
		
		$("#oTotaalVolume").text(jQuery.sprintf("%.2f",aVolume));
		$("#oLiftLeeg").text(jQuery.sprintf("%.2f",aWaterWeight - aGewichtFles));
		$("#oLiftVol").text(jQuery.sprintf("%.2f",aWaterWeight - aGewichtFles - aGewichtVulling));
		$("#oLiftReserve").text(jQuery.sprintf("%.2f",aWaterWeight - aGewichtFles - aGewichtReserve));
		$("#oTotaalGewicht").text(jQuery.sprintf("%.2f",aGewichtFles + aGewichtVulling));	
	}
}