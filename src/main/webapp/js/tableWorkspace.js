/*******************************************************************************
 * Copyright 2012 University of Southern California
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *  http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * This code was developed by the Information Integration Group as part 
 * of the Karma project at the Information Sciences Institute of the 
 * University of Southern California.  For more information, publications, 
 * and related projects, please see: http://www.isi.edu/integration
 ******************************************************************************/

function styleAndAssignHandlersToWorksheetOptionButtons() {
	var optionsDiv = $("div#WorksheetOptionsDiv");
	// Styling the elements
	optionsDiv.addClass("ui-corner-all");
	$("button", optionsDiv).button();
	
	// Adding mouse handlers to the div
	optionsDiv.mouseenter(function() {
		if ($(this).data("timer") != null)
			clearTimeout($(this).data("timer"));
		$(this).show();
	});
	optionsDiv.mouseleave(function() {
		var timer = setTimeout(function() {
  			$("#WorksheetOptionsDiv").hide();
		}, 700);
		$(this).data("timer", timer);
	});
	
	// Adding handlers to the buttons
	 $("button#csvExport").click(function(){
        optionsDiv.hide();
        var info = new Object();
        info["vWorksheetId"] = optionsDiv.data("worksheetId");
        info["workspaceId"] = $.workspaceGlobalInformation.id;
        info["command"] = "PublishCSVCommand";
            
        showLoading(info["vWorksheetId"]);
        var returned = $.ajax({
            url: "RequestController", 
            type: "POST",
            data : info,
            dataType : "json",
            complete : 
                function (xhr, textStatus) {
                    //alert(xhr.responseText);
                    var json = $.parseJSON(xhr.responseText);
                    parse(json);
                    hideLoading(info["vWorksheetId"]);
                },
            error :
                function (xhr, textStatus) {
                    alert("Error occured while exporting CSV!" + textStatus);
                    hideLoading(info["vWorksheetId"]);
                }          
        });
        
    });
	 
//	$('button#saveR2RMLToTripleStore').click(function(event){
//		handlePublishModelToStoreButton(event);
//	});
	 
    $("button#mdbExport").click(function(){
        optionsDiv.hide();
        var info = new Object();
        info["vWorksheetId"] = optionsDiv.data("worksheetId");
        info["workspaceId"] = $.workspaceGlobalInformation.id;
        info["command"] = "PublishMDBCommand";
            
        showLoading(info["vWorksheetId"]);
        var returned = $.ajax({
            url: "RequestController", 
            type: "POST",
            data : info,
            dataType : "json",
            complete : 
                function (xhr, textStatus) {
                    //alert(xhr.responseText);
                    var json = $.parseJSON(xhr.responseText);
                    parse(json);
                    hideLoading(info["vWorksheetId"]);
                },
            error :
                function (xhr, textStatus) {
                    alert("Error occured while exporting MDB!" + textStatus);
                    hideLoading(info["vWorksheetId"]);
                }          
        });
        
    });
    $("button#spatialdataExport").click(function(){
        optionsDiv.hide();
        var info = new Object();
        info["vWorksheetId"] = optionsDiv.data("worksheetId");
        info["workspaceId"] = $.workspaceGlobalInformation.id;
        info["command"] = "PublishSpatialDataCommand";

        showLoading(info["vWorksheetId"]);
        var returned = $.ajax({
            url: "RequestController",
            type: "POST",
            data : info,
            dataType : "json",
            complete :
                function (xhr, textStatus) {
                    //alert(xhr.responseText);
                    var json = $.parseJSON(xhr.responseText);
                    parse(json);
                    hideLoading(info["vWorksheetId"]);
                },
            error :
                function (xhr, textStatus) {
                    alert("Error occured while exporting spatial data!" + textStatus);
                    hideLoading(info["vWorksheetId"]);
                }
        });

    });
	$("button#showModel").click(function(){
		optionsDiv.hide();
		 //alert("test");
		// console.log("Showing model for table with ID: " +optionsDiv.data("worksheetId"));
		var info = new Object();
		info["vWorksheetId"] = optionsDiv.data("worksheetId");
		info["workspaceId"] = $.workspaceGlobalInformation.id;
		info["command"] = "ShowModelCommand";
	   
	    var newInfo = [];
        newInfo.push(getParamObject("vWorksheetId", optionsDiv.data("worksheetId"), "vWorksheetId"));
        newInfo.push(getParamObject("checkHistory", true, "other"));
        info["newInfo"] = JSON.stringify(newInfo);
	   
		showLoading(info["vWorksheetId"]);
		var returned = $.ajax({
		   	url: "RequestController", 
		   	type: "POST",
		   	data : info,
		   	dataType : "json",
		   	complete : 
		   		function (xhr, textStatus) {
		   			//alert(xhr.responseText);
		    		var json = $.parseJSON(xhr.responseText);
		    		parse(json);
		    		hideLoading(info["vWorksheetId"]);
			   	},
			error :
				function (xhr, textStatus) {
		   			alert("Error occured while generating semantic types!" + textStatus);
		   			hideLoading(info["vWorksheetId"]);
			   	}		   
		});
	});
	
	
	$("button#showR2RMLFromTripleStore").click(function(event) {
		var dialog = $('#FetchR2RMLModelDialogBox');
		$('#txtR2RML_URL_fetch').val('http://'+window.location.host + '/openrdf-sesame/repositories/karma_models');
		dialog.dialog(
			{ title: 'Triple store URL',
				buttons: { "Cancel": function() { $(this).dialog("close"); }, 
					"Fetch": renderR2RMLModels }, width: 400, height: 150});
	
		
		
//		var modelListRadioBtnGrp = $("#modelListRadioBtnGrp");
//		modelListRadioBtnGrp.append('<input type="radio" name="group1" value="test2" />test2 <br />');
//		modelListRadioBtnGrp.append('<input type="radio" name="group1" value="this_is_test" />this_is_test');
//		
//		modelListDiv.dialog({ title: 'Select a model to be applied',
//			buttons: { "Cancel": function() { $(this).dialog("close"); }, "Select": function(){ alert('yo'); } }, width: 300, height: 150, position: positionArray});
//		
//		return;
	});
	
	$("button#showAutoModel").click(function(){
		optionsDiv.hide();
		 //alert("test");
		// console.log("Showing model for table with ID: " +optionsDiv.data("worksheetId"));
		var info = new Object();
		info["vWorksheetId"] = optionsDiv.data("worksheetId");
		info["workspaceId"] = $.workspaceGlobalInformation.id;
		info["command"] = "ShowAutoModelCommand";
	   
	    var newInfo = [];
        newInfo.push(getParamObject("vWorksheetId", optionsDiv.data("worksheetId"), "vWorksheetId"));
        newInfo.push(getParamObject("checkHistory", true, "other"));
        info["newInfo"] = JSON.stringify(newInfo);
	   
		showLoading(info["vWorksheetId"]);
		var returned = $.ajax({
		   	url: "RequestController", 
		   	type: "POST",
		   	data : info,
		   	dataType : "json",
		   	complete : 
		   		function (xhr, textStatus) {
		   			//alert(xhr.responseText);
		    		var json = $.parseJSON(xhr.responseText);
		    		parse(json);
		    		hideLoading(info["vWorksheetId"]);
			   	},
			error :
				function (xhr, textStatus) {
		   			alert("Error occured while generating the automatic model!" + textStatus);
		   			hideLoading(info["vWorksheetId"]);
			   	}		   
		});
	});
	
	$("button#hideModel").click(function(){
		optionsDiv.hide();
		$("div#svgDiv_" + optionsDiv.data("worksheetId")).remove();
	});
	
	$("button#resetModel").click(function(){
		optionsDiv.hide();
		
		var info = new Object();
		info["vWorksheetId"] = optionsDiv.data("worksheetId");
		info["workspaceId"] = $.workspaceGlobalInformation.id;
		info["command"] = "ResetModelCommand";
			
		showLoading(info["vWorksheetId"]);
		var returned = $.ajax({
		   	url: "RequestController", 
		   	type: "POST",
		   	data : info,
		   	dataType : "json",
		   	complete : 
		   		function (xhr, textStatus) {
		   			//alert(xhr.responseText);
		    		var json = $.parseJSON(xhr.responseText);
		    		parse(json);
		    		hideLoading(info["vWorksheetId"]);
			   	},
			error :
				function (xhr, textStatus) {
		   			alert("Error occured while removing semantic types!" + textStatus);
		   			hideLoading(info["vWorksheetId"]);
			   	}		   
		});
	});

    $("button#publishRDF").click(function(){
		optionsDiv.hide();
		showHideRdfInfo();
		getRDFPreferences();
		var rdfDialogBox = $("div#PublishRDFDialogBox");
		// Show the dialog box
		rdfDialogBox.dialog({width: 300
			, buttons: { "Cancel": function() { $(this).dialog("close"); }, "Submit": publishRDFFunction }});

	});

	$("button#publishDatabase").click(function(){
		optionsDiv.hide();
		getDatabasePreferences();
		var dbDialogBox = $("div#PublishDatabaseDialogBox");
		// Show the dialog box
		dbDialogBox.dialog({width: 300
			, buttons: { "Cancel": function() { $(this).dialog("close"); }, "Submit": publishDatabaseFunction }});
	});
	
	$("button#populateSource").click(function(){
        optionsDiv.hide();
        
        var info = new Object();
//        info["vWorksheetId"] = optionsDiv.data("worksheetId");
        info["workspaceId"] = $.workspaceGlobalInformation.id;
        info["command"] = "PopulateCommand";

        var newInfo = [];	// Used for commands that take JSONArray as input
        newInfo.push(getParamObject("vWorksheetId", optionsDiv.data("worksheetId"), "vWorksheetId"));
        info["newInfo"] = JSON.stringify(newInfo);

        showLoading(info["vWorksheetId"]);
        var returned = $.ajax({
            url: "RequestController", 
            type: "POST",
            data : info,
            dataType : "json",
            complete : 
                function (xhr, textStatus) {
                    //alert(xhr.responseText);
                    var json = $.parseJSON(xhr.responseText);
                    parse(json);
                    hideLoading(info["vWorksheetId"]);
                },
            error :
                function (xhr, textStatus) {
                    alert("Error occured while populating source!" + textStatus);
                    hideLoading(info["vWorksheetId"]);
                }          
        });
        
    });
    
    $("button#publishServiceModel").click(function(){
        optionsDiv.hide();
        
        var info = new Object();
        info["vWorksheetId"] = optionsDiv.data("worksheetId");
        info["workspaceId"] = $.workspaceGlobalInformation.id;
        info["command"] = "PublishModelCommand";
            
        showLoading(info["vWorksheetId"]);
        var returned = $.ajax({
            url: "RequestController", 
            type: "POST",
            data : info,
            dataType : "json",
            complete : 
                function (xhr, textStatus) {
                    //alert(xhr.responseText);
                    var json = $.parseJSON(xhr.responseText);
                    parse(json);
                    hideLoading(info["vWorksheetId"]);
                },
            error :
                function (xhr, textStatus) {
                    alert("Error occured while publishing service model!" + textStatus);
                    hideLoading(info["vWorksheetId"]);
                }          
        });
        
    });
    
    $("button#publishWorksheetHistory").click(function(){
        optionsDiv.hide();
        
        var info = new Object();
        info["vWorksheetId"] = optionsDiv.data("worksheetId");
        info["workspaceId"] = $.workspaceGlobalInformation.id;
        info["command"] = "PublishWorksheetHistoryCommand";
            
        showLoading(info["vWorksheetId"]);
        var returned = $.ajax({
            url: "RequestController", 
            type: "POST",
            data : info,
            dataType : "json",
            complete : 
                function (xhr, textStatus) {
                    //alert(xhr.responseText);
                    var json = $.parseJSON(xhr.responseText);
                    parse(json);
                    hideLoading(info["vWorksheetId"]);
                },
            error :
                function (xhr, textStatus) {
                    alert("Error occured while publishing worksheet history!" + textStatus);
                    hideLoading(info["vWorksheetId"]);
                }          
        });
        
    });
	
	$("#applyWorksheetHistory").fileupload({
        add : function (e, data) {
            $("#applyWorksheetHistory").fileupload({
                url: "RequestController?workspaceId=" + $.workspaceGlobalInformation.id +
                    "&command=ApplyHistoryFromR2RMLModelCommand&vWorksheetId="+optionsDiv.data("worksheetId")
            });
            showLoading(optionsDiv.data("worksheetId"));
            data.submit();
        },
        done: function(e, data) {
            $("div.span5", optionsDiv).remove();
            parse(data.result);
            hideLoading(optionsDiv.data("worksheetId"));
        },
        fail: function(e, data) {
            $.sticky("History file upload failed!");
            hideLoading(optionsDiv.data("worksheetId"));
        },
        dropZone: null
    });
     $("button#transformcolumns").click(handleColumnsTransformation);

    // in pytransform.js
    $("button#pyTransform").click(openPyTransformDialogBox);

    $("button#publishR2RML").click(function(event){
        optionsDiv.hide();
        handlePublishModelToStoreButton(event);

        
        /*
        var info = new Object();
        info["vWorksheetId"] = optionsDiv.data("worksheetId");
        info["workspaceId"] = $.workspaceGlobalInformation.id;
        info["command"] = "GenerateR2RMLModelCommand";

        showLoading(info["vWorksheetId"]);
        var returned = $.ajax({
            url: "RequestController",
            type: "POST",
            data : info,
            dataType : "json",
            complete :
                function (xhr, textStatus) {
                    var json = $.parseJSON(xhr.responseText);
                    parse(json);
                    hideLoading(info["vWorksheetId"]);
                },
            error :
                function (xhr, textStatus) {
                    alert("Error occured while publishing service model!" + textStatus);
                    hideLoading(info["vWorksheetId"]);
                }
        });
        */

    });

    $('#serviceOptions').click( function() {
        $('#worksheetServiceOptions').toggle();
    });


    $('#serviceRequestMethod').change(function() {
        if ($(this).attr('value') == "POST") {
            $("#servicePostOptions").show();
        } else {
            $("#servicePostOptions").hide();
        }
    });

    $("#setWorksheetProperties").click(function(){
        optionsDiv.hide();
        var settingsBox = $("div#setPropertiesDialog");

        // Show the dialog box
        settingsBox.dialog({width: 300, title: "Set Properties"
            , buttons: { "Cancel": function() { $(this).dialog("close"); }, "Submit": submitWorksheetProperties }});

        // Close the service options
        if ($('#worksheetServiceOptions').is(':visible')) {
            $('#serviceOptions').trigger('click');
        }

        // Check for existing values
        fetchExistingWorksheetOptions(optionsDiv.data("worksheetId"));
    });

}

function openWorksheetOptions(event) {
	$("div#WorksheetOptionsDiv")
			.css({'position':'fixed', 'left':(event.clientX - 75) + 'px', 'top':(event.clientY+4)+'px'})
			.data("worksheetId", $(this).parents("div.Worksheet").attr("id"))
			.show();
}

function showSemanticTypeInfo() {
	// var crfData = $(this).data("crfInfo");
	// var table = $("div#ColumnCRFModelInfoBox table");
	// $("tr", table).remove();
// 	
	// $.each(crfData["Labels"], function(index, label) {
		// var trTag = $("<tr>");
		// trTag.append($("<td>").text(label["Type"]))
			// .append($("<td>").text(label["Probability"]));
	// });
}

function hideSemanticTypeInfo() {
	
}

function styleAndAssignHandlersToTableCellMenu() {
	var optionsDiv = $("div#tableCellMenuButtonDiv");
	var tableCellMenu = $("div#tableCellToolBarMenu");
	
	// Stylize the buttons
	$("button", tableCellMenu).button();
	
	// Assign handlers
	optionsDiv.click(openTableCellOptions)
		.button({
			icons: {
				primary: 'ui-icon-triangle-1-s'
		    },
			text: false
			})
		.mouseenter(function(){
			$(this).show();
		})	
		.mouseleave(function(){
			tableCellMenu.hide();
	})
	
	$("button#editCellButton").click(function(event){
		handleTableCellEditButton(event);
	});
	
	$("button#expandValueButton" ).click(function(event){
		handleTableCellExpandButton(event);
	});
	
	// Hide the option button when mouse leaves the menu
	tableCellMenu.mouseenter(function(){
		$(this).show();
	})
	.mouseleave(function() {
		optionsDiv.hide();
		$(this).hide();
	});
}

function handleTableCellExpandButton(event) {
	var tdTagId = $("#tableCellToolBarMenu").data("parentCellId");
	// Get the full expanded value
	var value = ""
	var tdTag = $("td#"+tdTagId);
	if(tdTag.hasClass("hasTruncatedValue")) {
		value = tdTag.data("fullValue");
	} else {
		value = $("span.cellValue", tdTag).text();
	}
	
	// Get the RDF text (if it exists)
	var info = new Object();
	info["nodeId"] = tdTagId;
	info["vWorksheetId"] = tdTag.parents("div.Worksheet").attr("id");
	info["workspaceId"] = $.workspaceGlobalInformation.id;
	info["command"] = "PublishRDFCellCommand";
	
	var returned = $.ajax({
	   	url: "RequestController", 
	   	type: "POST",
	   	data : info,
	   	dataType : "json",
	   	complete : 
	   		function (xhr, textStatus) {
	    		var json = $.parseJSON(xhr.responseText);
	    		if(json["elements"][0]["updateType"] == "PublishCellRDFUpdate") {
	    			var rdfText = json["elements"][0]["cellRdf"];
	    			$("div#rdfValue", expandDiv).html(rdfText);
	    		} else if (json["elements"][0]["updateType"] == "KarmaError") {
	    			var rdfText = "<i>" + json["elements"][0]["Error"] + "<i>";
	    			$("div#rdfValue", expandDiv).html(rdfText);
	    		}
		   	},
		error :
			function (xhr, textStatus) {
	   			$.sticky("Error occured while getting RDF triples for the cell! " + textStatus);
		   	}		   
	});
	
	
	var expandDiv = $("div#ExpandCellValueDialog");
	// Add the cell value
	$("div#cellExpandedValue", expandDiv).text(value);
	
	var positionArray = [event.clientX-150		// distance from left
					, event.clientY-10];	// distance from top
	expandDiv.show().dialog({height: 300, width: 500, show:'blind', position: positionArray});
}

function openTableCellOptions() {
	var tableCellMenu = $("div#tableCellToolBarMenu");
	tableCellMenu.data("parentCellId", $(this).data("parentCellId"));
	tableCellMenu.css({"position":"absolute",
		"top":$(this).offset().top + 15, 
		"left": $(this).offset().left + $(this).width()/2 - $(tableCellMenu).width()/2}).show();
}

function showTableCellMenuButton() {
	// Get the parent table
	var tdTag = $(this);
	var optionsDiv = $("div#tableCellMenuButtonDiv");
	optionsDiv.data("parentCellId", tdTag.attr("id"));
	
	// Show it at the right place
	var top = $(tdTag).offset().top + $(tdTag).height()-18;
	var left = $(tdTag).offset().left + $(tdTag).width()-25;
	optionsDiv.css({"position":"absolute",
		"top":top, 
		"left": left}).show();
}

function hideTableCellMenuButton() {
	$("div#tableCellMenuButtonDiv").hide();
}

function styleAndAssignHandlersToColumnHeadingMenu() {
	var optionsDiv = $("div#columnHeadingMenuButtonDiv");
	var columnHeadingMenu = $("div#columnHeadingDropDownMenu");
	
	$("button", columnHeadingMenu).button();
	
	optionsDiv
        .click(openColumnHeadingOptions)
		.button({
			icons: {
				primary: 'ui-icon-triangle-1-s'
		    },
			text: false
			})
		.mouseenter(function(){
			$(this).show();
		})	
		.mouseleave(function(){
			columnHeadingMenu.hide();
	});

	// Hide the option button when mouse leaves the menu
	columnHeadingMenu.mouseleave(function() {
		optionsDiv.hide();
		columnHeadingMenu.hide();
	}).mouseenter(function(){
		$(this).show();
	});
	
	// Handle split column button
	$("button#splitByComma").click(function(){
        optionsDiv.hide();
        
        var splitPanel = $("div#SplitByCommaColumnListPanel");
        splitPanel.dialog({width: 300, height: 200
           , buttons: { "Cancel": function() { $(this).dialog("close"); }, "Submit": splitColumnByComma }});
    });
	
	// Assign handler to column clean button (in cleaning.js)
    assignHandlersToCleaningPanelObjects();
    
    // Assign handler to service invocation button (in services.js)
    assignHandlersToServiceInvocationObjects();

    // Assign handler to rename column button (in table_manipulation.js)
    $("button#renameColumnButton").click(assignHandlersToRenameButton);

    // Assign handler to the add column button (in table_manipulation.js)
    $("button#addColumnButton").click(openAddNewColumnDialog);

    // Assign handler to the show chart button (in cleaning-charts.js)
    $("button#showChartButton").click(showChartButtonHandler);
}

function splitColumnByComma() {
    var columnHeadingMenu = $("div#columnHeadingDropDownMenu");
    var selectedHNodeId = columnHeadingMenu.data("parentCellId");
    var splitPanel = $("div#SplitByCommaColumnListPanel");
    
    $("div#errorPanel", splitPanel).remove();
    
    var inputVal = $("input#columnSplitDelimiter").val();
    if(inputVal != "space" && inputVal != "tab" && inputVal.length != 1) {
        splitPanel.append($("<div>").attr("id", "errorPanel").append($("<span>").addClass("error smallSizedFont").text("Length of the delimiter should be 1!")));
        return false;
    }
        
    $("div#SplitByCommaColumnListPanel").dialog("close");
    
    var info = new Object();
    info["vWorksheetId"] = $("td#" + selectedHNodeId).parents("table.WorksheetTable").attr("id");
    info["workspaceId"] = $.workspaceGlobalInformation.id;
    info["hNodeId"] = selectedHNodeId;
    info["delimiter"] = inputVal;
    info["command"] = "SplitByCommaCommand";
    
    var newInfo = [];
    newInfo.push(getParamObject("vWorksheetId", $("td#" + selectedHNodeId).parents("table.WorksheetTable").attr("id"), "vWorksheetId"));
    newInfo.push(getParamObject("hNodeId", selectedHNodeId,"hNodeId"));
    newInfo.push(getParamObject("delimiter", inputVal, "other"));
    newInfo.push(getParamObject("checkHistory", true, "other"));
    info["newInfo"] = JSON.stringify(newInfo);
            
    showLoading(info["vWorksheetId"]);
    var returned = $.ajax({
        url: "RequestController", 
        type: "POST",
        data : info,
        dataType : "json",
        complete : 
            function (xhr, textStatus) {
                // alert(xhr.responseText);
                var json = $.parseJSON(xhr.responseText);
                parse(json);
                hideLoading(info["vWorksheetId"]);
            },
        error :
            function (xhr, textStatus) {
                alert("Error occured while splitting a column by comma! " + textStatus);
                hideLoading(info["vWorksheetId"]);
            }          
    });
}

function openColumnHeadingOptions() {
	var columnHeadingMenu = $("div#columnHeadingDropDownMenu");
	columnHeadingMenu.data("parentCellId", $(this).data("parentCellId"));
	columnHeadingMenu.css({"position":"absolute",
		"top":$(this).offset().top + 15, 
		"left": $(this).offset().left + $(this).width()/2 - $(columnHeadingMenu).width()/2}).show();
}

function showColumnOptionButton(event) {
	var tdTag = $(this);
	var optionsDiv = $("div#columnHeadingMenuButtonDiv");
	optionsDiv.data("parentCellId", tdTag.attr("id"));
    
    // Show it at the right place
	var top = $(tdTag).offset().top + $(tdTag).height()-18;
	var left = $(tdTag).offset().left + $(tdTag).width()-25;
	optionsDiv.css({"position":"absolute",
		"top":top, 
		"left": left}).show();
}

function hideColumnOptionButton() {    
	$("div#columnHeadingMenuButtonDiv").hide();    
}

function showLoading(worksheetId) {
    var coverDiv = $("<div>").attr("id","WaitingDiv_"+worksheetId).addClass('waitingDiv')
        .append($("<div>").html('<b>Please wait</b>')
            .append($('<img>').attr("src","images/ajax-loader.gif"))
    );
     
    var spaceToCoverDiv = $("div#"+worksheetId);
    spaceToCoverDiv.append(coverDiv.css({"position":"absolute", "height":spaceToCoverDiv.height(), 
        "width": spaceToCoverDiv.width(), "top":spaceToCoverDiv.position().top, "left":spaceToCoverDiv.position().left}).show());
}

function hideLoading(worksheetId) {
	$("div#WaitingDiv_"+worksheetId).hide();
}

function showWaitingSignOnScreen() {
    var coverDiv = $("<div>").attr("id","WaitingDiv").addClass('waitingDiv')
        .append($("<div>").html('<b>Please wait</b>')
            .append($('<img>').attr("src","images/ajax-loader.gif"))
    );
     
    var spaceToCoverDiv = $('body');
    spaceToCoverDiv.append(coverDiv.css({"position":"fixed", "height":$(document).height(), 
        "width": $(document).width(), "zIndex":100,"top":spaceToCoverDiv.position().top, "left":spaceToCoverDiv.position().left}).show());
}

function hideWaitingSignOnScreen() {
    $("div#WaitingDiv").hide();
}

function styleAndAssignHandlersToMergeButton() {
	$("button#mergeButton").button().click(function(){
		var info = new Object();
        info["workspaceId"] = $.workspaceGlobalInformation.id;
        info["command"] = "ImportUnionResultCommand";
            
        showWaitingSignOnScreen();
        var returned = $.ajax({
            url: "RequestController", 
            type: "POST",
            data : info,
            dataType : "json",
            complete : 
                function (xhr, textStatus) {
                    //alert(xhr.responseText);
                    var json = $.parseJSON(xhr.responseText);
                    parse(json);
                    hideCleanningWaitingSignOnScreen();
                },
            error :
                function (xhr, textStatus) {
                    $.sticky("Error occured while doing merge!");
                    hideCleanningWaitingSignOnScreen();
                }          
        });
	});
}

function submitWorksheetProperties() {
    // Prepare the input data
    var worksheetProps = new Object();
    worksheetProps["modelName"] = $("#modelNameInput").val();

    // Set service options if the window is visible
    if ($('#worksheetServiceOptions').is(':visible')) {
        worksheetProps["hasServiceProperties"] = true;
        worksheetProps["serviceUrl"] = $("#serviceUrlInput").val();
        worksheetProps["serviceRequestMethod"] = $("#serviceRequestMethod option:selected").text();
        if ($("#serviceRequestMethod option:selected").text() == "POST") {
            worksheetProps["serviceDataPostMethod"] = $("input:radio[name=serviceDataPostMethod]:checked").val();
        }

    } else {
        worksheetProps["hasServiceProperties"] = false;
    }

    var info = new Object();
    info["workspaceId"] = $.workspaceGlobalInformation.id;
    info["command"] = "SetWorksheetPropertiesCommand";

    var newInfo = [];   // for input parameters
    newInfo.push(getParamObject("vWorksheetId", $("div#WorksheetOptionsDiv").data("worksheetId") ,"vWorksheetId"));
    newInfo.push(getParamObject("properties", worksheetProps, "other"));
    info["newInfo"] = JSON.stringify(newInfo);
    // Store the data to be shown later when the dialog is opened again
    $("div#" + info["vWorksheetId"]).data("worksheetProperties", worksheetProps);

    var returned = $.ajax({
        url: "RequestController",
        type: "POST",
        data : info,
        dataType : "json",
        complete :
            function (xhr, textStatus) {
                //alert(xhr.responseText);
                var json = $.parseJSON(xhr.responseText);
                parse(json);
            },
        error :
            function (xhr, textStatus) {
                $.sticky("Error occurred while setting properties!");
            }
    });
    $("div#setPropertiesDialog").dialog("close");
}


function fetchExistingWorksheetOptions(worksheetId) {
    // Uncheck the service options
    if ($("#serviceOptions").is(":checked")) {
        $("#serviceOptions").trigger("click");
    }
    $('#serviceRequestMethod').val('GET')
        .trigger('change');
    $("#servicePostOptions").hide();

    var info = new Object();
    info["workspaceId"] = $.workspaceGlobalInformation.id;
    info["command"] = "FetchExistingWorksheetPropertiesCommand";
    info["vWorksheetId"] = worksheetId;

    var returned = $.ajax({
        url: "RequestController",
        type: "POST",
        data : info,
        dataType : "json",
        complete :
            function (xhr, textStatus) {
                var json = $.parseJSON(xhr.responseText);
                var props = json["elements"][0]["properties"];

                // Set model name
                if (props["modelName"] != null) {
                    $("#modelNameInput").val(props["modelName"]);
                } else {
                    $("#modelNameInput").val("");
                }
                // Set service options if present
                if (props["hasServiceProperties"]) {
                    // Select the service option checkbox
                    $("#serviceOptions").trigger("click");

                    // Set the service URL
                    if (props["serviceUrl"] != null) {
                        $("#serviceUrlInput").val(props["serviceUrl"]);
                    } else {
                        $("#serviceUrlInput").val("");
                    }

                    // Set the request method
                    var index = (props["serviceRequestMethod"] === "GET") ? 0 : 1;
                    $('#serviceRequestMethod option').eq(index).prop('selected', true);

                    // Set the POST request invocation method
                    if (props["serviceRequestMethod"] === "POST") {
                        $("#servicePostOptions").show();
                        $(":radio[value=" +props["serviceDataPostMethod"]+"]").prop('checked',true);
                    }

                } else {
                    $("#serviceUrlInput").val("");
                    $('#serviceRequestMethod option').eq(0).prop('selected', true);
                }
            },
        error :
            function (xhr, textStatus) {
                $.sticky("Error occurred while fetching worksheet properties!");
            }
    });
}

function renderR2RMLModels() {
	var optionsDiv = $("div#WorksheetOptionsDiv");
	$('#FetchR2RMLModelDialogBox').dialog("close");
	var info = new Object();
	info["vWorksheetId"] = optionsDiv.data("worksheetId");
	info["workspaceId"] = $.workspaceGlobalInformation.id;
	info["command"] = "FetchR2RMLModelsCommand";
	info['tripleStoreUrl'] = $('#txtR2RML_URL_fetch').val();
	
	var returned = $.ajax({
	   	url: "RequestController", 
	   	type: "POST",
	   	data : info,
	   	dataType : "json",
	   	complete : 
	   		function (xhr, textStatus) {
	    		var json = $.parseJSON(xhr.responseText);
	    		parse(json);
	    		hideLoading(info["vWorksheetId"]);
		   	},
		error :
			function (xhr, textStatus) {
	   			alert("Error occured while generating the automatic model!" + textStatus);
	   			hideLoading(info["vWorksheetId"]);
		   	}		   
	});				
}



