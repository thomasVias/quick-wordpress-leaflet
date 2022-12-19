/*
version: 2022_02_28_0
Pour fonctionner correctement il faut installer les dépendences suivantes:
    "leaflet": "1.7.1",
    "leaflet.markercluster": "1.5.3"
	
	et inclure les fichiers:
	'leaflet/dist/leaflet.js'
	'leaflet/dist/leaflet.css'
	'leaflet.markercluster/dist/leaflet.markercluster.js'
	'leaflet.markercluster/dist/MarkerCluster.css'
	'leaflet.markercluster/dist/MarkerCluster.Default.css'



API AJAX markers
{
	[
		{
			"title":[WP_Post->title], 
			"id": [WP_Post->id],			
			"content":[WP_Post->content],
			"taxonomies":{
				[taxonomy_1->name]:[
					[term_id_1],
					...
				
				]
			}
			
				{
			]
		},
		...
	]
}


API AJAX taxonomies
{
	[
		{
			"label":[WP_Taxonomy->labels->name], 
			"name": [WP_Taxonomy->name],			
			"terms":[
				{
					"term_id": [WP_Term->term_id],
					"slug": [WP_Term->slug],
					"name": [WP_Term->name],
				},
				...
			]
		},
		...
	]
}


*/



var MODULE = (function(){

	'use strict';

	/* Ici sont définis les variables pou l'intégration en fonction de l'environnement final */
	var _htmlMapTagId = 'map'; // Id du tag de la carte 
	var _htmlFiltersTagId = 'leaflet-filters'; // Id du tag des filtres 
	var _initialMapCenter = [43.529887, 5.447903]; // position de départ de la carte [lat, long]
	var _initialMapZoom = 13; // indice initial de zoom
	var _openStreetMapTilesUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; // url des serveur Openstreetmap
	var _ajaxUrl = ajax.url; // url d'accès au données par ajax
	var _getMarkersAction = "get_markers"; // nom de l'actio pour récupérer les marqueurs
	var _getTaxonomiesAction = "get_taxonomies"; // nom de l'actio pour récupérer les taxonomies


	var _map = {};
	var _clusterGroup = {}; 
	var _hiddenMarkers = [];

 
	function init() {

		if (document.querySelector('#' + _htmlMapTagId) === null){
			console.log("Conteneur de Carte non trouvé");
			return false;
		};

		var _map = L.map( _htmlMapTagId ).setView( _initialMapCenter, _initialMapZoom );

		L.tileLayer(_openStreetMapTilesUrl, {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(_map);

		_clusterGroup = L.markerClusterGroup();

		_map.addLayer(_clusterGroup);

		_loadMarkers();

		_initiateFilters();

		_initiateEvents();
	}

	function _loadMarkers(){

		const data = new FormData();
        data.append( 'action', _getMarkersAction ); 


		fetch(_ajaxUrl, {
			method: "POST",
			credentials: 'same-origin',
			body: data
		})
		.then(function(response){
			var returned = response.json();
			return returned;
		})
		.then(function(json){
			json.map(function(elt){
				if (Array.isArray(elt.location)){
					let marker = L.marker(elt.location);
					marker.bindPopup(elt.content).openPopup();					
					marker.terms = elt.taxonomies;
					_clusterGroup.addLayer(marker);
				}
			});
		});
	}

	function _updateVisibleMarkers(terms,excludedTerms){
		let layerToRemove=[];
		let layertoAdd =[];
		const KEY = 0, VALUE=1;

		layerToRemove = _clusterGroup.getLayers().filter(
			function(layer){
				let isCorresponding = false;
				let taxoEntries = Object.entries(layer.terms);
				// Pour Toutes les taxonomies
				isCorresponding = taxoEntries.reduce( 					 
					function( acc, taxo ) {
						//Pour chaque term
						let isTaxoCorresponding = taxo[VALUE].reduce( function( accTerm, eltTerm ) {
							return accTerm || (terms[taxo[KEY]] && terms[taxo[KEY]].includes(eltTerm) &&  ! ( excludedTerms[taxo[KEY]] && excludedTerms[taxo[KEY]].includes(eltTerm) ) );
						}, false );
						return acc && isTaxoCorresponding;
					}, 
					true
					);

				return ! isCorresponding;
			});

		layertoAdd = _hiddenMarkers.filter(function(layer){
			let isCorresponding = false;
			let taxoEntries = Object.entries(layer.terms);
			// Pour Toutes les taxonomies
			isCorresponding = taxoEntries.reduce( 					 
				function( acc, taxo ) {
					//Pour chaque term
					let isTaxoCorresponding = taxo[VALUE].reduce( ( accTerm, eltTerm ) => accTerm || (terms[taxo[KEY]] && terms[taxo[KEY]].includes(eltTerm) && ! ( excludedTerms[taxo[KEY]] && excludedTerms[taxo[KEY]].includes(eltTerm) ) ), false )
					return acc && isTaxoCorresponding;
				}, 
				true
				);

			return isCorresponding;
		});

		layerToRemove.forEach(layer => {
			_hiddenMarkers.push(layer);
			_clusterGroup.removeLayer(layer);
		});

		layertoAdd.forEach(layer => {			
			_clusterGroup.addLayer(layer);
			var indexOfmarkerToSplice = _hiddenMarkers.indexOf(layer);
			_hiddenMarkers.splice(indexOfmarkerToSplice, 1);
		});
	}


	function _initiateFilters(){

		var filterNode = document.getElementById(_htmlFiltersTagId);

		const data = new FormData();
        data.append( 'action', _getTaxonomiesAction ); 


		fetch(_ajaxUrl, {
			method: "POST",
			credentials: 'same-origin',
			body: data
		})
		.then(function(response){
			var returned = response.json();
			return returned;
		})
		.then(function(json){	
			json.map(function(elt){
				let taxonomyNode = _initTaxonomy( elt );
				filterNode.append(taxonomyNode);
			});
		})
		.catch(err => console.error(err));

	}
  
	function _initTaxonomy(taxonomy){

		var wrapper = document.createElement("div");
		let taxoTitle = document.createElement("p");

		taxoTitle.classList.add('taxonomy-title');
		taxoTitle.classList.add(taxonomy.name);
		taxoTitle.innerText = taxonomy.label;

		wrapper.append(taxoTitle);

		if (Array.isArray(taxonomy.terms)){
			var ulist = document.createElement("ul");
			ulist.classList.add("taxonomy-list");
			ulist.setAttribute('taxonomy', taxonomy.name);

			// Add "All" checkbox
			let termAll = _initTerm({"slug":"all-"+taxonomy.name, "term_id":0, "name": "Tous", "selected":true});
			ulist.append(termAll);

			// Add all terms checkbox
			taxonomy.terms.map(function(elt){
				let term = _initTerm(elt);
				ulist.append(term);
			});

			let termNone = _initTerm({"slug":"all-none-"+taxonomy.name, "term_id": -1, "name": "Aucun", "selected":false});
			ulist.append(termNone);
		}
		wrapper.append(ulist);
		return wrapper;

	}

	function _initTerm(term){

		var returned = false;
		if ( term.slug && term.name && term.term_id !== null ){

			var checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.id = term.slug;
			checkbox.name = term.slug;
			checkbox.value = term.term_id;
			checkbox.classList.add('term-status');

			if ( term.selected ){
				checkbox.checked = term.selected;
			}

		
			var label = document.createElement('label');
			label.htmlFor = term.slug;
			label.appendChild(document.createTextNode(term.name));
		
		
			var liElt = document.createElement('li');
			liElt.classList.add('term');
			liElt.appendChild(checkbox);
			liElt.appendChild(label);


			returned = liElt;
		}
		return returned;
	}

	function _initiateEvents(){

		var filterNode = document.getElementById(_htmlFiltersTagId);

		filterNode.addEventListener("DOMNodeInserted", function (ev) {
			ev.target.querySelectorAll( '.term-status' ).forEach(function(node) {
				node.addEventListener( 'change', onTermcheck);
			});
			// ...
		  }, false);
	}

	function onTermcheck(e ){
		
		let filterNode = document.getElementById(_htmlFiltersTagId);
		let termsId  = {};
		let excludedTermsId = {};
		let checkTerm = e.target;
		let taxonode = checkTerm.closest('ul');

		let checkValue = checkTerm.value;

		if (checkTerm.closest('ul').querySelectorAll(".term-status:checked").length === 0 ){
			checkTerm.closest('ul').querySelector(".term-status[name^=all]:not([name^=all-none])").checked = true;
			checkValue = checkTerm.closest('ul').querySelector(".term-status[name^=all]:not([name^=all-none])").value;
		}


		switch (parseInt(checkValue)){
			case -1:
				let excludedTaxTermsId = Array.from(taxonode.querySelectorAll(".term-status:not([name^=all])")).map(function(elt) {
					elt.checked = false;  
					return parseInt(elt.value);
				});
				checkTerm.closest('ul').querySelector(".term-status[name^=all]:not([name^=all-none])").checked = false;
		
				excludedTermsId[taxonode.getAttribute('taxonomy')] = excludedTaxTermsId;
				break;
			case 0:
				let taxTermsId = Array.from(taxonode.querySelectorAll(".term-status:not([name^=all])")).map(function(elt) {
					elt.checked = false;  
					return parseInt(elt.value); 
				});
				checkTerm.closest('ul').querySelector(".term-status[name^=all-none]").checked = false;
		
				termsId[taxonode.getAttribute('taxonomy')] = taxTermsId;
				break;
			default:
				termsId[taxonode.getAttribute('taxonomy')] = Array.from(taxonode.querySelectorAll(".term-status:checked")).map(function(elt) {
					return parseInt(elt.value); 
				});
				Array.from(checkTerm.closest('ul').querySelectorAll(".term-status[name^=all]")).forEach(elt => elt.checked = false);

		}

		let taxonomiesNodes = filterNode.querySelectorAll( 'ul' );
		// Avec tous les nodes de taxonomies
		termsId = Array.from(taxonomiesNodes).reduce(			
			function ( currentTaxonomyTerms, currentTaxo ) {
				//On les réduit
				// Si c'est pas la taxonomie modifiée
				if ( currentTaxo.getAttribute('taxonomy') != taxonode.getAttribute('taxonomy') ){
					// Pour tous ces terms cochés
					//On les réduit
					currentTaxonomyTerms[currentTaxo.getAttribute('taxonomy')] = Array.from(currentTaxo.querySelectorAll(".term-status:checked")).reduce (
						function(taxoTermArr, checkedTerm){
							if ( parseInt(checkedTerm.value) === 0 ){
								let taxTermsId = Array.from(currentTaxo.querySelectorAll(".term-status:not([name^=all])")).map(function(mapTaxoTerms) {
									mapTaxoTerms.checked = false;  
									return parseInt(mapTaxoTerms.value);
								});
								taxoTermArr = taxTermsId;
							}else{
								taxoTermArr.push(parseInt(checkedTerm.value));
								currentTaxo.querySelector(".term-status[name^=all]").checked = false;
							}
							return taxoTermArr;
						},
						[]
						);
				}
				return currentTaxonomyTerms;
			},
			termsId
		);

		excludedTermsId = Array.from(taxonomiesNodes).reduce(
			function ( currentTaxonomyTerms, currentTaxo ) {
				//On les réduit
				// Si c'est pas la taxonomie modifiée
				if ( currentTaxo.getAttribute('taxonomy') != taxonode.getAttribute('taxonomy') ){
					// Pour tous ces terms cochés
					//On les réduit
					currentTaxonomyTerms[currentTaxo.getAttribute('taxonomy')] = Array.from(currentTaxo.querySelectorAll(".term-status:checked")).reduce (
						function(taxoTermArr, checkedTerm){
							if ( parseInt(checkedTerm.value) === -1 ){
								let taxTermsId = Array.from(currentTaxo.querySelectorAll(".term-status:not([name^=all])")).map(function(mapTaxoTerms) {
									mapTaxoTerms.checked = false;  
									return parseInt(mapTaxoTerms.value);
								});
								taxoTermArr = taxTermsId;
							}
							return taxoTermArr;
						},
						[]
						);
				}
				return currentTaxonomyTerms;
			},
			excludedTermsId);

		_updateVisibleMarkers(termsId, excludedTermsId);
	}


	return {
	  init: init
	};

})();


window.addEventListener('load', function(){

	MODULE.init();

});