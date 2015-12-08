// Settings //

var codeit = {
	// valid codes
	validcodes: ['S1','E1','M1','T1','H1','C1','P1','F1','U1','S2','E2','M2','T2','H2','C2','P2','F2','U2','S3','E3','M3','T3','H3','C3','P3','F3','U3','S4','E4','M4','T4','H4','C4','P4','F4','U4','S5','E5','M5','T5','H5','C5','P5','F5','U5','S6','E6','M6','T6','H6','C6','P6','F6','U6','S7','E7','M7','T7','H7','C7','P7','F7','U7','S8','E8','M8','T8','H8','C8','P8','F8','U8','I1','I2','I3','I4','I5','I6','I7','I8','W1','W2','W3','W4','W5','W6','W7','W8','L1','L2','L3','L4','L5','L6','L7','L8','A1','A2','A3','A4','A5','A6','A7','A8','K1','K2','K3','K4','K5','K6','K7','K8','O1','O2','O3','O4','O5','O6','O7','O8'],
	// Name of people interviewed
	people: 	['Paul the Bike Shop Supervisor', 'Simon the bike and bus rider','Big Blue Bus','Bruin Bus','Jim Van Pool','Survey','UCLA Transportation Services','BBB Andy','Bus Stop','Student Driver 1','Student Driver 2'],
	// Assign a color per person
	colors:  	['red','green','blue','orange','BlueViolet','Brown','CornflowerBlue','DarkBlue','DeepPink','Olive','OliveDrab'],
	spreadsheeturls: [],
};

// Add each google spreadsheet url
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/osl717x/public/values?alt=json");
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/odqoub2/public/values?alt=json");
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/o2a8ul6/public/values?alt=json");
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/on3v450/public/values?alt=json");
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/o1cfp32/public/values?alt=json");
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/od6/public/values?alt=json");
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/oxq1dm8/public/values?alt=json");
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/o1g8v8n/public/values?alt=json");
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/ofdwb84/public/values?alt=json");
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/oirte01/public/values?alt=json");
codeit.spreadsheeturls.push("https://spreadsheets.google.com/feeds/list/1eOhHL8RMOLVUqtgBXavktm4d_Dy9V6nEce8CrPEZw9Y/os4btum/public/values?alt=json");

// Run on page load
$( document ).ready(function() {
	codeit.initialize();
});

//Function that gets run when the document loads
codeit.initialize = function()
{
	// Load People
	$.each(codeit.people,function(i,val){
		$('#people').append('<li style="cursor:pointer;color:'+codeit.colors[i]+'" onclick="codeit.applyperson(\''+val+'\')">'+val+'</li>');
	})

	//get transcripts
	$.each(codeit.spreadsheeturls,function(i,val){
		codeit.loadSpreadsheetData(i,val)
	})

	//button filters
	$.each(codeit.validcodes,function(i,val){
		$('#c'+val)	.click(function(){ 
			codeit.applycode(val);
		});
	})
}

function split(txt, num) {
  var result = [];
  for (var i = 0; i < txt.length; i += num) {
    result.push(txt.substr(i, num));
  }
  return result;
}

var transcripts = [];

codeit.loadSpreadsheetData = function(pos,url)
{
	$.getJSON(url,function(data){
		transcripts.push(data.feed.entry);
		$.each(data.feed.entry,function(j,val2){
			val2.interviewee = codeit.people[pos];
			val2.color = codeit.colors[pos];
			var codes = val2.gsx$codesappliedleaveblank.$t;

			// clean the codes (get rid of spaces and commas)
			codes = codes.replace(" ","");
			codes = codes.replace(",","");

			var splitcodes = split(codes,2);

			// add the coded transcripts to the sidebar as colored squares
			$.each(splitcodes,function(i,val2){
				$('#c'+val2).append('<span style="color:'+codeit.colors[pos]+'">&#9635</span> ')
			})
		});
	})
}

codeit.applycode = function(code)
{
	$('#output').empty();
	$('#output-title').html('Transripts for code "'+code+'"');

	$.each(transcripts,function(i,val1){
		$.each(val1,function(j,val2){
			var transcript= val2.gsx$transcript.$t;
			var codes = val2.gsx$codesappliedleaveblank.$t;

			if(codes.search(code)>=0)
			{
				$('#output').append('<b style="color:'+val2.color+'">'+val2.interviewee+'</b><br>')
				$('#output').append('<span style="color:red">'+codes+'</span><br>')
				$('#output').append(transcript)
				$('#output').append('<br><br>')
			}
		})	
	});
}

codeit.applyperson = function(liveperson)
{
	$('#output').empty();
	$('#output-title').empty();

	$('#output-title').html('Transcripts for '+liveperson);


	$.each(transcripts,function(i,val1){
		$.each(val1,function(j,val2){
			var transcript= val2.gsx$transcript.$t;
			var codes = val2.gsx$codesappliedleaveblank.$t;
			console.log(val2.interviewee)
			var person = val2.interviewee;
			if(person !== undefined)
			{
				if(person.search(liveperson)>=0)
				{
					$('#output').append('<b style="color:'+val2.color+'">'+val2.interviewee+'</b><br>')
					$('#output').append('<span style="color:red">'+codes+'</span><br>')
					$('#output').append(transcript)
					$('#output').append('<br><br>')
				}			
			}
			})	
	});
}

codeit.search = function()
{
	$('#output-title').empty();
	$('#output').empty();

	var searchterm = $('#search-text').val();
	$('#output-title').html('Search results for "'+searchterm+'"');

	$.each(transcripts,function(i,val1){
		$.each(val1,function(j,val2){
			var transcript= val2.gsx$transcript.$t;
			var codes = val2.gsx$codesappliedleaveblank.$t;
			if(transcript.search(searchterm)>=0)
			{
				$('#output').append('<b style="color:'+val2.color+'">'+val2.interviewee+'</b><br>')
				$('#output').append('<span style="color:red">'+codes+'</span><br>')
				$('#output').append(transcript)
				$('#output').append('<br><br>')
			}			
		})	
	});
}
