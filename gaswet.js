$(document).ready(function() {
	
	$("#iP1").change(function() {calcVGW($(this))});
	$("#iV1").change(function() {calcVGW($(this))});
	$("#iT1").change(function() {calcVGW($(this))});
	
	$("#iP2").change(function() {calcVGW($(this))});
	$("#iV2").change(function() {calcVGW($(this))});
	$("#iT2").change(function() {calcVGW($(this))});
	
	$("#iUnknown").change(function() {calcVGW($(this))});
	
	$("#iP1").keyup(function() {calcVGW($(this))});
	$("#iV1").keyup(function() {calcVGW($(this))});
	$("#iT1").keyup(function() {calcVGW($(this))});
	
	$("#iP2").keyup(function() {calcVGW($(this))});
	$("#iV2").keyup(function() {calcVGW($(this))});
	$("#iT2").keyup(function() {calcVGW($(this))});
	
	$("#iUnknown").keyup(function() {calcVGW($(this))});
	
	calcVGW();
	});

function calcVGW() {
	
	var P1 = $("#iP1").val();
	var V1 = $("#iV1").val();
	var T1 = $("#iT1").val();
	
	var P2 = $("#iP2").val();
	var V2 = $("#iV2").val();
	var T2 = $("#iT2").val();
	var Unknown = $("#iUnknown").val();
	
	P1 = P1.replace(/,/,".");
	V1 = V1.replace(/,/,".");
	T1 = T1.replace(/,/,".");
	
	P2 = P2.replace(/,/,".");
	V2 = V2.replace(/,/,".");
	T2 = T2.replace(/,/,".");
	
	if(isNaN(P1) || isNaN(V1) || isNaN(T1) ) {
		$("#oP1").text('n/a');
		$("#oV1").text('n/a');
		$("#oT1").text('n/a');
		$("#oP2").text('n/a');
		$("#oV2").text('n/a');
		$("#oT2").text('n/a');
		
		$('#oFormula').html('n/a');
		
		return(false);
	}
	
	c		= P1*V1/T1;
	
	hPV 	= 'P*V';
	hPVT 	= 'P*V\/T';
	
	hP1		= 'P<sub>1</sub>';
	hV1		= 'V<sub>1</sub>';
	hT1		= 'T<sub>1</sub>';
	hPV1	= '<font color="blue">('+hP1+'*'+hV1+')</font>';
	hPVT1	= '<font color="blue">('+hP1+'*'+hV1+')\/'+hT1+'</font>';
	
	hP2		= 'P<sub>2</sub>';
	hV2		= 'V<sub>2</sub>';
	hT2		= 'T<sub>2</sub>';
	hPV2 	= '<font color="blue">('+hP2+'*'+hV2+')</font>';
	hPVT2 	= '<font color="blue">('+hP2+'*'+hV2+')\/'+hT2+'</font>';
	
	if (T1==T2) {
		$("#oC").text(jQuery.sprintf("%.1f",c * T1));
		} else {
		$("#oC").text(jQuery.sprintf("%.2f",c));
		}	
	
	$('#iP2').removeAttr("disabled");
	$('#iV2').removeAttr("disabled");
	$('#iT2').removeAttr("disabled");
	
	switch (Unknown) {
		case "P2" :
		P2 = c * T2 / V2;
		//if (P2!=P1) {
			//	P2 = jQuery.sprintf("%.1f",P2)/*+"<br />("+jQuery.sprintf("%.1f",(P2-P1))+")"*/;
			//} else {
			P2 = jQuery.sprintf("%.1f",P2);
		//}
		
		if (T1==T2) {
			$('#oFormula').html(
			'<br />' +
			'<ol>' +
			'<li>' + hPV +                    ' = constant<p /></li>' +
			'<li>' + hPV1 +                   ' = ' + hP2 + '*' + hV2 + '</li>' +
			'<li>' + hPV1 + '<b>/'+ hV2 + '</b> = ' + hP2 +'</li>' +
			'</ol>');
			} else {
			$('#oFormula').html(
			'<br />' +
			'<ol>' +
			'<li>' + hPVT +                                     ' = constant<p /></li>' +
			'<li>' + hPVT1 +                                    ' = ' + hPVT2 + '</li>' +
			'<li><b>' + hT2 + '</b> * ' + hPVT1 +               ' = ' + hP2 + '*' + hV2 + '</li>' +
			'<li>(<b>' + hT2 + '/' + hV2 + '</b>) * ' + hPVT1 + ' = ' + hP2 + '</li>' +
			'</ol>');
		}
		
		break;
		
		case "V2" :
		V2 = c * T2 / P2;
		//if (V2!=V1) {
			//	V2 = jQuery.sprintf("%.1f",V2)+" ("+jQuery.sprintf("%.1f",(V2-V1))+")";
			//} else {
			V2 = jQuery.sprintf("%.1f",V2);
		//}
		
		if (T1==T2) {
			$('#oFormula').html(
			'<br />' +
			'<ol>' +
			'<li>' + hPV +                    ' = constant<p /></li>' +
			'<li>' + hPV1 +                   ' = ' + hPV2 + '</li>'+
			'<li>' + hPV1 + '<b>/'+ hP2 + '</b> = '+ hV2 +
			'</ol>');
			} else {
			$('#oFormula').html(
			'<br />' +
			'<ol>' +
			'<li>' + hPVT +                                 ' = constant<p /></li>' +
			'<li>' + hPVT1 +                                ' = ' + hPVT2 + '</li>' +
			'<li><b>' + hT2+ '</b> * '+ hPVT1 +             ' = '+ hP2 + '*'+ hV2 +
			'<li>(<b>' + hT2+ '/'+hP2 + '</b>) * '+ hPVT1 + ' = '+ hV2 +
			'</ol>');
		}
		
		break;
		
		case "T2" :
		T2 = (P2 * V2) / c;
		//if (T2!=T1) {
			//	T2 = jQuery.sprintf("%.1f",T2)+" ("+jQuery.sprintf("%.1f",(T2-T1))+")";
			//} else {
			T2 = jQuery.sprintf("%.1f",T2);
		//}
		
		$('#oFormula').html(
		'<br />' +
		'<ol>' +
		'<li>' + hPVT +                                                             ' = constant<p /></li>' +
		'<li>' + hPVT1 +                                                            ' = ' + hPVT2 + '</li>' +
		'<li>' + hT1 + '/(' + hP1 + '*' + hV1 + ') ' +                              ' = ' + hT2 + '/(' + hP2 + '*' + hV2 + ')' +
		'<li>(<b>' + hP2 + '*' + hV2 + '</b>) * ' + hT1 + '/(' + hP1 + '*' + hV1 + ') = ' + hT2 +
		'</ol>');
		
		break;
	}
	
	$("#oP1").text(jQuery.sprintf("%.1f",P1));
	$("#oV1").text(jQuery.sprintf("%.1f",V1));
	$("#oT1").text(jQuery.sprintf("%d",T1));
	$("#oP2").html(P2);
	$("#oV2").html(V2);
	$("#oT2").html(T2);
	
	$("#oP2").css({ fontWeight:"normal" });
	$("#oV2").css({ fontWeight:"normal" });
	$("#oT2").css({ fontWeight:"normal" });
	
	switch (Unknown) {
		case "P2" :
		$("#oP2").css({ fontWeight:"bold" });
		$("#iP2").attr("disabled", true);
		break;
		case "V2" :
		$("#oV2").css({ fontWeight:"bold" });
		$("#iV2").attr("disabled", true);
		break;
		case "T2" :
		$("#oT2").css({ fontWeight:"bold" });
		$("#iT2").attr("disabled", true);
		break;
	}
}
