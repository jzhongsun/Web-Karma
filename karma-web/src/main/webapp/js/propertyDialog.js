var PropertyDialog = (function() {

	var instance = null;


	function PrivateConstructor() {
		var dialog = $("#propertyDialog");
		var menuId = "propertyFunctions";
		var rightDiv;

		var worksheetId;
		var alignmentId;
		var propertyId, propertyUri, propertyLabel;
		var sourceNodeId, sourceLabel, sourceDomain, sourceId, sourceNodeType, sourceIsUri;
		var targetNodeId, targetLabel, targetDomain, targetId, targetNodeType, targetIsUri;
		var propertyTabs;
		var propertyLiteralType, propertyIsSubClass, propertyLanguage;

		var options = [
			//Title, function to call, needs file upload     
			// ,
			["Change Link", changeLinkUI],
			["Advanced Options", advanceOptionsUI],
			["Delete", deleteLink],
			// ["divider", null],
			["Change From", changeFromUI],
			["Change To", changeToUI]
		];

		function init() {
			propertyTabs = PropertyTabs.getInstance();
			reloadCache();
			generateJS();
			rightDiv = $("#propertyDialogRight");
		}

		function reloadCache() {
			propertyTabs.reloadCache();
		}

		function getDefaultProperty() {
			return propertyTabs.getDefaultProperty();
		}

		function hide() {
			propertyTabs.hide();
			dialog.modal('hide');
		}

		function hideError() {
			$("div.error", dialog).hide();
		}

		function showError(err) {
			if (err) {
				$("div.error", dialog).text(err);
			}
			$("div.error", dialog).show();
		}

		function changeLinkUI(event) {
			initRightDiv("Change Link");
			propertyTabs.show(worksheetId, alignmentId, propertyId, propertyUri, 
													sourceNodeId, sourceNodeType, sourceLabel, sourceDomain, sourceId, sourceIsUri,
													targetNodeId, targetNodeType, targetLabel, targetDomain, targetId, targetIsUri,
													rightDiv, selectPropertyFromMenu,
													event);
		}

		function initRightDiv(mode, title) {
			showFunctionsMenu();
			disableItem(mode);
			if(title)
				setTitle(title)
			else
				setTitle(mode);
			var firstChild = rightDiv.children();
			firstChild.hide();
			$("body").append(firstChild);
			rightDiv.empty();
		}

		function deleteLink(event) {
			console.log("deleteLink");
			if (confirm("Are you sure you wish to delete the link?")) {
				var info;
				hide();
				if(targetNodeType == "ColumnNode") {
					info = generateInfoObject(worksheetId, targetNodeId, "UnassignSemanticTypeCommand");
					info["newInfo"] = JSON.stringify(info['newInfo']);
				} else {
					info = generateInfoObject(worksheetId, "", "ChangeInternalNodeLinksCommand");
	
					// Prepare the input for command
					var newInfo = info['newInfo'];
	
					// Put the old edge information
					var initialEdges = [];
					var oldEdgeObj = {};
					oldEdgeObj["edgeSourceId"] = sourceNodeId;
					oldEdgeObj["edgeTargetId"] = targetNodeId;
					oldEdgeObj["edgeId"] = propertyUri;
					initialEdges.push(oldEdgeObj);
					newInfo.push(getParamObject("initialEdges", initialEdges, "other"));
					newInfo.push(getParamObject("alignmentId", alignmentId, "other"));
					var newEdges = [];
					newInfo.push(getParamObject("newEdges", newEdges, "other"));
					info["newInfo"] = JSON.stringify(newInfo);
					info["newEdges"] = newEdges;
				}

				showLoading(worksheetId);
				var returned = sendRequest(info, worksheetId);
			}
			event.preventDefault();
		}

		function advanceOptionsUI(event) {
			initRightDiv("Advanced Options");
			PropertyAdvanceOptionsDialog.getInstance().show(propertyLiteralType, 
						propertyLanguage, propertyIsSubClass, 
						rightDiv, saveAdvanceOptions);
		}

		function saveAdvanceOptions(literalType, language, isSubclassOfClass) {
			if(isSubclassOfClass) {
				setSubClassSemanticType(worksheetId, targetId, {"uri": sourceDomain, 
					"id": sourceId, "label":sourceLabel}, literalType, language);
			} else {
				var type = {};
				type.label = propertyLabel;
				type.uri = propertyUri;
				type.source = {"uri": sourceDomain, "label": sourceLabel, "id": sourceId};
				type.target = {"uri": targetDomain, "label": targetLabel, "id": targetId};
				setSemanticType(worksheetId, targetId, type, literalType, language);
			}
			hide();
		}

		function changeFromUI(event) {
			initRightDiv("Change From", "Change From Class for Link");

			ClassTabs.getInstance().show(worksheetId, sourceNodeId, sourceLabel, sourceDomain, 
				alignmentId, sourceNodeType, rightDiv, function(clazz) {
					if(targetNodeType == "ColumnNode") {
						var type = {};
						type.label = propertyLabel;
						type.uri = propertyUri;
						type.source = clazz;
						type.target = {"uri": targetDomain, "label": targetLabel, "id": targetId};
						setSemanticType(worksheetId, targetId, type, propertyLiteralType, propertyLanguage);
					} else {
						//Change Links command
						oldEdges = [];
						var oldEdgeObj = {};
						oldEdgeObj["source"] = {"id": sourceId, "uri":sourceDomain, "label": sourceLabel};
						oldEdgeObj["target"] = {"id": targetId, "uri":targetDomain, "label": targetLabel};
						oldEdgeObj["uri"] = propertyUri;
						oldEdges.push(oldEdgeObj);

						// Put the new edge information
						var newEdges = [];
						var newEdgeObj = {};
						newEdgeObj["source"] = clazz;
						newEdgeObj["target"] = {"id": targetId, "uri":targetDomain, "label": targetLabel};
						newEdgeObj["uri"] = propertyUri;
						newEdges.push(newEdgeObj);

						changeLinks(worksheetId, alignmentId, oldEdges, newEdges);
					}
					hide();
				},
				event);

		}

		function changeToUI(event) {
			initRightDiv("Change To", "Change To Class for Link");

			ClassTabs.getInstance().show(worksheetId, targetNodeId, targetLabel, targetDomain, 
				alignmentId, targetNodeType, rightDiv, function(clazz) {
					//Change Links command
					oldEdges = [];
					var oldEdgeObj = {};
					oldEdgeObj["source"] = {"id": sourceId, "uri":sourceDomain, "label": sourceLabel};
					oldEdgeObj["target"] = {"id": targetId, "uri":targetDomain, "label": targetLabel};
					oldEdgeObj["uri"] = propertyUri;
					oldEdges.push(oldEdgeObj);

					// Put the new edge information
					var newEdges = [];
					var newEdgeObj = {};
					newEdgeObj["source"] = {"id": sourceId, "uri":sourceDomain, "label": sourceLabel};
					newEdgeObj["target"] = clazz;
					newEdgeObj["uri"] = propertyUri;
					newEdges.push(newEdgeObj);

					changeLinks(worksheetId, alignmentId, oldEdges, newEdges);
					hide();
				},
				event);
		}

		function selectPropertyFromMenu(property, event) {
			console.log("Selected property:" + label);
			if(sourceDomain == "BlankNode" || targetDomain == "BlankNode") {
				D3ModelManager.getInstance().changeTemporaryLink(worksheetId, propertyId, property.uri, property.label);
				event.stopPropagation();
				hide();
			} else {
				if(targetNodeType == "ColumnNode") {
					var type = {
						"label": property.label,
						"uri": property.uri,
						"source": {"id": sourceId, "uri":sourceDomain, "label": sourceLabel}
					}
					setSemanticType(worksheetId, targetId, type, propertyLiteralType, propertyLanguage);
				} else {
					oldEdges = [];
					var oldEdgeObj = {};
					oldEdgeObj["source"] = {"id": sourceId, "uri":sourceDomain, "label": sourceLabel};
					oldEdgeObj["target"] = {"id": targetId, "uri":targetDomain, "label": targetLabel};
					oldEdgeObj["uri"] = propertyUri;
					oldEdges.push(oldEdgeObj);

					// Put the new edge information
					var newEdges = [];
					var newEdgeObj = {};
					newEdgeObj["source"] = {"id": sourceId, "uri":sourceDomain, "label": sourceLabel};
					newEdgeObj["target"] = {"id": targetId, "uri":targetDomain, "label": targetLabel};
					newEdgeObj["uri"] = property.uri
					newEdges.push(newEdgeObj);

					changeLinks(worksheetId, alignmentId, oldEdges, newEdges);
				}
			}
			hide();
		}


		function setTitle(title) {
			$("#propertyDialog_title", dialog).html(title + ": " + propertyLabel);
		}


		function generateJS() {
			var btnList = $("<div>").addClass("btn-group-vertical").css("display", "block");
			for (var i = 0; i < options.length; i++) {
				var option = options[i];

				var btn = $("<button>").addClass("btn").addClass("btn-default")
						.text(option[0])
						.click(option[1]);

				btnList.append(btn);

				if(i % 2 == 0)
					btn.addClass("list-even");
				else
					btn.addClass("list-odd");
				
			}

			var div = $("<div>")
				.attr("id", menuId)
				.append(btnList);

			var container = $("#propertyDialogFunctions");
			container.append(div);
		}

		function enableAllItems() {
			var btns = $("button", "#" + menuId);
			for(var i=0; i<btns.length; i++) {
				var btn = $(btns[i]);
				btn.removeClass("disabled");
				btn.prop("disabled", false);
			}
		}

		function disableAllItems() {
			var btns = $("button", "#" + menuId);
			for(var i=0; i<btns.length; i++) {
				var btn = $(btns[i]);
				btn.addClass("disabled");
				btn.prop("disabled", true);
			}
		}
		
		function disableItem(value) {
			var btns = $("button", "#" + menuId);
			for(var i=0; i<btns.length; i++) {
				var btn = $(btns[i]);
				if(btn.text() == value) {
					btn.addClass("disabled");
					btn.prop("disabled", true);
					break;
				}
			}
		}

		function enableItem(value) {
			var btns = $("button", "#" + menuId);
			for(var i=0; i<btns.length; i++) {
				var btn = $(btns[i]);
				if(btn.text() == value) {
					btn.removeClass("disabled");
					btn.prop("disabled", false);
					break;
				}
			}
		}

		function showFunctionsMenu() {
			$("#propertyDialogFunctions", dialog).show();
			if(sourceNodeType == "Link") {
				disableAllItems();
				enableItem("Delete");
			} else {
				enableAllItems();
				if (sourceNodeType == "ColumnNode" || sourceNodeType == "LiteralNode") {
					disableItem ("Change From");
				}

				if (targetNodeType == "ColumnNode" || targetNodeType == "LiteralNode") {
					disableItem("Change To");
				}

				if(targetNodeType  != "ColumnNode")
					disableItem("Advanced Options");
			}
			rightDiv.removeClass("col-sm-12").addClass("col-sm-10");
		}

		function hideFunctionsMenu() {
			$("#propertyDialogFunctions", dialog).hide();
			rightDiv.removeClass("col-sm-10").addClass("col-sm-12");
		}

		function show(p_worksheetId, p_alignmentId, p_propertyId, p_propertyUri, p_propertyLabel, p_propertyStatus,
			p_sourceNodeId, p_sourceNodeType, p_sourceLabel, p_sourceDomain, p_sourceId, p_sourceIsUri,
			p_targetNodeId, p_targetNodeType, p_targetLabel, p_targetDomain, p_targetId, p_targetIsUri,
			event) {
			worksheetId = p_worksheetId;
			alignmentId = p_alignmentId;
			propertyId = p_propertyId;
			linkStatus = p_propertyStatus;
			propertyUri = p_propertyUri;
			propertyLabel = p_propertyLabel;

			sourceNodeId = p_sourceNodeId;
			sourceLabel = p_sourceLabel;
			sourceDomain = p_sourceDomain;
			sourceId = p_sourceId;
			sourceIsUri = p_sourceIsUri;
			targetNodeId = p_targetNodeId;
			targetLabel = p_targetLabel;
			targetDomain = p_targetDomain;
			targetId = p_targetId;
			targetIsUri = p_targetIsUri;
			
			sourceNodeType = p_sourceNodeType;
			targetNodeType = p_targetNodeType;

			$("input", dialog).val('');

			propertyIsSubClass = false;
			propertyLiteralType = "";
			propertyLanguage = "";

			if(p_targetNodeType == "ColumnNode") {
				var tdTag = $("td#" + targetNodeId);
				var typeJsonObject = $(tdTag).data("typesJsonObject");
				if (typeJsonObject) {
					existingTypes = typeJsonObject["SemanticTypesArray"];
				} else {
					existingTypes = [];
				}
				$.each(existingTypes, function(index, type) {
					if (type["DisplayLabel"] == "km-dev:columnSubClassOfLink") {
						propertyIsSubClass = true;
						propertyLiteralType = type["rdfLiteralType"];
						propertyLanguage = type["language"]
					} else {
						if(type["rdfLiteralType"])
							propertyLiteralType = type["rdfLiteralType"];
						if(type["language"])
							propertyLanguage = type["language"];
					} 
				});
			}

			$("#propertyDialog_title", dialog).html("Link: " + propertyLabel);
			if(sourceNodeType == "Link") {
				showFunctionsMenu();
				rightDiv.hide();
			} else {
				rightDiv.show();
				changeLinkUI();
				if(linkStatus == "TemporaryLink") {
					hideFunctionsMenu();
				}
			}

			dialog.modal({
				keyboard: true,
				show: true,
				backdrop: 'static'
			});
		};


		return { //Return back the public methods
			show: show,
			init: init,
			setTitle: setTitle,
			getDefaultProperty: getDefaultProperty,
			reloadCache: reloadCache
		};
	};

	function getInstance() {
		if (!instance) {
			instance = new PrivateConstructor();
			instance.init();
		}
		return instance;
	}

	return {
		getInstance: getInstance
	};


})();


var PropertyAdvanceOptionsDialog = (function() {

	var instance = null;

	function PrivateConstructor() {
		var callback;
		var dialog = $("#propertyAdvanceOptions");

		function init() {
			$("#btnSaveAdvanceOptions").on("click", function(e) {
				var literalType = $("#propertyLiteralType", dialog).val();
				var language = $("#propertyLanguage", dialog).val();
				var isSubclassOfClass = $("#propertyIsSubclass", dialog).is(':checked');
				callback(literalType, language, isSubclassOfClass);	
			});	
			$("#propertyLiteralType").typeahead( 
				{source:LITERAL_TYPE_ARRAY, minLength:0, items:"all"});
			$("#propertyLanguage").typeahead(
				{source:LANGUAGE_ARRAY, minLength:0, items:"all"});
		}

		function show(rdfLiteralType, language, isSubClass, div, p_callback) {
			callback = p_callback;

			$("#propertyLiteralType", dialog).val(rdfLiteralType);
			$("#propertyLanguage", dialog).val(language);
			$("div#propertyAdvanceOptions input:checkbox").prop('checked', isSubClass);
			
			div.append(dialog);
			dialog.show();
		}

		function hide() {
			dialog.hide();
		}

		return { //Return back the public methods
			show: show,
			init: init,
			hide: hide
		};
	};

	function getInstance() {
		if (!instance) {
			instance = new PrivateConstructor();
			instance.init();
		}
		return instance;
	}

	return {
		getInstance: getInstance
	};


})();

