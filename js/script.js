/// 
/// Automatenminimierer
/// 
/// Dieses Skript minimiert Moore- und Mealy-Automaten. Die Eingänge, Ausgänge
/// und Zustände sowie die Automatentabelle werden vom Benutzer eingegeben.
///
/// Autor: Marvin Klimke
/// Datum: 2016-06-29
///
/// CC-BY-NC

// true : Mealy, false : Moore
var isMealy = false;

// Anzahl Eingänge
var numInput  = 0;

// Anzahl Ausgänge
var numOutput = 0;

// Anzahl Zustände
var numState  = 0;

// Liste der Eingänge
var inputs = [];

// Liste der Ausgänge
var outputs = [];

// Liste der Zustände
var states = [];

// Automatentabelle (mehrdimensionales Array)
var tableau = [];

/// Initialisierung
$(document).ready(function()
{
	// Zweiten und letzten Absatz ausblenden
	$("#numberParams").hide();
	$("#print").hide();

	// Buttons vorbereiten
	$("#cmdMealy").jqxButton({ width: '150', height: '25'});
	$("#cmdMoore").jqxButton({ width: '150', height: '25'});
	$("#cmdPrint").jqxButton({ width: '150', height: '25'});
	$("#cmdStartOver").jqxButton({ width: '150', height: '25'});
	$("#cmdLoadSets").jqxButton({ width: '150', height: '25'});

	// Eingabefelder vorbereiten
	$("#numInput").jqxNumberInput( { width: '250px', height: '25px', allowNull: false, decimalDigits: 0, decimal: 3, min: 1, digits: 2, spinButtons: true, width: '80'});
	$("#numOutput").jqxNumberInput({ width: '250px', height: '25px', allowNull: false, decimalDigits: 0, decimal: 3, min: 1, digits: 2, spinButtons: true, width: '80'});
	$("#numState").jqxNumberInput( { width: '250px', height: '25px', allowNull: false, decimalDigits: 0, decimal: 3, min: 1, digits: 2, spinButtons: true, width: '80'});
	
	// Eventhandler für Ausdruck
	$("#cmdPrint").on('click', function (event)
	{
		window.print();
	});
	
	// Eventhandler für Neubeginn
	$("#cmdStartOver").on('click', function (event)
	{
		location.reload();
	});
	
	// Eventhandler für Beginn mit Mealy-Automet
	$('#cmdMealy').on('click', function (event)
	{
		$("#numberParams").show(); // statischen Inhalt einblenden
		$("#cmdMealy").jqxButton({ disabled : true });
		$("#cmdMoore").jqxButton({ disabled : true });
		isMealy = true;
	});
	
	// Eventhandler für Beginn mit Moore-Automat
	$('#cmdMoore').on('click', function (event)
	{
		$("#numberParams").show(); // statischen Inhalt einblenden
		$("#cmdMealy").jqxButton({ disabled : true });
		$("#cmdMoore").jqxButton({ disabled : true });
	});
	
	// Eventhandler für nächsten Schritt
	$('#cmdLoadSets').on('click', loadSets);
	
});

/// Diese Funktion zeigt dem Benutzer Text-Eingabefelder an und wartet auf
/// Eingaben für die Mengen Eingänge, Ausgänge und Zustände.
/// Vorbelegung: Eingang: X0, X1, ... Ausgang: Y0, Y1, ... Zustand: Z0, Z1, ... 
function loadSets (event)
{
	$("#cmdLoadSets").jqxButton({ disabled : true });
	
	// Eingabefelder für Ganzzahlen
	numInput  = $("#numInput").jqxNumberInput('decimal');
	numOutput = $("#numOutput").jqxNumberInput('decimal');
	numState  = $("#numState").jqxNumberInput('decimal'); 
	
	// Zwischenspeicher für den zukünftigen Inhalt des DIV-Elementes
	var divcontent = "<h3>3. Eingaben, Ausgaben & Zust&auml;nde</h3><p>Bitte geben Sie die Bezeichnungen f&uuml;r die Eingaben, Ausgaben und Zust&auml;nde ein.</p><table>";
	
	divcontent += "<tr><th>Eing&auml;nge</th>";
	for(var i = 0; i < numInput; i++)
	{
		divcontent += "<td><input id='input"+i+"' value='X"+i+"'></td>";
	}
	
	divcontent += "<tr><th>Ausg&auml;nge</th>";
	for(var i = 0; i < numOutput; i++)
	{
		divcontent += "<td><input id='output"+i+"' value='Y"+i+"'></td>";
	}
	
	divcontent += "<tr><th>Zust&auml;nde</th>";
	for(var i = 0; i < numState; i++)
	{
		divcontent += "<td><input id='state"+i+"' value='Z"+i+"'></td>";
	}
	
	divcontent += '</table><p><input type="button" id="cmdFillAutomat" value="Weiter" /></p>';
	
	// Inhalt ins HTML-Dokument einfügen
	$("#paramSets").html(divcontent);
	
	// Alle jqxInput-Instanzen initialisieren
	for(var i = 0; i < numInput; i++)
	{
		$("#input"+i).jqxInput({ width: 100, height: 25, });
	}
	for(var i = 0; i < numOutput; i++)
	{
		$("#output"+i).jqxInput({ width: 100, height: 25, });
	}
	for(var i = 0; i < numState; i++)
	{
		$("#state"+i).jqxInput({ width: 100, height: 25, });
	}
	
	// Button und Eventhandler für nächsten Schritt
	$("#cmdFillAutomat").jqxButton({ width: '150', height: '25'});
	$('#cmdFillAutomat').on('click', fillAutomat);
}

/// Diese Funktion zeigt dem Benutzer eine leere Automatentabelle, die mit den
/// gewünschten Daten gefüllt werden kann.
function fillAutomat (event)
{
	$("#cmdFillAutomat").jqxButton({ disabled : true });
	
	// Daten aus allen Eingabefeldern holen
	for(var i = 0; i < numInput; i++)
	{
		inputs.push($("#input"+i).val());
	}
	for(var i = 0; i < numOutput; i++)
	{
		outputs.push($("#output"+i).val());
	}
	for(var i = 0; i < numState; i++)
	{
		states.push($("#state"+i).val());
	}
	
	if(isMealy) // Mealy
	{
		// Vorbereitung einer Mealy-Automatentabelle in HTML
		var divcontent = '<h3>4. Automatentabelle</h3><p>Bitte bef&uuml;llen Sie die Automatentabelle.</p><table class="bordertable"><tr><th>n</th><th colspan="' + numInput + '">n+1</th></tr>';
		
		// Tabellenkopf beinhaltet die Eingänge
		divcontent += "<tr><th></th>";
		for(var i = 0; i < numInput; i++)
		{
			divcontent += '<th>' + inputs[i] + '</th>';
		}
		divcontent += "</tr>";
		
		// Tabellenkörper beinhaltet neue Zustände und Ausgänge
		for(var i = 0; i < numState; i++)
		{
			divcontent += "<tr><td>" + states[i] + "</td>";
			for(var j = 0; j < numInput; j++)
			{
				divcontent += "<td><div id='jump" + i + "_" + j + "'></div> <div id='out" + i + "_" + j + "'></div></td>";
			}
		}
		
		// Tabellenfuß und Startknopf
		divcontent += '</table><p><input type="button" id="cmdCompute" value="Minimieren!" /></p>';
		
		// Inhalt ins HTML-Dokument einfügen
		$("#fillAutomat").html(divcontent);
		
		// Alle jqxInput-Instanzen initialisieren
		for(var i = 0; i < numState; i++)
		{
			for(var j = 0; j < numInput; j++)
			{
				$("#jump" + i + "_" + j).jqxComboBox({ source: states,  width: '100px', height: '25px' });
				$("#out"  + i + "_" + j).jqxComboBox({ source: outputs, width: '100px', height: '25px' });
			}
			
		}
		
		// Button und Eventhandler für nächsten Schritt
		$("#cmdCompute").jqxButton({ width: '150', height: '25' });
		$("#cmdCompute").on('click', computeMealy);
	}
	else // Moore
	{
		// Vorbereitung einer Moore-Automatentabelle in HTML
		var divcontent = '<h3>4. Automatentabelle</h3><p>Bitte bef&uuml;llen Sie die Automatentabelle.</p><table class="bordertable"><tr><th>n</th><th colspan="' + numInput + '">n+1</th><th>n</th></tr>';
		
		// Tabellenkopf beinhaltet die Eingänge
		divcontent += "<tr><th></th>";
		for(var i = 0; i < numInput; i++)
		{
			divcontent += '<th>' + inputs[i] + '</th>';
		}
		divcontent += "<th></th></tr>";
		
		// Tabellenkörper beinhaltet neue Zustände und Ausgänge am Zeilenende
		for(var i = 0; i < numState; i++)
		{
			divcontent += "<tr><td>" + states[i] + "</td>";
			for(var j = 0; j < numInput; j++)
			{
				divcontent += "<td><div id='jump" + i + "_" + j + "'></div></td>";
			}
			divcontent += "<td><div id='out" + i + "'></div></td></tr>";
		}
		
		// Tabellenfuß und Startknopf
		divcontent += '</table><p><input type="button" id="cmdCompute" value="Minimieren!" /></p>';
		
		// Inhalt ins HTML-Dokument einfügen
		$("#fillAutomat").html(divcontent);
		
		// Alle jqxInput-Instanzen initialisieren
		for(var i = 0; i < numState; i++)
		{
			for(var j = 0; j < numInput; j++)
			{
				$("#jump" + i + "_" + j).jqxComboBox({ source: states, width: '100px', height: '25px' });
			}
			$("#out" + i).jqxComboBox({ source: outputs, width: '100px', height: '25px' });
		}
		
		// Button und Eventhandler für nächsten Schritt
		$("#cmdCompute").jqxButton({ width: '150', height: '25' });
		$("#cmdCompute").on('click', computeMoore);
	}
}

/// Diese Funktion berechnet die Minimierung eines Mealy-Automatens.
function computeMealy (event)
{
	// Reset
    $("#newdef").html("");
    tableau.length = 0;

	// Ausfüllen des mehrdimensionalen Arrays als Automatentabelle
	for(var i = 0; i < numState; i++)
	{
		var states_new = [];
		var out_new = [];
		var classes_old = [];
		
		for(var j = 0; j < numInput; j++)
		{
			states_new[j] = $("#jump" + i + "_" + j).jqxComboBox('getSelectedIndex');
			out_new[j]    = $("#out"  + i + "_" + j).jqxComboBox('getSelectedIndex');
			classes_old[j] = -1;
		}
		
		tableau[i] = { state: states[i], state_new: states_new, cls_old: classes_old, out: out_new, cls: -1, flag: false };
		//             |                 |                      |                     |             |             |
		// Name des Zustands, Neue Zustände (Array), Äq.-Klassen (Array), Ausgänge (Array), Äq.-Klasse der Zeile, Temporär
	}
	
	var divcontent = "<h3>5. Minimierungsschritte</h3>";

	// Automatentabelle ausgeben
	divcontent += printTableauWOCls(tableau, states, numState);
	
	// Bestimmen den K1-Äquivalenzklasse durch Vergleich der Ausgänge
	var index = 0;
	for(var i = 0; i < numState; i++)
	{
		if(tableau[i].flag) // schon bearbeitet?
			continue;
		
		var theout = tableau[i].out;
		
		// Alle folgenden Zeilen auf Äquivalenz prüfen
		for(var j = i; j < numState; j++)
		{
			if(tableau[j].out.equals(theout))
			{
				// In einer K1-Äquivalenzklasse zusammenfassen
				tableau[j].cls = index;
				tableau[j].flag = true;
			}
		}
		
		index++;
	}
	removeFlags(); // Reset der temporären Flags
	
	// Übernehmen der K1-Äquivalenzklassen in die Automatentabelle
	for(var i = 0; i < numState; i++)
	{
		for(var j = 0; j < numInput; j++)
		{
			var sel = tableau[i].state_new[j];
			tableau[i].cls_old[j] = tableau[sel].cls;
		}
	}
	
	// Automatentabelle mit K1-Äquivalenzklassen ausgeben
	divcontent += printTableau(1);
	
	// Bestimmen der Äquivalenzklassen von K2 aufwärts
	var level = 2;
	while(!tablaeuComplete()) // Unterschiede in den Äquivalenzklassen?
	{
		var idx = 0;
		for(var i = 0; i < numState; i++)
		{
			if(tableau[i].flag) // schon bearbeitet?
				continue;
			
			// Merken der eigenen Äquivalenzklasse und aller nächsten Zustände
			var theoldcls = tableau[i].cls_old;
			var thecls = tableau[i].cls;
			
			// Alle folgenden Zeilen auf Äquivalenz prüfen
			for(var j = i; j < numState; j++)
			{
				if( (tableau[j].cls_old.equals(theoldcls)) && (tableau[j].cls == thecls) )
				{
					// Zusammenfassen in Äquivalenzklasse und Flag setzen
					tableau[j].cls = idx;
					tableau[j].flag = true;
				}
			}
			
			idx++;
		}
		removeFlags(); // Reset der temporären Flags
		
		// Übernehmen der Äquivalenzklassen in die Automatentabelle
		for(var i = 0; i < numState; i++)
		{
			for(var j = 0; j < numInput; j++)
			{
				var sel = tableau[i].state_new[j];
				tableau[i].cls_old[j] = tableau[sel].cls;
			}
		}
		
		// Automatentabelle mit aktuellen Äquivalenzklassen ausgeben
		divcontent += printTableau(level);
		
		// Zur nächsten Stufe der Äquivalenzklassen
		level++;
	}
	
	// Vorbereitung für Benennung der neu erzeugten Zustände
	divcontent += "<br><h3>6. Neue Zust&auml;nde erstellen</h3><p>Das Verfahren ist abgeschlossen. Bitte vergeben Sie Namen f&uuml;r die neu zu erstellenden Zust&auml;nde:</p>";
	
	// Namen der Äquivalenzklassen
	divcontent += "<table><tr><th>Klassenalias</th>";
	for(var i = 0; i <= maxCls(); i++)
	{
		divcontent += "<td>K<sup>" + (level-1) + "</sup><sub>" + i + "</sub></td>"; 
	}
	
	// Namen der neuen Zustände
	// Vorbelegung: ZZ0, ZZ1, ...
	divcontent += "</tr><tr><th>Zustand</th>";
	for(var i = 0; i <= maxCls(); i++)
	{
		divcontent += "<td><input id='alias" + i + "' value='ZZ" + i + "'></td>";
	}
	
	// Tabellenfuß und Button für nächsten Schritt
	divcontent += '</tr></table><p><input type="button" id="cmdAlias" value="Weiter" /></p>';
	
	// Inhalt ins HTML-Dokument einfügen
	$("#result").html(divcontent);
	
	// Alle jqxInput-Instanzen initialisieren
	for(var i = 0; i <= maxCls(); i++)
	{
		$("#alias"+i).jqxInput({ width: 100, height: 25, });
	}
	
	// Button und Eventhandler für nächsten Schritt
	$("#cmdAlias").jqxButton({ width: '150', height: '25' });
	$("#cmdAlias").on('click', createAlias);
}

/// Diese Funktion berechnet die Minimierung eines Moore-Automatens.
function computeMoore (event)
{
	// Reset
    $("#newdef").html("");
    tableau.length = 0;

	// Ausfüllen des mehrdimensionalen Arrays als Automatentabelle
	for(var i = 0; i < numState; i++)
	{
		var states_new = [];
		var classes_old = [];
		
		for(var j = 0; j < numInput; j++)
		{
			states_new[j] = $("#jump" + i + "_" + j).jqxComboBox('getSelectedIndex');
			classes_old[j] = -1;
		}
		
		tableau[i] = { state: states[i], state_new: states_new, cls_old: classes_old, out: $("#out" + i).jqxComboBox('getSelectedIndex'), cls: -1, flag: false };
		//             |                 |                      |                     |                                                   |        |
		// Name des Zustands, Neue Zustände (Array), Äq.-Klassen (Array), Ausgänge (Array),                                Äq.-Klasse der Zeile,   Temporär
	}
	
	var divcontent = "<h3>5. Minimierungsschritte</h3>";

	// Automatentabelle ausgeben
	divcontent += printTableauWOCls(tableau, states, numState);
	
	// Bestimmen den K0-Äquivalenzklasse durch Vergleich der Ausgänge
	var index = 0;
	for(var i = 0; i < numOutput; i++)
	{
		var used = false; // Ausgang überhaupt benutzt?

		// Alle folgenden Zeilen auf Äquivalenz prüfen
		for(var j = 0; j < numState; j++)
		{
			if(tableau[j].out == i)
			{
				// In einer K0-Äquivalenzklasse zusammenfassen
				tableau[j].cls = index;
				used = true;
			}	
		}

		// Klassenindex nur erhöhen, wenn eine neue Klasse erzeugt wurde
		if(used) index++;
	}
	
	// Übernehmen der K0-Äquivalenzklassen in die Automatentabelle
	for(var i = 0; i < numState; i++)
	{
		for(var j = 0; j < numInput; j++)
		{
			var sel = tableau[i].state_new[j];
			tableau[i].cls_old[j] = tableau[sel].cls;
		}
	}

	// Automatentabelle mit K0-Äquivalenzklassen ausgeben
	divcontent += printTableau(0);
	
	// Bestimmen der Äquivalenzklassen von K1 aufwärts
	var level = 1;
	while(!tablaeuComplete()) // Unterschiede in den Äquivalenzklassen?
	{
		var idx = 0;
		for(var i = 0; i < numState; i++)
		{
			if(tableau[i].flag) // schon bearbeitet?
				continue;
			
			// Merken der eigenen Äquivalenzklasse und aller nächsten Zustände
			var theoldcls = tableau[i].cls_old;
			var thecls = tableau[i].cls;
			
			// Alle folgenden Zeilen auf Äquivalenz prüfen
			for(var j = i; j < numState; j++)
			{
				if( (tableau[j].cls_old.equals(theoldcls)) && (tableau[j].cls == thecls) )
				{
					// Zusammenfassen in Äquivalenzklasse und Flag setzen
					tableau[j].cls = idx;
					tableau[j].flag = true;
				}
			}
			
			idx++;
		}
		removeFlags(); // Reset der temporären Flags
		
		// Übernehmen der Äquivalenzklassen in die Automatentabelle
		for(var i = 0; i < numState; i++)
		{
			for(var j = 0; j < numInput; j++)
			{
				var sel = tableau[i].state_new[j];
				tableau[i].cls_old[j] = tableau[sel].cls;
			}
		}
		
		// Automatentabelle mit aktuellen Äquivalenzklassen ausgeben
		divcontent += printTableau(level);
		
		// Zur nächsten Stufe der Äquivalenzklassen
		level++;
	}
	
	// Minimierung abgeschlossen. Die neuen Zustände müssen benannt werden, was wieder in einer Tabelle geschieht.
	divcontent += "<br><h3>6. Neue Zust&auml;nde erstellen</h3><p>Das Verfahren ist abgeschlossen. Bitte vergeben Sie Namen f&uuml;r die neu zu erstellenden Zust&auml;nde:</p>";
	
	// Namen der Äquivalenzklassen
	divcontent += "<table><tr><th>Klassenalias</th>";
	for(var i = 0; i <= maxCls(); i++)
	{
		divcontent += "<td>K<sup>" + (level-1) + "</sup><sub>" + i + "</sub></td>"; 
	}
	
	// Namen der neuen Zustände
	// Vorbelegung: ZZ0, ZZ1, ZZ2, ...
	divcontent += "</tr><tr><th>Zustand</th>";
	for(var i = 0; i <= maxCls(); i++)
	{
		divcontent += "<td><input id='alias" + i + "' value='ZZ" + i + "'></td>";
	}
	
	// Tabellenfuß und Button für nächsten Schritt
	divcontent += '</tr></table><p><input type="button" id="cmdAlias" value="Weiter" /></p>';
	
	// Inhalt ins HTML-Dokument einfügen
	$("#result").html(divcontent);
	
	// Alle jqxInput-Instanzen initialisieren
	for(var i = 0; i <= maxCls(); i++)
	{
		$("#alias"+i).jqxInput({ width: 100, height: 25, });
	}
	
	// Button und Eventhandler für nächsten Schritt
	$("#cmdAlias").jqxButton({ width: '150', height: '25' });
	$("#cmdAlias").on('click', createAlias);
	
}

/// Diese Funktion erzeugt eine neue Automatentabelle, basierend auf dem minimierten Automaten und den neuen Zuständen.
function createAlias (event)
{
	// Automatentabelle initialisieren
	var n_tableau = [];
	var n_states = []
	
	// Einen Zustand für jede Äquivalenzklasse erzeugen
	for(var i = 0; i <= maxCls(); i++)
	{
		// Zustände benennen
		n_states[i] = $("#alias"+i).val();
		
		// Leere Platzhalter initialisieren (Werte nicht mehr benötigt)
		var states_new = [];
		var classes_old = [];
		
		// Berechnen der neuen nächsten Zustände
		for(var j = 0; j < numInput; j++)
		{
			states_new[j] = tableau[i].cls_old[j];
		}
		
		// Automatentabelle zeilenweise aufbauen
		n_tableau[i] = { state: n_states[i], state_new: states_new, cls_old: classes_old, out: tableau[i].out, cls: -1, flag: false };
	}
	
	var divcontent = "<h3>7. Ergebnis</h3>";
	
	// Endgültiges Ergebnis ausgeben
	divcontent += printTableauWOCls(n_tableau, n_states, n_states.length);
	
	$("#newdef").html(divcontent);
	
	// Buttons für Drucken und Neubeginn einblenden
	$("#print").show();
}

/// Helferfunktion zur Ausgabe einer Automatentabelle ohne Äquivalenzklassen.
/// Gibt die übergebene Tabelle aus und liest die globalen Variablen inputs, outputs, numInput, numOutput.
function printTableauWOCls(tab, st, numSt)
{
	var str = "<h4>Automatentabelle</h4>"; // Tabellenkopf
	
	// Tabellenkopf (Unterschiedlich Mealy/Moore)
	str += '<table class="bordertable"><tr><th>n</th><th colspan="' + numInput + '">n+1</th>';
	if(!isMealy)
		str += '<th>n</th>';
	
	// Aufzählen der Eingaben
	str += "</tr><tr><th></th>";
	for(var i = 0; i < numInput; i++)
	{
		str += '<th>' + inputs[i] + '</th>';
	}
	
	// Platzhalter bei Moore-Automat
	if(!isMealy)
		str += "<th></th>";
	str += "</tr>"
	
	// Tabellenkörper
	for(var i = 0; i < numSt; i++)
	{
		// Zeilenkopf: Zustand
		str += "<tr><td>" + st[i] + "</td>";
		for(var j = 0; j < numInput; j++)
		{
			// Nächste Zustände und Ausgaben bei Mealy
			str += "<td>" + st[tab[i].state_new[j]];
			if(isMealy)
				str += " / " + outputs[tab[i].out[j]];
			str += "</td>";
		}
		if(!isMealy) // Ausgaben für Moore am Zeilenende
			str += "<td>" + outputs[tab[i].out] + "</td>";
	}
	
	str += '</table>';
	
	return str;
}

/// Diese Funktion gibt eine Automatentabelle mit Äquivalenzklassen aus.
/// Level der Äquivalenzklasse wird als Parameter bereitgestellt.
function printTableau(akt_cls)
{
	// Überschrift
	var str = "<h4>Automatentabelle mit K<sup>" + akt_cls + "</sup> &Auml;quivalenzklassen</h4>";
	
	// Tabellenkopf mit Platzhalter für Moore Automaten
	str += '<table class="bordertable"><tr><th>n</th><th colspan="' + numInput + '">n+1</th>';
	if(!isMealy)
		str += '<th>n</th>';
	str += '<th>K<sup>' + akt_cls + '</sup></th>';
	
	// Aufzählen der Eingaben
	str += "</tr><tr><th></th>";
	for(var i = 0; i < numInput; i++)
	{
		str += '<th>' + inputs[i] + '</th>';
	}
	
	if(!isMealy)
		str += "<th></th>";
	str += "<th></th></tr>";
	
	// Ausgabe des Tabellenkörpers, gruppiert nach Äquivalenzklassen
	for(var i = 0; i < numState; i++)
	{
		if(tableau[i].flag) // bereits ausgegeben?
			continue;
		
		var thecls = tableau[i].cls;
		
		// Andere Zeilen dieser Äquivalenzklasse suchen
		for(var j = i; j < numState; j++)
		{
			if(tableau[j].cls == thecls) // Zeile gehört zur Äquivalenzklasse
			{
				// Tabelle nach Äquivalenzklassen aufteilen
				if(j == i) str += '<tr class="thickborder">';
				else       str += '<tr>';
				
				str += "<td>" + states[j] + "</td>";

				// Ausgabe der nächsten Zustände
				for(var k = 0; k < numInput; k++)
				{
					str += "<td>" + states[tableau[j].state_new[k]];
					if(isMealy)
						str += " / " + outputs[tableau[j].out[k]]; // auch die Ausgaben bei Mealy
					str	+= " - K<sup>" + akt_cls + "</sup><sub>" + tableau[j].cls_old[k] + "</sub></td>"; // und die Äquivalenzklassen
				}
				if(!isMealy)
					str += "<td>" + outputs[tableau[j].out] + "</td>"; // Ausgaben für Moore am Zeilenende
				str += "<td>K<sup>" + akt_cls + "</sup><sub>" + tableau[j].cls + "</sub></td></tr>"; // Äquivalenzklasse der Zeile
				tableau[j].flag = true;	// Zeile als ausgegeben markieren
			}
		}
	}
	removeFlags(); // Reset der temporären Flags
	
	str += '</table>';
	return str;
}

/// Diese Funktion prüft, ob noch Unterschiede innerhalb der Äquivalenzklassen existieren.
/// Gibt true zurück, sofern die Automatentabelle minimal ist.
function tablaeuComplete()
{
	var compl = true;
	
	for(var i = 0; i <= maxCls(); i++) // Alle Äquivalenzklassen betrachten
	{
		var theoldcls = [];
		for(var j = 0; j < numState; j++) // Alle Zustände betrachten
		{
			if(tableau[j].cls == i) // Passender Zustand gefunden
			{
				if(theoldcls.length == 0) // dies ist die erste Zeile in dieser Äquivalenzklasse
				{
					theoldcls = tableau[j].cls_old;
				}
				else
				{
					if( !tableau[j].cls_old.equals(theoldcls) ) // eine zweite Zeile, die nicht der ersten entspricht
					{						
						compl = false; // Also ist die Tabelle nicht minimal
					}
				}
			}
		}
	}
	
	return compl;
}

/// Diese Funktion entfernt temporäre Flags von der Automatentabelle
function removeFlags()
{
	for(var i = 0; i < numState; i++)
	{
		tableau[i].flag = false;
	}
}

/// Diese Funktion bestimmt den maximalen Äquivalenzklassenindex in der Automatentabelle
function maxCls()
{
	var max_cls = 0;
	for(var i = 0; i < numState; i++)
	{
		if(tableau[i].cls > max_cls)
		{
			max_cls = tableau[i].cls;
		}
	}
	return max_cls;
}


/// Diese Funktion vergleich Arrays
/// Quelle: http://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript by Tomáš Zato

// Warn if overriding existing method
if(Array.prototype.equals)
	console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
	// if the other array is a falsy value, return
	if (!array)
		return false;

	// compare lengths - can save a lot of time 
	if (this.length != array.length)
		return false;

	for (var i = 0, l=this.length; i < l; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {
			// recurse into the nested arrays
			if (!this[i].equals(array[i]))
				return false;       
		}           
		else if (this[i] != array[i]) { 
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;   
		}           
	}
	return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
