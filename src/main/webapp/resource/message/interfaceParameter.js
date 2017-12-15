var interfaceId; //当前的测试id
var parameterId;//当前正在操作的参数
var currIndex;//当前正在操作的layer窗口的index

//导入报文参数
var showHtml = '<div class="page-container">'+
	'<div class="cl pd-5 bg-1 bk-gray mt-0"> <span class="l">'+
	'<a href="javascript:;" id="parse-message-to-parameters" class="btn btn-danger radius">解析报文</a>'+
	'</span><span class="r">'+
	'<span class="select-box radius"><select class="select" size="1" id="messageType">'+
	'<option value="JSON" selected>JSON格式</option>'+
	'<option value="XML">XML格式</option>'+
	'<option value="URL">URL格式</option>'+
	'<option value="FIXED">固定报文</option>'+
	'<option value="OPT">自定义报文</option>'+
	'</select></span>'+
	'</span></div><br><textarea style="height: 240px;" class="textarea radius" '+
	'id="jsonParams" placeholder="输入接口报文"></textarea></div>';

//查看参数节点图
var showParameterTreeHtml;

var templateParams = {
		tableTheads:["标识", "名称", "默认值", "路径", "类型", "备注", "操作"],
		btnTools:[{
			type:"primary",
			size:"M",
			id:"add-object",
			iconFont:"&#xe600;",
			name:"添加参数"
		},{
			type:"danger",
			size:"M",
			id:"batch-del-object",
			iconFont:"&#xe6e2;",
			name:"批量删除"
		},{
			type:"primary",
			size:"M",
			id:"batch-add-object",
			iconFont:"&#xe645;",
			name:"导入报文"
		},{
			type:"success",
			size:"M",
			id:"view-structure-ztree",
			iconFont:"&#xe6cf;",
			name:"预览节点树"
		}],
		formControls:[
		{
			edit:true,
			label:"ID",  	
			objText:"parameterIdText",
			input:[{	
				hidden:true,
				name:"parameterId"
				}]
		},
		{
			required:true,
			label:"标识",  
			input:[{	
				name:"parameterIdentify",
				placeholder:"输入2-255个字母"
				}]
		},
		{	
			label:"名称",  			
			input:[{	
				name:"parameterName",
				placeholder:"输入中文名称"
				}]
		},
		{	
			label:"默认值",  			
			input:[{	
				name:"defaultValue"
				}]
		},
		{
			 label:"节点路径",
			 input:[{
				 hidden:true,
				 name:"path"
				}],
			 button:[{
				 style:"success",
				 value:"选择",
				 name:"choose-new-path"
			}]					 
		 },
		{	
			required:true,
			label:"节点类型",  			
			select:[{	
				name:"type",
				option:[{
					value:"Array",
					text:"Array"
				},{
					value:"Map",
					text:"Map"
				},{
					value:"String",
					text:"String"
				},{
					value:"Number",
					text:"Number"
				},{
					value:"List",
					text:"List"
				}]
			}]
		},
		{
			label:"备注",  			
			textarea:[{
				name:"mark"
			}]
		},
		{
			name:"interfaceInfo.interfaceId",
		}]		
	};

var rootPid;
var columnsSetting = [
                      {
                      	"data":null,
                      	"render":function(data, type, full, meta){                       
                              return checkboxHmtl(data.parameterIdentify, data.parameterId, "selectParameter");
                          }},
                      {"data":"parameterId"},
                      ellipsisData("parameterIdentify"),
                      ellipsisData("parameterName"),
                      ellipsisData("defaultValue"),
                      {
                    	  "data":"path",
                    	  "className":"ellipsis",
                    	  "render":function(data, type, full, meta) {
                    		  if (strIsNotEmpty(data)) {
                    			  return '<span title="' + data.substring(8) + '">' + data.substring(8) + '</span>';
                    		  }
                    		  return "";
                    	  }
                      },
                      {
                    	  "data":"type",
                    	  "render":function(data) {
                    		  	var option = {
                    		  			"default":{
                    		  				btnStyle:"success",
                    		  				status:data
                    		  				}
                    		  	};	
                    		  	return labelCreate(data, option);							
                    	  }
                      },
                      {
                		    "data":"mark",
                		    "className":"ellipsis",
                		    "render":function(data, type, full, meta) { 
                		    	if (data != "" && data != null) {
                    		    	return '<a href="javascript:;" onclick="showMark(\'' + full.parameterIdentify + '\', \'mark\', this);"><span title="' + data + '">' + data + '</span></a>';
                		    	}
                		    	return "";
                		    }
                      },
                      {
                          "data":null,
                          "render":function(data, type, full, meta){                            
                        	  var  context = [{
                    	    		title:"编辑参数",
                    	    		markClass:"object-edit",
                    	    		iconFont:"&#xe6df;"
                    	    	},{
                    	    		title:"删除参数",
                    	    		markClass:"object-del",
                    	    		iconFont:"&#xe6e2;"
                    	    	}]; 
                                                                                
                          	return btnIconTemplate(context);
                          }}
                  ];
var isChoosePath = false;
var paramsTreeLayerIndex;
var eventList = {
		"#add-object":function() {
			publish.renderParams.editPage.modeFlag = 0;					
			currIndex = layer_show("增加参数", editHtml, editPageWidth, editPageHeight.add, 1);
			publish.init();			
		},
		"#batch-del-object":function() {
			var checkboxList = $(".selectParameter:checked");
			batchDelObjs(checkboxList, PARAM_DEL_URL);
		},
		".object-edit":function() {
			var data = table.row( $(this).parents('tr') ).data();
			publish.renderParams.editPage.modeFlag = 1;
			publish.renderParams.editPage.objId = data.parameterId;
			layer_show("编辑参数信息", editHtml, editPageWidth, editPageHeight.edit, 1, null, null, function() {
				publish.renderParams.editPage.objId = null;
			});
			publish.init();	
		},
		".object-del":function() {
			var data = table.row( $(this).parents('tr') ).data();
			delObj("确定删除此入参吗(删除会影响该接口下的报文生成)？请慎重操作!", PARAM_DEL_URL, data.parameterId, this);
		},
		"#batch-add-object":function(){ //导入报文
			currIndex = layer_show("导入报文", showHtml, null,406, 1);
		},
		"#parse-message-to-parameters":function () {//解析报文
			var paramsJson=$("#jsonParams").val();	
			if(!strIsNotEmpty(paramsJson)){
				layer.msg('你还没有输入任何内容',{icon:2, time:1500});
				return false;
			}
			var messageType = $("#messageType").val();
			$.post(PARAM_JSON_IMPORT_URL, {interfaceId:interfaceId, paramsJson:paramsJson, messageType:messageType}, function(data){
				if(data.returnCode == 0){
					refreshTable();
					layer.close(currIndex);
					layer.msg('导入成功',{icon:1,time:1800});
				} else if (data.returnCode == 912){
					layer.msg('无法解析报文或者解析失败,请检查!', {icon:2, time:1800});
				} else {
					layer.alert(data.msg, {icon: 5});
				}
			});
		},
		"#choose-new-path":function() {//选择节点路径、打开节点树视图页面
			isChoosePath = true;
			$("#view-structure-ztree").click();
		},
		"#show-parameter-info #choose-this-path":function() {//编辑或者添加参数时选择参数的path路径
			if (!strIsNotEmpty($("td[data-name='type']").text()) || $("td[data-name='type'] span").text() == "String" 
						|| $("td[data-name='type'] span").text() == "Number") {
				layer.msg('当前节点不能添加任何子节点,请更换路径!', {title:'提示', icon:0, time:1800});
				return false;
			}
			
			//不能选择自身节点作为父节点
			if (publish.renderParams.editPage.objId == $("td[data-name='parameterId']").text()) {
				layer.msg('不能选择自身节点为父节点,请更换路径!', {title:'提示', icon:0, time:1800});
				return false;
			}
			
			var choosePath = $("td[data-name='path']").text() + ($("td[data-name='path']").text() == "" ? "" : ".") + $("td[data-name='parameterIdentify']").text();
			$("#path").val(choosePath);
			$("#choose-new-path").siblings("span").remove();
			$("#choose-new-path").before('<span>' + choosePath + '&nbsp;</span>');
			layer.close(paramsTreeLayerIndex);		
		},
		"#view-structure-ztree":function() {//预览参数结构视图
			paramsTreeLayerIndex = layer_show("参数节点树", showParameterTreeHtml, null, null, 1, function() {
				if (!isChoosePath) {
					$("#show-parameter-info #choose-this-path").hide();
				}
				$.post(INTERFACE_GET_PARAMETERS_JSON_TREE_URL, {interfaceId:interfaceId}, function(json) {
					$("#ztree-json-view").spinModal();
					if (json.returnCode == 0) {
						//初始化ztree												
						if (strIsNotEmpty(json.error)) {
							$("#errorInfo").html('<pre class="c-red">' + json.error + '</pre>');
						}
						rootPid = json.rootPid;
						var nodes = json.data;
						$.each(nodes, function (i, node) {
							if (node.type == "Map" || node.type == "Array" || node.type == "List") {
								node["isParent"] = true;
								node["open"] = true;
							}
						});
						$.fn.zTree.init($("#treeDemo"), zTreeSetting, nodes);
						$("#ztree-json-view").spinModal(false);
					} else {
						layer.alert(json.msg, {icon:5});
					}
				});
			}, null, function() {
				isChoosePath = false;
			});							
		}
};

var mySetting = {
		eventList:eventList,
		customCallBack:function(p) {
			table.column(1).visible(false);
		},
		templateCallBack:function(df){
			interfaceId = GetQueryString("interfaceId");
			publish.renderParams.listPage.listUrl = PARAMS_GET_URL + "?interfaceId=" + interfaceId;
			publish.renderParams.editPage.editUrl = PARAM_EDIT_URL + "?interfaceId=" + interfaceId;
			
			jqueryLoad("interfaceParameter-viewTree.htm", '#show-parameter-tree-html', function (dom) {
				showParameterTreeHtml = dom;
			});
			
			df.resolve();
		},
		editPage:{
			beforeInit:function(df) {
				$("#interfaceInfo\\.interfaceId").val(interfaceId);
				df.resolve();
       	 	},
       	 	renderCallback:function(obj){
       	 		$("#choose-new-path").before('<span>' + (obj.path).substring(8) + '&nbsp;</span>');
       	 	},
			editUrl:PARAM_EDIT_URL,
			getUrl:PARAM_GET_URL,
			rules:{
				parameterIdentify:{
					required:true,
					minlength:2,
					maxlength:1000,
				}
			}
		},		
		listPage:{
			listUrl:PARAMS_GET_URL,
			tableObj:".table-sort",
			columnsSetting:columnsSetting,
			columnsJson:[0, 7, 8],
			dtOtherSetting:{
				serverSide:false,
				aaSorting: [[ 5, "asc" ]]
			}
		},
		templateParams:templateParams		
	};

$(function(){
	publish.renderParams = $.extend(true, publish.renderParams, mySetting);
	publish.init();
});


/********************************************************************************************************/
var zTreeSetting = {
		data: {
			simpleData: {
				enable:true,
				idKey: "parameterId",
				pIdKey: "parentId",
				rootPId: rootPid
			},
			key: {
				name:"parameterIdentify",
				title:"parameterName"
			}		
		},
		callback: {
			onClick: zTreeOnClick
		}
};


function zTreeOnClick(event, treeId, treeNode) {
	$.each(treeNode, function (name, value) {	
		var that = $("#show-parameter-info td[data-name='" + name + "']");
		if (that) {
			that.html(value);
		}	
		if (name == "path") {
			that.html(value.replace('TopRoot.', '').replace('TopRoot', ''));
		}
		if (name == "type") {
			that.html('<span class="label label-success radius">' + value + '</span>');
		}
	});
}