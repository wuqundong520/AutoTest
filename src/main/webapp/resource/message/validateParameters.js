//遮罩层覆盖区域
var $wrapper = $('#div-table-container');

var messageSceneId; //当前正在操作的sceneId
var currIndex;//当前正在操作的layer窗口的index


var selectGetValueMethodTig = {
		"0":["字符串", "请输入用于比对该参数值的字符串,如18655036394", "可用字符串"],
		"1":["入参节点值", "请输入正确的入参节点路径,程序将会自动化来获取该路径下的值,区分大小写,请参考接口信息中的参数管理", "入参节点路径"],
		"2":["数据库取值", "请输入用于查询的SQL语句。在SQL语句中,你同样可以使用节点路径: \"#ROOT.DATA.PHONE_NO#\" 来表示表示入参节点数据", "查询SQL语句"]
	};

/**
 * 0-左右边界取关键字验证<br>
 * 1-节点参数验证<br>
 * 2-全文返回验证<br>
 */

var index_selectDb;
var addValidateMethodFlag = 1; //添加的验证规则模式


var validateFullJsonHtml; //全文验证
var validateKeywordHtml; //关联验证

var templateParams = {
		tableTheads:["验证方式", "节点路径/关联规则", "预期值取值方式", "预期值", "状态", "备注", "操作"],
		btnTools:[{
			type:"primary",
			size:"M",
			id:"add-object",
			iconFont:"&#xe600;",
			name:"添加验证规则"
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
			label:"规则ID",  	
			objText:"validateIdText",
			input:[{	
				hidden:true,
				name:"validateId"
				}]
		},
		{
			required:true,
			label:"节点路径",  
			input:[{	
				name:"parameterName",
				placeholder:"例如:ROOT.OPR_INFO.USER.ID"
				}]
		},
		{	
			required:true,
			label:"预期值取值方式",  
			button:[{
				style:"primary",
				value:"选择",
				name:"select-get-value-method"
			}]
		},
		{
			required:true,
			label:"预期比对值",  
			input:[{	
				name:"validateValue"
				}]
		},
		{	
			required:true,
			label:"状态",  			
			select:[{	
				name:"status",
				option:[{
					value:"0",
					text:"可用"
				},{
					value:"1",
					text:"禁用"
				}]
				}]
		},
		{
			name:"messageScene.messageSceneId",
		},
		{
			name:"validateMethodFlag",
			value:"1"
		},
		{
			name:"getValueMethod"
		},
		{
			label:"备注",  
			textarea:[{	
				name:"mark",
				placeholder:"验证说明"
			}]
		}
		]		
	};

var columnsSetting = [
                      {
                      	"data":null,
                      	"render":function(data, type, full, meta){                       
                              return checkboxHmtl(data.validateId, data.validateId, "selectValidate");
                          }},
                      {"data":"validateId"},
                      {
                    	  "data":"validateMethodFlag",
                    	  "render":function(data) {
                    		  var option = {
                          			"0":{
                          				btnStyle:"danger",
                  		  				status:"关联验证"
                          			},
                          			"1":{
                          				btnStyle:"primary",
                  		  				status:"节点验证"
                          			},
                          			"2":{
                          				btnStyle:"secondary",
                  		  				status:"全文验证"
                          			}
                          		};
                          		
                          		return labelCreate(data, option);
                    	  }
                      },
                      {
                    	  "data":null,
                    	  "render":function(data) {                   		  
                    		  if (data.validateMethodFlag == "1") {
                    			  return data.parameterName;
                    		  } else {
                    			  return "";
                    		  }
                    	  }
                      },                    
                      {
                    	"data":null,
                    	"render":function(data) {
                    		if (data.validateMethodFlag == "0" || data.validateMethodFlag == "2") {
                    			return "";
                    		}
                    		var option = {
                    			"0":{
                    				btnStyle:"primary",
            		  				status:"字符串"
                    			},
                    			"1":{
                    				btnStyle:"primary",
            		  				status:"入参节点值"
                    			},
                    			"default":{
                    				btnStyle:"primary",
            		  				status:"数据库"
                    			}
                    		};
                    		
                    		return labelCreate(data.getValueMethod, option);
                    	}
                      },
                      ellipsisData("validateValue"),
                      {
                    	  "data":"status",
                    	  "render":function(data, type, row, meta) {
                    		  var checked = '';
                    		  if(data == "0") {checked = 'checked';}                  	
                    		  return '<div class="switch size-MINI" data-on-label="可用" data-off-label="禁用"><input type="checkbox" ' + checked + ' value="' + row.validateId + '"/></div>';                                                   							
                    	  }
                      }, 
                      {
              		    "data":"mark",
              		    "className":"ellipsis",
              		    "render":function(data, type, full, meta) { 
              		    	if (data != "" && data != null) {
                  		    	return '<a href="javascript:;" onclick="showMark(\'验证规则\', \'mark\', this);"><span title="' + data + '">' + data + '</span></a>';
              		    	}
              		    	return "";
              		    }
                      },
                      {
                          "data":null,
                          "render":function(data, type, full, meta){
                            var context = [{
                	    		title:"规则编辑",
                	    		markClass:"object-edit",
                	    		iconFont:"&#xe6df;"
                	    	},{
                	    		title:"规则删除",
                	    		markClass:"object-del",
                	    		iconFont:"&#xe6e2;"
                	    	}];                           
                          	return btnIconTemplate(context);
                          }}
                  ];

var eventList = {
		"#add-object":function() {
			publish.renderParams.editPage.modeFlag = 0;
			layer.confirm(
					'请选择需要创建的验证方式<br><span class="c-red">全文验证有且只有一条</span>',
					{
						title:'提示',
						btn:['关联验证','节点验证','全文验证'],
						btn3:function(index){
							layer.close(index);
							addValidateMethodFlag = 2;  	
							showValidatRulePage();
						}
					},function(index){ 
						layer.close(index);
						addValidateMethodFlag = 0;	
						showValidatRulePage();
					},function(index){
						layer.close(index);
						addValidateMethodFlag = 1;
											
						currIndex = layer_show("增加节点验证规则", editHtml, "700", "500", 1, function() {
							addEditPageHtml();
						});
						publish.init();
					});									
		},
		"#batch-del-object":function() {
			var checkboxList = $(".selectValidate:checked");
			batchDelObjs(checkboxList,VALIDATE_RULE_DEL_URL);
		},
		".object-edit":function() {
			var data = table.row( $(this).parents('tr') ).data();
			publish.renderParams.editPage.modeFlag = 1;
			addValidateMethodFlag = data.validateMethodFlag;
			if (data.validateMethodFlag == "1") {
				publish.renderParams.editPage.objId = data.validateId;
				layer_show("编辑规则信息", editHtml, "700", "530",1, function() {
					addEditPageHtml();
				});
				publish.init();	
			} else {				
				showValidatRulePage(data.validateId);
			}
		},
		".object-del":function() {
			var data = table.row( $(this).parents('tr') ).data();
			delObj("确定删除此验证规则？请慎重操作!",VALIDATE_RULE_DEL_URL, data.validateId, this);
		},
		"#select-get-value-method":function() {  //选择预期值取值方式
			layer.confirm('请选择预期比对数据获取方式',{title:'提示',btn:['字符串','入参节点值','数据库取值'],
				btn3:function(index) {
					$.ajax({
						type:"POST",
						url:QUERY_DB_LIST_ALL_URL,
						success:function(data) {
							if(data.returnCode == 0){
								if(data.data.length < 1){
									layer.alert('没有可用的数据库连接信息,请在系统设置模块添加可用的数据库信息', {icon:5});
									return false;
								}
		
								var selectHtml = '<div class="row cl" style="width:340px;margin:15px;"><div class="form-label col-xs-2"><input type="button" class="btn btn-primary radius" onclick="selectDB();" value="选择"/></div><div class="formControls col-xs-10"><span class="select-box radius mt-0"><select class="select" size="1" name="selectDb" id="selectDb">';
								$.each(data.data, function(i,n) {
									selectHtml += '<option value="' + n.dbId + '">' + n.dbUrl + "-" + n.dbName + '</option>';									
								});
								selectHtml += '</select></span></div></div>';
								index_selectDb = layer.open({
							        type: 1,
							        title: "选择数据库",
							        area: ['355px', '110px'],
							        content:selectHtml
							    });
							}else{
								layer.alert(data.msg,{icon:5});
							}
						}							
					});			
				}}
				,function(index){
					changeTigs("0");
					layer.close(index);
				}
				,function(index){
					changeTigs("1");
					layer.close(index);
				});
		}
		
};

var mySetting = {
		eventList:eventList,
		templateCallBack:function(df){
			messageSceneId = GetQueryString("messageSceneId");
			publish.renderParams.listPage.listUrl = VALIDATE_RULE_LIST_URL + "?messageSceneId=" + messageSceneId;			
			
			jqueryLoad("messageScene-validateFullJson.htm", $("#validate-full-json-page"), function(domHmtl) {
				validateFullJsonHtml = domHmtl;				
			});
							
			jqueryLoad("messageScene-validateKeyword.htm", $("#validate-keyword-page"), function(domHmtl) {
				validateKeywordHtml = domHmtl;			
			});
			
			df.resolve();			   		 	
   	 	},
		editPage:{
			editUrl:VALIDATE_RULE_EDIT_URL,
			getUrl:VALIDATE_RULE_GET_URL,
			rules:{
				parameterName:{
					required:true,
					minlength:1,
					maxlength:255			
				},
				validateValue:{
					required:true,
					minlength:1,
					maxlength:1000
				},
				getValueMethod:{
					required:true
				}				
			},
			beforeInit:function(df){
				$("#messageScene\\.messageSceneId").val(messageSceneId);
       		 	df.resolve();
       	 	},
       	 	renderCallback:function(obj){
       	 		changeTigs(obj.getValueMethod);
       	 	}
		},		
		listPage:{
			listUrl:VALIDATE_RULE_LIST_URL,
			tableObj:".table-sort",
			exportExcel:false,
			columnsSetting:columnsSetting,
			columnsJson:[0, 3, 4, 5, 7, 8],
			dtOtherSetting:{
				"serverSide": false,
				"initComplete":function() {
					$('.switch')['bootstrapSwitch']();
	            	$('.switch input:checkbox').change(function(){
	            		var flag = $(this).is(':checked');
	            		var validateId = $(this).attr('value');
	            		updateStatus(validateId, flag, this);
	            	});
				}
			},
			dtAjaxCallback:function() {
				$('.switch')['bootstrapSwitch']();
            	$('.switch input:checkbox').change(function(){
            		var flag = $(this).is(':checked');
            		var validateId = $(this).attr('value');
            		updateStatus(validateId, flag, this);
            	});
			}
		},
		templateParams:templateParams		
	};

$(function(){
	publish.renderParams = $.extend(true, publish.renderParams,mySetting);
	publish.init();
});

/*******************************************************************************************************/

/**
 * 实时改变状态
 */
function updateStatus(validateId, flag, obj) {
	var status = '1';
	if(flag == true){
		status = '0';
	}
	$.post(VALIDATE_RULE_UPDATE_STATUS, {validateId:validateId, status:status}, function(json) {
		if(json.returnCode != 0){
			$(obj).click();
			layer.alert(json.msg, {icon:5});
		}
	});
}

/**
 * 选择查询数据库
 */
function selectDB() {
	changeTigs($("#selectDb").val());
	layer.close(index_selectDb);
	
}
/**
 * 节点验证编辑时，根据取值方式的选择不同，改变页面提示
 * @param type
 */
function changeTigs(type) {
	
	$("#getValueMethod").val(type);
	
	if (type != "1" && type != "0") {
		type = "2"; 		
		selectGetValueMethodTig[type][2] = "数据库  "+$("#selectDb option:selected").text();
	}
		
	$("#validateValue").attr("placeholder", selectGetValueMethodTig[type][0]);
	$("#tipMsg").text(selectGetValueMethodTig[type][1]);
	$("#getValueMethodText").text(selectGetValueMethodTig[type][2]);
}

/**
 * 节点验证时,附加的页面渲染工作
 */
function addEditPageHtml() {
	$("#select-get-value-method").before('<strong><span id="getValueMethodText"></span></strong>&nbsp;&nbsp;');
	$("#form-edit").append('<div class="row cl"><div class="col-xs-8 col-sm-9 col-xs-offset-4' 
			+ ' col-sm-offset-3"><span id="tipMsg" style="color:red;"></span></div></div>');
}

/**
 * 展示不同的类型验证规则的编辑页面
 * @param type
 */
function showValidatRulePage(validateId) {
	//关联验证 根据publish.renderParams.editPage.modeFlag 0为增加  1为编辑
	if (addValidateMethodFlag == 0) {
		layer_show('关联验证', validateKeywordHtml, '820', '450', 1, function() {
			if (publish.renderParams.editPage.modeFlag == 1) {
				$.get(VALIDATE_RULE_GET_URL, {id:validateId},function(data){
					if(data.returnCode == 0) {
						data = data.object;
						if (data.parameterName != "") {
							var relevanceObject = JSON.parse(data.parameterName);
							$("#ORDER").val(relevanceObject.ORDER);
							$("#LB").val(relevanceObject.LB);
							$("#RB").val(relevanceObject.RB);
							$("#OFFSET").val(relevanceObject.OFFSET);
							$("#LENGHT").val(relevanceObject.LENGHT);
							$("#objectSeqText").text(relevanceObject.ORDER);
						}
						$("#parameterName").val(data.parameterName);
						$("#validateValue").val(data.validateValue);
						$("#validateId").val(data.validateId);
						$("#messageScene\\.messageSceneId").val(messageSceneId);
						$("#status").val(data.status);
					} else {
						layer.alert(data.msg,{icon:5});
					}
				});
			}		
		});
	}
	//全文验证 不存在就新建  存在就编辑已存在的
	if (addValidateMethodFlag == 2) {
		layer_show('全文验证管理', validateFullJsonHtml, '800', '520', 1, function() {
			$.get(VALIDATE_FULL_RULE_GET_URL, {messageSceneId:messageSceneId, validateMethodFlag:"2"},function(data){
				if(data.returnCode == 0) {
					$("#validateValue").val(data.validateValue);
					$("#validateId").val(data.validateId);
					$("#messageScene\\.messageSceneId").val(messageSceneId);
					$("#status").val(data.status);
				} else {
					layer.alert(data.msg,{icon:5});
				}
			});
		});
	}
	
}


/**
 * 保存验证内容
 * 全文验证或者关联验证
 */
function saveValidateJson(){	
	var sendData = {};
	if ($("#parameterName").length > 0) {
		var parameterName = '{"LB":"' + ($("#LB").val()).replace(/\"/g, "\\\"") 
		+ '","RB":"' + ($("#RB").val()).replace(/\"/g, "\\\"") + '","ORDER":"' + $("#ORDER").val() 
		+ '","OFFSET":"' + ($("#OFFSET").val()).replace(/\"/g, "\\\"") 
		+ '","LENGHT":"' + ($("#LENGHT").val()).replace(/\"/g, "\\\"") + '"}';
		sendData.parameterName = parameterName;
	}	
	sendData.validateMethodFlag = addValidateMethodFlag;
	sendData.validateValue = $("#validateValue").val();
	sendData.validateId = $("#validateId").val();
	sendData["messageScene.messageSceneId"] = messageSceneId;
	sendData["status"] = $("#status").val();
	
	$.post(VALIDATE_RULE_EDIT_URL, sendData, function(data){
		if(data.returnCode == 0){
			refreshTable();
			layer.closeAll('page');
			layer.msg('已保存!', {icon:1, time:1500});
		} else {
			layer.alert(data.msg,{icon:5});
		}
	});		
}

