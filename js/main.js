function enableContainer() {
	var searchWiki = document.getElementById("searchWiki").value;
	document.getElementById("searchWiki").value = '';
	document.getElementById("searchWiki").style = '';
	document.getElementById("errorMessage").innerHTML = '';

	if (searchWiki !== '') {
		createWikipediaTable();
		searchOnWiki(searchWiki);
	} else {
		document.getElementById("searchWiki").style = "border:1px solid #cc0000;";
		document.getElementById("errorMessage").innerHTML = "Please insert some value";
	}

}

function createWikipediaTable() {
	document.getElementById("wikiResultsContainer").innerHTML = `
	<br><table class="table table-striped">
			<thead>
				<th class='text-center'>Title</th>
				<th class='text-center'>Extract</th>
				<th class='text-center'>Page</th>
			</thead>
			<tbody id="wikipediaSearchTableContent">
			</tbody>
		</table>
		`
}

function searchOnWiki(searchWiki) {
	var api = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
    var cb = '&callback=JSON_CALLBACK';
	var wikipediaUrlById = 'https://en.wikipedia.org/?curid='

	$.ajax({
		url: api + searchWiki + cb,
		dataType: 'jsonp',
		type: 'POST',
		headers: { 'Api-User-Agent':'Example/1.0',
				 	'Access-Control-Allow-Origin':'*'},
		success: function(response){
			if (response.query.pages === undefined) {
				document.getElementById("wikiResultsContainer").innerHTML = '';
				document.getElementById("operationStatus").className = 'alert alert-info';
				document.getElementById("operationStatus").innerHTML = `
				<i class="glyphicon glyphicon-remove"></i>
  				<strong> Ops!</strong> None results for your search. :/`
				return true
			}
			
			document.getElementById("operationStatus").className = 'alert alert-success';
			document.getElementById("operationStatus").innerHTML = `
				<i class="glyphicon glyphicon-ok"></i>
  				<strong> Success!</strong> Check the results`
			for (var key in response.query.pages){
				document.getElementById('wikipediaSearchTableContent').innerHTML +=
				"<tr>" +
				"<td class='text-center'>" + response.query.pages[key].title + "</td>" +
				"<td class='text-left'>" + response.query.pages[key].extract + "</td>" +
				"<td class='text-center'><a href='" + wikipediaUrlById + response.query.pages[key].pageid + "' target='_blank' class='glyphicon glyphicon-eye-open'></a> </td>" +
				"</tr>"

			}
		},
		error: function(response){
			document.getElementById("wikiResultsContainer").innerHTML = '';
			document.getElementById("operationStatus").className = 'alert alert-danger';
			document.getElementById("operationStatus").innerHTML = `
				<i class="glyphicon glyphicon-remove"></i>
				<strong>Error!</strong> Something went wrong, check the logs for more details.`
			console.log(response);
			return false;
	}
	});
}
	