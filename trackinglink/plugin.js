// Just an PHP Addon that not need JavaScript include.
var htmlLinkData = '';
var trackingEditor;
var dialogObj;
var setArrow='arrow-right';
var baseurl;
CKEDITOR.plugins.add( 'trackinglink', {
    init: function( editor ) {
    	trackingEditor = editor;
		// Register the "simpleLinkDialog" command, which opens the "simpleLinkDialog" dialog.
		editor.ui.addButton( 'TrackingLink', {
			label: 'Insert TrackingLink',
			command: 'execTrackLink',
			icon: this.path + 'icons/trackinglink.png'
		});

		CKEDITOR.dialog.add( "insertTrackingLinkModal", function( editor )
		{
			return {
				title : 'Pick a tracking link for this certificate',
				minWidth : 400,
				minHeight : 200,
				contents :
				[
					{
						id : 'general',
						label : 'Settings',
						elements :
						[
						 	// UI elements of the Settings tab.
						 	{
						 		type: 'html',
						 		html: htmlLinkData
						 	}
						]
					}
				],
				buttons: []
			};
		});
		var isopen = true;
		var isclose = true;
		var linkId;
		editor.addCommand( 'openTrackLinkModal',  new CKEDITOR.dialogCommand( 'insertTrackingLinkModal' ));
		editor.addCommand( 'execTrackLink', {
		    exec: function( editor ) {
		      
				var linkData = {};
				var trackingLink='';
				var user_id = angular.element(document.getElementsByClassName('edited_text')).scope().getUserId();
				baseurl = angular.element(document.getElementsByClassName('edited_text')).scope().getBaseUrl();
				var course_id = angular.element(document.getElementsByClassName('edited_text')).scope().course_id;
				$.ajax({
				    type: 'POST',
				    url: baseurl + 'load_controller/getUserCourseShareLinkForCkeditor',
				    dataType: 'JSON',
				    data: { user_id: user_id},
				    success: function(response) {
				      	for(i in response)
						{
							if(response[i].id == course_id) continue;

							if(linkData[response[i].id] == undefined) {
								linkData[response[i].id] = {name:response[i].name, links:[]};
							}
							linkData[response[i].id].links.push(response[i]);
						}
				        for(val in linkData){
				        	 var tLinks='';
				        	 for(lval in linkData[val].links){
			        	 		tLinks = tLinks + 
			        	 				 "<li class='level1'>"+
			                                "<a href=\"javascript:;\" onclick=\"selectLink('"+linkData[val].links[lval].link+"');\""+ 
			                                " title=\""+ linkData[val].links[lval].link +"\">"+
			                                linkData[val].links[lval].link_name+"</a></li>";
				        	 }
				        	isopen = true;
				        	isclose = true;
				        	linkId = 'link'+val;
				        	trackingLink += "<div id='"+linkId+"' onclick=\"managelinks('"+linkId+"');\" class='coursepanel coursepanel-default'>"+
											  	"<div class='coursepanel-heading'>"+linkData[val].name+"</div>"+
											  	"<div class='setarrow'></div>"+
											  	"<div class='course-child'><ul class='tree'>"+tLinks+"</ul></div>"+
											"</div>";
				        }
				        htmlLinkData = "<div class='linklist'>"+trackingLink+"</div>";
						editor.execCommand('openTrackLinkModal');
				    }
				});
		    }
		});
    }
});
function managelinks(linkId){
	var parentID = document.getElementById(linkId);
	var setArrow = parentID.getElementsByClassName('setarrow');
	var subs = parentID.getElementsByClassName('course-child');
	var correctIsVisible = subs[0].offsetHeight;

 	if(correctIsVisible>0){
 		subs[0].style.display = 'none';
 		setArrow[0].style.backgroundImage= "url('images/arrow-right.png')";
 	}
 	else{
 		subs[0].style.display = 'block';
 		setArrow[0].style.backgroundImage= "url('images/arrow-down.png')";
 	}
}
function selectLink(link){
		var selectedText = trackingEditor.getSelection().getNative();
		trackingEditor.insertHtml("<a href=\""+link+"\" target=\"_blank\">" + selectedText + "</a>");
		CKEDITOR.dialog.getCurrent().hide();
	}