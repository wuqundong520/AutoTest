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
			layerHeight:"450",
			keyIsNull:true
		},
		socketCallParameter:{
			text:"Socket调用参数",
			settingValue:{
				"ConnectTimeOut":"",
			    "ReadTimeOut":""
			},
			layerHeight:"230",
			keyIsNull:true
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
			layerHeight:"400",
			keyIsNull:true
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
			layerHeight:"500",
			keyIsNull:true
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
			layerHeight:"550",
			keyIsNull:true
		},
		constant:{
			text:"常量",
			settingValue:"",
			layerHeight:"",
			keyIsNull:false
		},
		datetime:{
			text:"日期",
			settingValue:{
				datetimeFormat:""
			},
			layerHeight:"260",
			keyIsNull:false
		},
		randomNum:{
			text:"随机数",
			settingValue:{
				randomMin:"",
				randomNumMax:""
			},
			layerHeight:"230",
			keyIsNull:false
		},
		currentTimestamp:{
			text:"时间戳",
			settingValue:"",
			layerHeight:"",
			keyIsNull:false
		},
		randomString:{
			text:"随机字符串",
			settingValue:{
				randomStringMode:"",
				randomStringNum:""
			},
			layerHeight:"230",
			keyIsNull:false
		}
};

var templateParams = {
		tableTheads:["名称","类型","key","value","创建时间","创建用户", "备注","操作"],
		btnTools:[{
			type:"primary",
			size:"M",
			id:"add-object",
			iconFont:"&#xe600;",
			name:"添加全局变量"
		},{
			type:"danger",
			size:"M",
			id:"batch-del-object",
			iconFont:"&#xe6e2;",
			name:"批量删除"
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
	ellipsisData("key"),
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
	    	var context = [{
	    		title:"编辑",
	    		markClass:"object-edit",
	    		iconFont:"&#xe6df;"
	    	},{
	    		title:"删除",
	    		markClass:"object-del",
	    		iconFont:"&#xe6e2;"
	    	}
	    	];	    		
	    	return btnIconTemplate(context);	    	
	    }}];

var settingLayerIndex;//当前打开的变量配置的layer窗口
var settingMode;//0 - 编辑页面设置  1 - 单独设置、
var settingType;
var settingValue;
var variableId;
var eventList = {
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
		"#save-setting-variable-value":function() {//保存
			var value = $.extend({}, variableTypeInfo[settingType]["settingValue"]);
			$.each(value, function(settingName, settingValue) {
				if ($("#" + settingName)) {
					value[settingName] = $("#" + settingName).val();
				}
			});
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
			rules:{
				variableName:{
					required:true,
					minlength:1,
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
			columnsJson:[0, 8, 9]
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
			showOrHideInput('hidden', 'hidden', 'button');
			break;
		case "datetime":
		case "randomNum":
		case "randomString":
			showOrHideInput('text', 'hidden', 'button');
			break;
		case "currentTimestamp":
			showOrHideInput('text', 'hidden', 'hidden');
			$("#value").val(" ");
			break;	
		case "constant":
			showOrHideInput('text', 'text', 'hidden');
			break;
		default:
			break;
	}
}

function showOrHideInput(key_type, value_type, settingButton_type) {
	$("#key").attr('type', key_type);
	$("#value").attr('type', value_type);
	$("#setting-variable-value").attr('type', settingButton_type);
}

function showSettingPage(title) {
	if (title == null) {
		title = variableTypeInfo[settingType]["text"];
	}
	layer_show( title + "-配置", settingVariableValueTemplate(), '680', variableTypeInfo[settingType]["layerHeight"], 1
			, function(layero, index) {
				settingLayerIndex = index;				
				if (settingValue != null && settingValue != "") {
					$.each(JSON.parse(settingValue), function(i, n) {
						if ($("#" + i)) {
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