$(document).ready(function() {

	$("#iDiepte").change(function() {calcELD($(this))});
	$("#iNitrox").change(function() {calcELD($(this))});
	$("#iMaxPPo2").change(function() {calcELD($(this))});

	$("#iDiepte").keyup(function() {calcELD($(this))});
	$("#iNitrox").keyup(function() {calcELD($(this))});
	$("#iMaxPPo2").keyup(function() {calcELD($(this))});
	calcELD();
	});

function calcELD() {

	var diepte = $("#iDiepte").val();
	var nitrox = $("#iNitrox").val();
	var ppo2 = $("#iMaxPPo2").val();

	diepte = diepte.replace(/,/,".");
	nitrox = nitrox.replace(/,/,".");
	ppo2   = ppo2.replace(/,/,".");

	if(isNaN(diepte) || isNaN(nitrox) || isNaN(ppo2) ) {
		$("#oEld").text('0.00');
		$("#oppO2").text('0.00');
		$("#oppN2").text('0.00');
		$("#oMaxDiepte").text('0.00');
		$("#oAbsDruk").text('0.00');
		$("#omaxNitrox").text('0.00');

		$('#oFormula').html('n/a');

		return(false);
	}

	diepte = diepte * 1;
	nitrox = nitrox * 1;
	ppo2 = ppo2 * 1;

	var apabs = (diepte+10)/10;
	var aeld = ((100-nitrox) * (diepte+10)/79)-10;
	var appo2 = apabs * nitrox/100;
	var appn2 = apabs * (1-(nitrox/100));
	var amax  = (ppo2 / (nitrox/100)-1) * 10;
	var amaxnitrox = 100*(ppo2/apabs);

	if (aeld>0) {
		$("#oEld").text(jQuery.sprintf("%.2f",aeld));
		} else {
		$("#oEld").text("n/a");
	}
	$("#oppO2").text(jQuery.sprintf("%.2f",appo2));
	$("#oppN2").text(jQuery.sprintf("%.2f",appn2));
	$("#oMaxDiepte").text(jQuery.sprintf("%.2f",amax));
	$("#oAbsDruk").text(jQuery.sprintf("%.2f",apabs));
	if (amaxnitrox<=100) {
		$("#omaxNitrox").text(jQuery.sprintf("%d",amaxnitrox));
		} else {
		$("#omaxNitrox").text("n/a");
	}

	$('#oFormula').html(
	'<br />' +
	'<ol>' +
	'<li>(<b>stikstof percentage in nitrox</b> * (diepte+10)=<b>stikstof percentage in lucht</b> * (<font color="blue">ELD</font>+10)'+
	'<li><font color="blue">ELD</font>=(<b>stikstof percentage in nitrox</b> * (diepte+10)/<b>stikstof percentage in lucht</b>) - 10'+
	'<li><font color="blue">ELD</font>=((<b>100 - zuurstof percentage in nitrox</b>) * (diepte+10)/<b>79</b>) - 10'+
	'<li><font color="blue">ELD</font>=((100 - <b>' + nitrox + '</b>) * (<b>' + diepte + '</b>+10)/79) - 10'+
	'<li><font color="blue">ELD</font>=(<b>' + (100 - nitrox) + '</b> * <b>' + ( diepte + 10) + '</b>/79) - 10'+
	'<li><font color="blue">ELD</font>='+$("#oEld").text()+
	'</ol>');

}
