var table;
var settingVariableValueTemplate;

var variableTypeInfo = {
		httpCallParameter:{
			text:"HTTP调用参数",
			settingValue:{
			    "Headers":{
			    },
			    "Authorization":{
			    },
			    "Method":"POST",
			    "ConnectTimeOut":"",
			    "ReadTimeOut":"",
			    "RecEncType":"UTF-8",
			    "EncType":"UTF-8" 
			},
			layerHeight:"500",
			keyIsNull:false,
			ifCreate:false
		},
		socketCallParameter:{
			text:"Socket调用参数",
			settingValue:{
				"ConnectTimeOut":"",
			    "ReadTimeOut":""
			},
			layerHeight:"280",
			keyIsNull:false,
			ifCreate:false
		},
		webServiceCallParameter:{
			text:"WebService调用参数",
			settingValue:{
			    "ConnectTimeOut":"",
			    "Namespace":"",
			    "Method":"",
			    "Username":"",
			    "Password":""
			},
			layerHeight:"430",
			keyIsNull:false,
			ifCreate:false
		},
		relatedKeyWord:{
			text:"验证关联规则",
			settingValue:{
				LB:"",
				RB:"",
				OFFSET:"",
				ORDER:"",
				LENGHT:"",
				validateValue:""
			},
			layerHeight:"530",
			keyIsNull:false,
			ifCreate:false
		},
		setRuntimeSetting:{
			text:"测试集运行时配置",
			settingValue:{
				requestUrlFlag:"",
				connectTimeOut:"",
				readTimeOut:"",
				retryCount:"",
				runType:"",
				checkDataFlag:"",
				customRequestUrl:""
			},
			layerHeight:"580",
			keyIsNull:false,
			ifCreate:false
		},
		constant:{
			text:"常量",
			settingValue:"",
			layerHeight:"",
			keyIsNull:false,
			ifCreate:true
		},
		datetime:{
			text:"日期",
			settingValue:{
				datetimeFormat:""
			},
			layerHeight:"310",
			keyIsNull:false,
			ifCreate:true
		},
		randomNum:{
			text:"随机数",
			settingValue:{
				randomMin:"",
				randomNumMax:""
			},
			layerHeight:"260",
			keyIsNull:false,
			ifCreate:true
		},
		currentTimestamp:{
			text:"时间戳",
			settingValue:"",
			layerHeight:"",
			keyIsNull:false,
			ifCreate:true
		},
		randomString:{
			text:"随机字符串",
			settingValue:{
				randomStringMode:"",
				randomStringNum:""
			},
			layerHeight:"260",
			keyIsNull:false,
			ifCreate:true
		}
};

function variableTypeList () {
	var types = [{value:"all", text:"全部类型", selected:"selected"}];
	$.each(variableTypeInfo, function(i, n) {
		types.push({value:i, text:n.text});
	});
	return types;
}

var templateParams = {
		tableTheads:["名称","类型","key","value","创建时间","创建用户", "备注","操作"],
		btnTools:[{
			type:"primary",
			size:"M",
			id:"add-object",
			iconFont:"&#xe600;",
			name:"创建变量模板"
		},{
			type:"danger",
			size:"M",
			id:"batch-del-object",
			iconFont:"&#xe6e2;",
			name:"批量删除"
		},{
			select:true,
			id:"list-by-variable-type",
			option:variableTypeList()
		}],
		formControls:[
		{
			edit:true,
			required:false,
			label:"&nbsp;&nbsp;ID",  	
			objText:"variableIdText",
			input:[{	
				hidden:true,
				name:"variableId"
				}]
		},
		{
			edit:false,
			required:true,
			label:"名称",  			
			input:[{	
				name:"variableName",
				placeholder:"输入一个名称来简要说明"
				}]
		},
		{
			edit:false,
			required:true,
			label:"变量类型",  			
			select:[{	
				name:"variableType",
				option:[{value:"httpCallParameter", text:variableTypeInfo.httpCallParameter.text},
				        {value:"socketCallParameter", text:variableTypeInfo.socketCallParameter.text},
				        {value:"webServiceCallParameter", text:variableTypeInfo.webServiceCallParameter.text},
				        {value:"relatedKeyWord", text:variableTypeInfo.relatedKeyWord.text},
				        {value:"setRuntimeSetting", text:variableTypeInfo.setRuntimeSetting.text},
				        {value:"constant", text:variableTypeInfo.constant.text, selected:"selected"},
				        {value:"datetime", text:variableTypeInfo.datetime.text},
				        {value:"randomNum", text:variableTypeInfo.randomNum.text},
				        {value:"currentTimestamp", text:variableTypeInfo.currentTimestamp.text},
				        {value:"randomString", text:variableTypeInfo.randomString.text}]
				}]
		},
		{
			edit:false,
			required:true,
			label:"Key值",  			
			input:[{	
				name:"key",
				placeholder:"自定义key"
				}]
		},
		{
			edit:false,
			required:true,
			label:"Value值",  			
			input:[{	
				name:"value"
				}],
			button:[{
				 style:"success",
				 value:"配置",
				 name:"setting-variable-value"
			}]
		},
		{
			edit:true,
			required:false,
			label:"创建时间",  	
			objText:"createTimeText",
			input:[{	
				hidden:true,
				name:"createTime"
				}]
		},
		{
			edit:true,
			label:"创建用户",  	
			objText:"user.realNameText",
			input:[{	
				hidden:true,
				name:"user.userId"
				}]
		},
		{
			edit:false,
			label:"&nbsp;&nbsp;备注",
			textarea:[{
				name:"mark"	
			}]
		}	
		]		
	};


var columnsSetting = [
    {
    	"data":null,
    	"render":function(data, type, full, meta){
			  		return checkboxHmtl(data.variableName, data.variableId,"selectVariable");
		           	}},
	{"data":"variableId"},ellipsisData("variableName"),                                       
	{
		"data":"variableType",
		"render":function(data, type, full, meta ){
		   	var context = {
		   			httpCallParameter:{
		   				status:"HTTP调用参数",
		   				btnStyle:"primary"
		   			},
		   			socketCallParameter:{
		   				status:"Socket调用参数",
		   				btnStyle:"primary"
		   			},
		   			webServiceCallParameter:{
		   				status:"WebService调用参数",
		   				btnStyle:"primary"
		   			},
		   			relatedKeyWord:{
		   				status:"验证关联规则",
		   				btnStyle:"primary"
		   			},
		   			setRuntimeSetting:{
		   				status:"测试集运行时配置",
		   				btnStyle:"primary"
		   			},
		   			constant:{
		   				status:"常量",
		   				btnStyle:"success"
		   			},
		   			datetime:{
		   				status:"日期",
		   				btnStyle:"success"
		   			},
		   			randomNum:{
		   				status:"随机数",
		   				btnStyle:"success"
		   			},
		   			currentTimestamp:{
		   				status:"时间戳",
		   				btnStyle:"success"
		   			},
		   			randomString:{
		   				status:"随机字符串",
		   				btnStyle:"success"
		   			}	
		   	};
		   	return labelCreate(data, context);
		}
	},
	{
		"data":"key",
		"className":"ellipsis",
		"render":function(data, type, full, meta) {
			if (data != "" && data != null && data != " ") {
				return "${__" + data + "}";
			}
			return "";
		}
	
	},
	{
	    "data":"value",
	    "className":"ellipsis",
	    "render":function(data, type, full, meta ) {
	    	if (data != "" && data != null &&　data != " ") {	    		
	    		if (full.variableType == "constant") {
	    			return '<a href="javascript:;" onclick="showMark(\'' + full.variableName + '\', \'value\', this, \'value值\');"><span title="' + data + '">' + data + '</span></a>';
	    		} else {
	    			return btnTextTemplate([{
              			type:"primary",
              			size:"M",
              			markClass:"setting-variable-value",
              			name:"配置"
              		}]);
	    		}    				    	
	    	}
	    	return "";
	    }
	},
	ellipsisData("createTime"),ellipsisData("user.realName"),
	{
	    "data":"mark",
	    "className":"ellipsis",
	    "render":function(data, type, full, meta ) {
	    	if (data != "" && data != null) {
		    	return '<a href="javascript:;" onclick="showMark(\'' + full.variableName + '\', \'mark\', this);"><span title="' + data + '">' + data + '</span></a>';
	    	}
	    	return "";
	    }
	},
	{
		"data":null,
	    "render":function(data, type, full, meta){	    		    	
	    	var context = [];
	    	if (variableTypeInfo[data.variableType]["ifCreate"]) {
	    		context.push({
	    			title:"生成变量",
		    		markClass:"variable-create",
		    		iconFont:"&#xe725;"
	    		});
	    	}
	    	return btnIconTemplate(context.concat([{
	    		title:"编辑",
	    		markClass:"object-edit",
	    		iconFont:"&#xe6df;"
	    	},{
	    		title:"删除",
	    		markClass:"object-del",
	    		iconFont:"&#xe6e2;"
	    	}]));	    	
	    }}];

var settingLayerIndex;//当前打开的变量配置的layer窗口
var settingMode;//0 - 编辑页面设置  1 - 单独设置、
var settingType;
var settingValue;
var variableId;
var eventList = {
		"#list-by-variable-type":{
			'change':function() {
				table.ajax.url(GLOBAL_VARIABLE_LIST_URL + '?variableType=' + $(this).val()).load();
			}
		},
		"#add-object":function(){
			publish.renderParams.editPage.modeFlag = 0;					
			layer_show("添加全局变量", editHtml, "650", "450", 1);
			publish.init();
			
		},
		"#batch-del-object":function(){
			var checkboxList = $(".selectVariable:checked");
			batchDelObjs(checkboxList, GLOBAL_VARIABLE_DEL_URL);
		},
		".object-edit":function(){
			var data = table.row( $(this).parents('tr') ).data();
			publish.renderParams.editPage.modeFlag = 1;	
  			publish.renderParams.editPage.objId = data.variableId;
			layer_show("编辑全局变量信息", editHtml, "800", "550", 1);
			publish.init();	
		},
		".object-del":function(){
			var data = table.row( $(this).parents('tr') ).data();
			delObj("确认要删除此全局变量信息吗？", GLOBAL_VARIABLE_DEL_URL, data.variableId, this);
		},
		"#variableType":{
			'change':function() {
				changeFormByVariableType($(this).val());
			}
		},
		"#setting-variable-value,.setting-variable-value":function() {//设置某些需要配置的变量值
			var title;
			var data = table.row( $(this).parents('tr') ).data();
			
			if (data == null) {
				settingType = $("#variableType").val();
				settingValue = $("#value").val();
				settingMode = 0;
			} else {	
				settingType = data.variableType;
				settingValue = data.value;
				title = data.variableName;
				variableId = data.variableId;
				settingMode = 1;
			}
			showSettingPage(title);
		},
		".variable-create":function() {//生成变量
			var data = table.row( $(this).parents('tr') ).data();
			if (data.variableType == "constant") {
				layer.alert('<span class="c-success">常量值：</span><br>' + data.value, {icon:1, anim:5, title:data.variableName});
				return;
			}
			$.post(GLOBAL_VARIABLE_CREATE_VARIABLE_URL, {variableType:data.variableType, value:data.value}, function(json) {
				if (json.returnCode == 0) {
					layer.alert('<span class="c-success">生成变量成功：</span><br>' + json.msg, {icon:1, anim:5, title:data.variableName});
				} else {
					layer.alert('<span class="c-danger">生成变量失败：</span><br>' + json.msg, {icon:5, anim:5, title:data.variableName});
				}
			});
			
		},
		"#save-setting-variable-value":function() {//保存
			var value = $.extend({}, variableTypeInfo[settingType]["settingValue"]);
			$.each(value, function(settingName, settingValue) {
				if ($("#" + settingName)) {
					value[settingName] = $("#" + settingName).val();
				}
			});
			
			//HTTP调用参数单独处理
			//Content-Type:application/xml;User-agent:chrome
			if (settingType == "httpCallParameter") {
				value["Authorization"] = parseHttpParameterToJson(value["Authorization"]);
				value["Headers"] = parseHttpParameterToJson(value["Headers"]);
			}
			
			value = JSON.stringify(value);
			if (settingMode == 0) {								
				$("#value").val(value);
				if (variableTypeInfo[settingType]["keyIsNull"]) {
					$("#key").val(" ");
				}
				layer.close(settingLayerIndex);
				return;
			}
					
			//发送请求更新该variable的value值
			if (settingValue != value) {
				$.post(GLOBAL_VARIABLE_UPDATE_VALUE_URL, {variableId:variableId, value:value}, function(json) {
					if (json.returnCode == 0) {								
						refreshTable();
						layer.msg('更新成功!', {icon:1, time:2000});
						layer.close(settingLayerIndex);
					} else {
						layer.alert(json.msg, {icon:5});
					}								
				});
			} else {
				layer.close(settingLayerIndex);
			}
			
		}
		
};


var mySetting = {
		eventList:eventList,
		customCallBack:function(p) {
			settingVariableValueTemplate = Handlebars.compile($("#setting-variable-value-template").html());
		},
		editPage:{
			editUrl:GLOBAL_VARIABLE_EDIT_URL,
			getUrl:GLOBAL_VARIABLE_GET_URL,
			beforeInit:function(df){				
				$("#setting-variable-value").attr('type', 'hidden');
				df.resolve();
			},
			renderCallback:function(obj){
				$("#variableType").trigger('change');				
			},
			messages:{
				variableName:"请输入变量或者模板的名称",
				key:"请设定一个唯一的Key值"
			},
			rules:{
				variableName:{
					required:true,
					minlength:2,
					maxlength:255
				},
				key:{
					required:true,					
					remote:{
						url:GLOBAL_VARIABLE_CHECK_NAME_URL,
						type:"post",
						dataType: "json",
						data: {                   
					        key: function() {
					            return $("#key").val();
					        },
					        variableId:function(){
					        	return $("#variableId").val();
					        },
					        variableType:function() {
					        	return $("#variableType").val();
					        }
					}}
				},
				value:{
					required:true
				}
			},
		},
		listPage:{
			listUrl:GLOBAL_VARIABLE_LIST_URL,
			tableObj:".table-sort",
			columnsSetting:columnsSetting,
			columnsJson:[0, 8, 9],
			dtOtherSetting:{
				serverSide:false
			}
		},
		templateParams:templateParams		
	};

$(function(){			
	publish.renderParams = $.extend(true,publish.renderParams,mySetting);
	publish.init();
});


/*****************************************************************************************************/
/**
 * 根据variableType改变form表单显示
 */
function changeFormByVariableType (variableType) {	
	
	switch (variableType) {
		case "httpCallParameter":
		case "socketCallParameter":
		case "webServiceCallParameter":
		case "relatedKeyWord":
		case "setRuntimeSetting":
			showOrHideInput('hidden', 'button');
			break;
		case "datetime":
		case "randomNum":
		case "randomString":
			showOrHideInput('hidden', 'button');
			break;
		case "currentTimestamp":
			showOrHideInput('hidden', 'hidden');
			$("#value").val(" ");
			break;	
		case "constant":
			showOrHideInput('text', 'hidden');
			break;
		default:
			break;
	}
}

/**
 * 根据配置的类型不同改变editPage页面上的一些控件的显示
 * @param key_type
 * @param value_type
 * @param settingButton_type
 * @returns
 */
function showOrHideInput(value_type, settingButton_type) {
	$("#value").attr('type', value_type);
	$("#setting-variable-value").attr('type', settingButton_type);
}

/**
 * 打开模板或者参数配置编辑页
 * @param title
 * @returns
 */
function showSettingPage(title) {
	if (title == null) {
		title = variableTypeInfo[settingType]["text"];
	}
	layer_show( title + "-配置", settingVariableValueTemplate(), '680', variableTypeInfo[settingType]["layerHeight"], 1
			, function(layero, index) {
				settingLayerIndex = index;				
				if (strIsNotEmpty(settingValue)) {
					$.each(JSON.parse(settingValue), function(i, n) {						
						
						if ($("#" + i)) {
							
							//HTTP调用参数单独处理
							//Content-Type:application/xml;User-agent:chrome
							if (i == "Authorization" || i == "Headers") {
								n = parseHttpParameterJsonToString(n);								
							}
							
							$("#" + i).val(n);
							if (i == "ORDER") {
								$("#objectSeqText").text(n);
							}
						}
					});
				}
				$("div ." + settingType).removeClass('hide');						
	});
}

function parseHttpParameterToJson(s) {
	var returnObj = {};
	var arr = s.split(";");
	$.each(arr, function(i, n) {
		if (n != null && n != "") {
			var arr2 = n.split(":");
			returnObj[arr2[0]] = arr2[1];
		}				
	});
	return returnObj;
}

function parseHttpParameterJsonToString (obj) {
	var s = "";
	$.each(obj, function(name, value) {
		s += name + ":" + value + ";"
	});
	return s;
}