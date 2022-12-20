<?php

function get_markers(){

$markers = array(
	array(
		"title"=>"Titre Marker 1", 
		"id" => 21,			
		"content" =>"Marker 1 Terms: 11 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.547513, 5.407495),
		"taxonomies"=>array(
			"taxonomy-1"=>[ // 1 2 3
				11,				
			],
		),
	),
	array(
		"title"=>"Titre Marker 2", 
		"id" => 22,			
		"content" =>"Marker 2 Terms: 12 21 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.547605, 5.438065),
		"taxonomies"=>array(
			"taxonomy-1"=>[
				12,				
			],
			"taxonomy-2"=>[
				21,
			],
		),
	),
	array(
		"title"=>"Titre Marker 3", 
		"id" => 23,			
		"content" =>"Marker 3 Terms: 31 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.552252, 5.456978),
		"taxonomies"=>array(
			"taxonomy-3"=>[ // 7 8 9 
				31,
			],
		),
	),
	array(
		"title"=>"Titre Marker 4", 
		"id" => 24,			
		"content" =>"Marker 4 Terms: 13 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.545130, 5.409090),
		"taxonomies"=>array(
			"taxonomy-1"=>[
				13,				
			],
		),
	),
	array(
		"title"=>"Titre Marker 5", 
		"id" => 25,			
		"content" =>"Marker 5 Terms: 21 32 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.542314, 5.431969),
		"taxonomies"=>array(
			"taxonomy-2"=>[
				21,				
			],
			"taxonomy-3"=>[
				32,				
			],
		),
	),
	array(
		"title"=>"Titre Marker 6", 
		"id" => 26,			
		"content" =>"Marker 6 Terms: 23 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.538226, 5.456767),
		"taxonomies"=>array(
			"taxonomy-2"=>[
				23,				
			],
		),
	),
	array(
		"title"=>"Titre Marker 7", 
		"id" => 27,			
		"content" =>"Marker 7 Terms: 12 21 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.527867, 5.418388),
		"taxonomies"=>array(
			"taxonomy-1"=>[
				12,				
			],
			"taxonomy-2"=>[
				21,				
			],
		),
	),
	array(	
		"title"=>"Titre Marker 8", 
		"id" => 28,			
		"content" =>"Marker 8 Terms: 11 33 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.526948, 5.438370),
		"taxonomies"=>array(
			"taxonomy-1"=>[
				11,				
			],
			"taxonomy-3"=>[
				33,				
			],
		),
	),
	array(	
		"title"=>"Titre Marker 9", 
		"id" => 29,			
		"content" =>"Marker 9 Terms: 23 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.525566, 5.462111),
		"taxonomies"=>array(
			"taxonomy-2"=>[
				23,				
			],
		),
	),
	array(	
		"title"=>"Titre Marker 10", 
		"id" => 30,			
		"content" =>"Marker 10 Terms: 31 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.513114, 5.420295),
		"taxonomies"=>array(
			"taxonomy-3"=>[
				31,				
			],
		),
	),
	array(	
		"title"=>"Titre Marker 11", 
		"id" => 31,			
		"content" =>"Marker 11 Terms 11 12 23 32 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.511676, 5.433499),
		"taxonomies"=>array(
			"taxonomy-1"=>[
				11,	12,			
			],
			"taxonomy-2"=>[
				23,				
			],
			"taxonomy-3"=>[
				32				
			],				
		),
	),
	array(  
		"title"=>"Titre Marker 12", 
		"id" => 32,			
		"content" =>"Marker 12 Terms 11 12 13 21 22 23 31 32 33 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum recusandae suscipit voluptatibus vitae fugiat commodi error voluptatem",
		'location' => array(43.511705, 5.459924),
		"taxonomies"=>array(
			"taxonomy-1"=>[
				11,12,13,				
			],
			"taxonomy-2"=>[
				21,22,23,				
			],
			"taxonomy-3"=>[
				31,32,33,				
			],
		),  
	)
);



echo json_encode($markers);
die();
}
add_action( 'wp_ajax_get_markers', 'get_markers' );
add_action( 'wp_ajax_nopriv_get_markers', 'get_markers' );


function get_markers_taxonomies(){


	$taxonomies = array(
		array(
			"name"=>"taxonomy-1", 
			"label" => "Taxonomie 1",			
			"terms"=>array(
				array(
					"term_id" => 11,
					"slug"    => "term-1-1",
					"name"    => "Term 11",
				),
				array(
					"term_id" => 12,
					"slug"    => "term-1-2",
					"name"    => "Term 12",
				),
				array(
					"term_id" => 13,
					"slug"    => "term-1-3",
					"name"    => "Term 13",
				),
			),
		),
		array(
			"name"=>"taxonomy-2", 
			"label" => "Taxonomie 2",			
			"terms"=>array(
				array(
					"term_id" => 21,
					"slug"    => "term-2-1",
					"name"    => "Term 21",
				),
				array(
					"term_id" => 22,
					"slug"    => "term-2-2",
					"name"    => "Term 22",
				),
				array(
					"term_id" => 23,
					"slug"    => "term-2-3",
					"name"    => "Term 23",
				),
			),
		),
		array(
			"name"=>"taxonomy-3", 
			"label" => "Taxonomie 3",			
			"terms"=>array(
				array(
					"term_id" => 31,
					"slug"    => "term-3-1",
					"name"    => "Term 31",
				),
				array(
					"term_id" => 32,
					"slug"    => "term-3-2",
					"name"    => "Term 32",
				),
				array(
					"term_id" => 33,
					"slug"    => "term-3-3",
					"name"    => "Term 33",
				),
			),
		),
	);

	echo json_encode($taxonomies);
	die();
}

add_action( 'wp_ajax_get_taxonomies', 'get_markers_taxonomies' );
add_action( 'wp_ajax_nopriv_get_taxonomies', 'get_markers_taxonomies' );