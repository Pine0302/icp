 $(function() {
	function split( val ) {
		return val.split( /,\s*/ );
	}
	function extractLast( term ) {
		return split( term ).pop();
	}
	function re_catid(  ) {
		var catid = $("#h_cat_id").val();
		//console.log(catid);
		if(catid == ""){
			return 0;
		}else{
			return catid;
		}
		
	}
	$( "#kw_s" )
	// don't navigate away from the field on tab when selecting an item
	.bind( "keydown", function( event ) {
		if ( event.keyCode === $.ui.keyCode.TAB &&
		$( this ).autocomplete( "instance" ).menu.active ) {
		event.preventDefault();
		}
	})
	.autocomplete({
	source: function( request, response ) {
		$.getJSON( "/lib/class.prefixSearch.php", {
		query: extractLast( request.term ),
		hit:10,
		catid:re_catid()
		}, response );
	},
	search: function() {
		// custom minLength
		var term = extractLast( this.value );
		if ( term.length < 2 ) {
		return false;
		}
	},
	focus: function() {
		// prevent value inserted on focus
		return false;
	},
	select: function( event, ui ) {
		var terms = split( this.value );
		// remove the current input
		terms.pop();
		// add the selected item
		terms.push( ui.item.value );
		// add placeholder to get the comma-and-space at the end
		terms.push( "" );
		this.value = terms.join( " " );
//		return false;
		$("#selfType").click();
	},
	 close: function() {
		//$("#selfType").click();
	}
	});
	
	$( "#key_title" )
	// don't navigate away from the field on tab when selecting an item
	.bind( "keydown", function( event ) {
		if ( event.keyCode === $.ui.keyCode.TAB &&
		$( this ).autocomplete( "instance" ).menu.active ) {
		event.preventDefault();
		}
	})
	.autocomplete({
	source: function( request, response ) {
		$.getJSON( "/lib/class.prefixSearch.php", {
		query: extractLast( request.term ),
		hit:10,
		catid:re_catid()
		}, response );
	},
	search: function() {
		// custom minLength
		var term = extractLast( this.value );
		if ( term.length < 2 ) {
		return false;
		}
	},
	focus: function() {
		// prevent value inserted on focus
		return false;
	},
	select: function( event, ui ) {
		var terms = split( this.value );
		// remove the current input
		terms.pop();
		// add the selected item
		terms.push( ui.item.value );
		// add placeholder to get the comma-and-space at the end
		terms.push( "" );
		this.value = terms.join( " " );
//		return false;
		$("#submit_search").click();
	},
	close: function() {
		//$("#submit_search").click();
	}
	});
	
	$( "#h_key_title" )
	// don't navigate away from the field on tab when selecting an item
	.bind( "keydown", function( event ) {
		if ( event.keyCode === $.ui.keyCode.TAB &&
		$( this ).autocomplete( "instance" ).menu.active ) {
		event.preventDefault();
		}
	})
	.autocomplete({
	source: function( request, response ) {
		$.getJSON( "/lib/class.prefixSearch.php", {
		query: extractLast( request.term ),
		hit:10,
		catid:re_catid()
		}, response );
	},
	search: function() {
		// custom minLength
		var term = extractLast( this.value );
		if ( term.length < 2 ) {
		return false;
		}
	},
	focus: function() {
		// prevent value inserted on focus
		return false;
	},
	select: function( event, ui ) {
		var terms = split( this.value );
		// remove the current input
		terms.pop();
		// add the selected item
		terms.push( ui.item.value );
		// add placeholder to get the comma-and-space at the end
		terms.push( "" );
		this.value = terms.join( " " );
//		return false;
		$("#tijiao").click();
	},
	close: function() {
		//$("#tijiao").click();
	}
	});
});