//遮罩层覆盖区域
var $wrapper = $('#div-table-container');

var messageId; //当前messageid
var messageSceneId; //当前正在操作的sceneId
var currIndex;//当前正在操作的layer窗口的index

var resultTemplate;//测试详情结果页面模板

var editVariablesTemplate;//添加修改组合场景中变量的模板
var showSceneVariablesTemplate;//展示组合场景中变量列表

var interfaceName;
var messageName;

var complexSetScene; //进入的组合场景
var oldcomplexSetScene;//保存没修改之前的对象信息

var setId; //添加缺少数据时获取测试场景的测试集  0表示全量测试场景

var sceneTestHtml; //场景测试

var thisMark = "";
var table;
/**
 * ajax地址
 */
var SCENE_LIST_URL = "scene-list"; //获取场景列表
var SCENE_EDIT_URL = "scene-edit";  //场景编辑
var SCENE_GET_URL = "scene-get"; //获取指定场景信息
var SCENE_DEL_URL = "scene-del"; //删除指定场景
var SCENE_CHANGE_VALIDATE_RULE_URL = "scene-changeValidateRule";
var SCENE_GET_TEST_OBJECT_URL = "scene-getTestObject"; //获取场景的测试数据和测试地址

var SCENE_LIST_NO_DATA_SCENES_URL = "scene-listNoDataScenes"; //获取指定测试集中没有测试数据的测试场景列表

var TEST_SCENE_URL = "test-sceneTest";

//var SET_SCENE_LIST_URL = "scene-listSetScenes";
var SET_SCENE_LIST_URL = "set-listScenes";

var VALIDATE_GET_URL = "validate-getValidate";
var VALIDATE_FULL_EDIT_URL = "validate-validateFullEdit";

//组合场景
var COMPLEX_SET_SCENE_GET_URL = "set-getComplexScene"; //获取指定场景信息
var COMPLEX_SET_SCENE_EDIT_VARIABLES = "set-editComplexSceneVariables";//更新组合场景变量信息

var templateParams = {
		tableTheads:["接口", "报文", "场景名", "测试数据","备注", "操作"],
		btnTools:[{
			type:"primary",
			size:"M",
			id:"add-object",
			iconFont:"&#xe600;",
			name:"添加场景"
		},{
			type:"danger",
			size:"M",
			id:"batch-del-object",
			iconFont:"&#xe6e2;",
			name:"批量删除"
		},{
			type:"primary",
			size:"M",
			id:"add-to-complex-scene",
			iconFont:"&#xe600;",
			name:"添加到组合场景"
		},{
			type:"danger",
			size:"M",
			id:"del-from-complex-scene",
			iconFont:"&#xe6e2;",
			name:"从组合场景中删除"
		}],
		formControls:[
		{
			edit:true,
			label:"场景ID",  	
			objText:"messageSceneIdText",
			input:[{	
				hidden:true,
				name:"messageSceneId"
				}]
		},
		{
			required:true,
			label:"场景名称",  
			input:[{	
				name:"sceneName",
				placeholder:"输入场景名称"
				}]
		},
		{
			name:"message.messageId",
		},
		{
			label:"备注",  
			textarea:[{	
				name:"mark",
				placeholder:"输入场景备注或者备忘的查询数据用的SQL语句"
				}]
		},
		]		
	};

var columnsSetting = [
                      {
                      	"data":null,
                      	"render":function(data, type, full, meta){                       
                              return checkboxHmtl(data.sceneName, data.messageSceneId, "selectScene");
                          }},
                      {"data":"messageSceneId"},
                      ellipsisData("interfaceName"),
                      ellipsisData("messageName"),
                      ellipsisData("sceneName"),
                      {
                    	  "data":"testDataNum",
                          "render":function(data, type, full, meta){
                          	var context =
                          		[{
                        			type:"default",
                        			size:"M",
                        			markClass:"show-test-data",
                        			name:data
                        		}];
                              return btnTextTemplate(context);
                              }
            		    },  
                      {
            		    "data":"mark",
            		    "className":"ellipsis",
            		    "render":function(data, type, full, meta) { 
            		    	if (data != "" && data != null) {
                		    	return '<a href="javascript:;" onclick="showMark(\'' + full.sceneName + '\', \'mark\', this);"><span title="' + data + '">' + data + '</span></a>';
            		    	}
            		    	return "";
            		    }
                      },
                      {
                          "data":null,
                          "render":function(data, type, full, meta){
                        	  var context = [{
                              	title:"场景测试",
                  	    		markClass:"scene-test",
                  	    		iconFont:"&#xe603;"
                              }]; 
                        	  
                        	if (GetQueryString("complexSceneFlag") != null) {
                        		if ($.inArray("" + data.messageSceneId, complexSetScene.scenes) != -1) {
                        			return btnIconTemplate(context.concat(
                                			[{
                                            	title:"变量管理",
                                	    		markClass:"show-complex-scene-variables",
                                	    		iconFont:"&#xe61d;"                           	
                                            }]));
                        		}
                        		return btnIconTemplate(context);
                        	} 
                        	                        	                                                                                                         
                            if (setId == null) {
                            	return btnIconTemplate(context.concat(
                            			[{
                                        	title:"验证规则设定",
                            	    		markClass:"validate-method",
                            	    		iconFont:"&#xe654;"                           	
                                        },{
                            	    		title:"接口编辑",
                            	    		markClass:"scene-edit",
                            	    		iconFont:"&#xe6df;"
                            	    	},{
                            	    		title:"接口删除",
                            	    		markClass:"scene-del",
                            	    		iconFont:"&#xe6e2;"
                            	    	}]));
                            }
                            
                          	return btnIconTemplate(context);
                          }}
                  ];
var currentVariablesSpan;
var eventList = {
		"#add-object":function() {
			publish.renderParams.editPage.modeFlag = 0;					
			currIndex = layer_show("增加场景", editHtml, "550", "360", 1);
			//layer.full(index);
			publish.init();			
		},
		"#batch-del-object":function() {
			var checkboxList = $(".selectScene:checked");
			batchDelObjs(checkboxList,SCENE_DEL_URL);
		},
		".scene-edit":function() {
			var data = table.row( $(this).parents('tr') ).data();
			publish.renderParams.editPage.modeFlag = 1;
			publish.renderParams.editPage.objId = data.messageSceneId;
			layer_show("编辑场景信息", editHtml, "550", "380",1);
			publish.init();	
		},
		".scene-del":function() {
			var data = table.row( $(this).parents('tr') ).data();
			delObj("确定删除此场景？请慎重操作!",SCENE_DEL_URL, data.messageSceneId, this);
		},
		".scene-test":function() {
			var data = table.row( $(this).parents('tr') ).data();
			messageSceneId = data.messageSceneId;
			layer_show("场景测试", sceneTestHtml, '800','500', 1, function() {
				renderSceneTestPage();				
			});
			
		},
		".validate-method":function() {//场景验证规则管理
			var data = table.row( $(this).parents('tr') ).data();
			messageSceneId = data.messageSceneId;
			var index = layer.open({
	            type: 2,
	            title: data.sceneName + "-验证规则管理",
	            content: 'validateParameters.html?messageSceneId=' + messageSceneId
	        });
			layer.full(index);
			
		},
		".show-test-data":function() { //展示测试数据
			var data = table.row( $(this).parents('tr') ).data();	
			var title = data.interfaceName + "-" + data.messageName + "-" + data.sceneName + " " + "测试数据";
			var url = "testData.html?messageSceneId=" + data.messageSceneId + "&sceneName=" + data.sceneName;
			
			var index = layer_show(title, url, '1000','700', 2, null, function() {
				refreshTable();
			});		
		},
		".show-complex-scene-variables":function() {//展示组合场景中场景的变量管理
			var data = table.row( $(this).parents('tr') ).data();
			var context = {saveVariables:[],useVariables:[]};
			$.each(complexSetScene.saveVariables["" + data.messageSceneId], function(key, value) {
				context.saveVariables.push({key:key, value:value});
			});
			$.each(complexSetScene.useVariables["" + data.messageSceneId], function(key, value) {
				context.useVariables.push({key:key, value:value});
			});
			layer_show(data.sceneName + "-编辑变量", showSceneVariablesTemplate(context), "700", "330", 1, null, function() {
				//自动保存变量信息
				$.each($("#save-variables").siblings('div').children(".edit-this-variables"), function(i, n) {
					var variables = ($(n).text()).split(":");
					complexSetScene["saveVariables"]["" + data.messageSceneId][variables[0]] = variables[1];
				});
				$.each($("#use-variables").siblings('div').children(".edit-this-variables"), function(i, n) {
					var variables = ($(n).text()).split(":");
					complexSetScene["useVariables"]["" + data.messageSceneId][variables[0]] = variables[1];
				});				
			})
		},
		"#add-to-complex-scene":function() {//从组合场景中添加
			var checkboxList = $(".selectScene:checked");
			if (checkboxList.length < 1) {
				return false;
			}
			layer.confirm('确认添加选中的' + checkboxList.length + '个场景到该组合场景中?', {icon:0, title:'提示'}, function(index) {
				layer.close(index);
				$.each(checkboxList ,function(i, n) {
					if ($.inArray($(n).val(), complexSetScene.scenes) == -1) {
						complexSetScene.scenes.push($(n).val());
						complexSetScene.saveVariables["" + $(n).val()] = {};
						complexSetScene.useVariables["" + $(n).val()] = {};
					}
				});	
				table.rows().invalidate().draw(false);
				layer.msg('操作成功', {icon:1, time:1500});
			});
		},
		"#del-from-complex-scene":function() {//从组合场景中删除
			var checkboxList = $(".selectScene:checked");
			if (checkboxList.length < 1) {
				return false;
			}
			layer.confirm('确认从该组合场景删除选中的' + checkboxList.length + '个场景?', {icon:0, title:'提示'}, function(index) {
				layer.close(index);
				$.each(checkboxList ,function(i, n) {
					if ($.inArray($(n).val(), complexSetScene.scenes) != -1) {
						complexSetScene.scenes.splice($.inArray($(n).val(), complexSetScene.scenes), 1);
						delete complexSetScene.saveVariables["" + $(n).val()];
						delete complexSetScene.useVariables["" + $(n).val()];
					}
				});
				table.rows().invalidate().draw(false);
				layer.msg('操作成功', {icon:1, time:1500});
			});
			
		},
		"#save-variables,#use-variables":function() {//新建组合参数变量
			var name = $(this).text();
			var context = {"key":"", "value":""};
			layer_show("添加-" + name, editVariablesTemplate(context), '360', '240', 1, function(layero, index) {
				$("#save-new-varibales").attr("layer-index", index);
				$("#save-new-varibales").attr("mode", "add");
				$("#save-new-varibales").attr("parent-parameter-name", name);
			});	
		},
		"#save-new-varibales":function() {//保存变量信息
			if ($(this).attr("mode") == "edit") {
				currentVariablesSpan.text($("#scene-variables-key").val() + ':' +  $("#scene-variables-value").val());
			} else {
				$("label:contains('" + $(this).attr("parent-parameter-name") + "')").siblings('div')
					.append('<span class="label label-default radius edit-this-variables appoint">' + $("#scene-variables-key")
					.val() + ':' +  $("#scene-variables-value").val() 
					+ '</span><i class="Hui-iconfont del-this-variables appoint" style="margin-right:8px;">&#xe6a6;</i>');
			}
			
			layer.close($(this).attr("layer-index"));
			layer.msg('保存成功!', {icon:1, time:1500});
		},
		".edit-this-variables":function() {//编辑变量信息
			currentVariablesSpan = $(this);
			var keyValue = ($(this).text()).split("=");
			var name = $(this).parents('div').siblings('label').text();
			var context = {"key":keyValue[0], "value":keyValue[1]};
			layer_show("修改-" + name, editVariablesTemplate(context), '360', '240', 1, function(layero, index) {
				$("#save-new-varibales").attr("layer-index", index);
				$("#save-new-varibales").attr("mode", "edit");
				$("#save-new-varibales").attr("parent-parameter-name", name);
			});	
		},
		".del-this-variables":function() {//删除变量信息
			$(this).prev('span').remove();
			$(this).remove();
		},
		"#save-scene-variables":function() {//保存组合场景信息
			
			var useVariables = JSON.stringify(complexSetScene.useVariables);
			var saveVariables = JSON.stringify(complexSetScene.saveVariables);
			var scenes = complexSetScene.scenes.join(",");
			var index = parent.layer.getFrameIndex(window.name);//先得到当前iframe层的索引
			
			if (oldcomplexSetScene.scenes == scenes &&　oldcomplexSetScene.useVariables　==　useVariables
					&& oldcomplexSetScene.saveVariables == saveVariables) {				 
				parent.layer.close(index); //再执行关闭
				return false;
			}
			
			$.post(COMPLEX_SET_SCENE_EDIT_VARIABLES, {
				useVariables:useVariables, 
				saveVariables:saveVariables,
				scenes:scenes,
				id:complexSetScene.id
					}, 
				function(json) {
						if (json.returnCode == 0) {
							parent.refreshTable();
							parent.layer.close(index); //再执行关闭  
						} else {
							layer.alert("保存信息时出现错误：" + json.msg, {icon:5});
						}
			});
		}
};


var mySetting = {
		eventList:eventList,
		customCallBack:function(p) {
			if (GetQueryString("complexSceneFlag") != null) {
				table.column(5).visible(false);
				$("#add-object").attr("style", "display:none;");
				$("#batch-del-object").attr("style", "display:none;");
				return false;
			} 
			table.column(5).visible(true);
			$("#add-to-complex-scene").attr("style", "display:none;");
			$("#del-from-complex-scene").attr("style", "display:none;");
		},
		templateCallBack:function(df){
			//加载场景测试页面
			jqueryLoad("messageScene-test.htm", $("#scene-test-page"), function(domHmtl) {
				sceneTestHtml = domHmtl;			
			});
			
			//测试结果模板
			resultTemplate =  Handlebars.compile($("#scene-test-result").html());
			
			//测试集中组合场景的编辑页面
			if (GetQueryString("complexSceneFlag") == "0") {
				setId = GetQueryString("setId");
				//var complexSetScene;
				$.ajax({
					url:COMPLEX_SET_SCENE_GET_URL + "?id=" + GetQueryString("complexSceneId"),
					async: false,
					success:function(json) {
						if (json.returnCode == 0) {
							oldcomplexSetScene = $.extend({}, json.object);
							complexSetScene = json.object;
							complexSetScene.saveVariables = JSON.parse(complexSetScene.saveVariables);
							complexSetScene.useVariables = JSON.parse(complexSetScene.useVariables);							
							if (complexSetScene.scenes != "") {
								complexSetScene.scenes = (complexSetScene.scenes).split(",");
							} else {
								complexSetScene.scenes = [];
							}
						} else {
							layer.alert(json.msg, {icon:5});
						}
					}					
				});
				editVariablesTemplate = Handlebars.compile($("#edit-variables-template").html());
				showSceneVariablesTemplate = Handlebars.compile($("#show-scene-variables-template").html());
				publish.renderParams.listPage.listUrl = SET_SCENE_LIST_URL + "?setId=" + setId + "&mode=0";
				publish.renderParams.listPage.dtOtherSetting.serverSide = false;
				df.resolve();
				return false;
			}
					
			//测试集中测试场景增加数据
			if (GetQueryString("addDataFlag") == "0") {
				setId = GetQueryString("setId");
				publish.renderParams.listPage.listUrl = SCENE_LIST_NO_DATA_SCENES_URL + "?setId=" + setId;
				publish.renderParams.listPage.dtOtherSetting.serverSide = false;
				
				$("#btn-tools").parent("div").hide();
				
				df.resolve();
				return false;
			}
			//正常展示指定报文中的测试场景
			messageId = GetQueryString("messageId");
			interfaceName = GetQueryString("interfaceName");
			messageName = GetQueryString("messageName");				
			publish.renderParams.listPage.listUrl = SCENE_LIST_URL + "?messageId=" + messageId;
									
			df.resolve();			   		 	
   	 	},
		editPage:{
			editUrl:SCENE_EDIT_URL,
			getUrl:SCENE_GET_URL,
			rules:{
				sceneName:{
					required:true,
					minlength:2,
					maxlength:255
				}										
			},
			beforeInit:function(df){
				$("#message\\.messageId").val(messageId);
       		 	df.resolve();
       	 	},

		},		
		listPage:{
			listUrl:SCENE_LIST_URL,
			tableObj:".table-sort",
			columnsSetting:columnsSetting,
			columnsJson:[0, 6, 7],
			dtOtherSetting:{
				"bStateSave": false
			}
		},
		templateParams:templateParams		
	};

$(function(){
	publish.renderParams = $.extend(true,publish.renderParams,mySetting);
	publish.init();
});

/**********************************************************************************************************************/

/**
 * 场景测试页面渲染
 */
function renderSceneTestPage(flag) {
	var index = layer.msg('加载中,请稍后...', {icon:16, time:60000, shade:0.35});
	$.get(SCENE_GET_TEST_OBJECT_URL, {messageSceneId:messageSceneId}, function(data){					
		if(data.returnCode == 0){
			var selectUrl=$("#selectUrl");
			var selectData=$("#selectData");
						
			selectData.html('');
			$(".textarea").val('');
			
			if (flag != 0) {
				selectUrl.html('');				
				$.each(data.urls,function(i,n){
					selectUrl = selectUrl.append("<option value='"+n+"'>"+n+"</option>");
				});	
			}
						
			
			if (data.testData.length > 0) {
				$.each(data.testData,function(i,n){
					selectData = selectData.append("<option data-id='" + n.dataId + "' value='" + i + "'>" + n.dataDiscr + "</option>");
				});
				$(".textarea").val(data.testData[0].dataJson);
				$("#selectData").change(function(){
					var p1 = $(this).children('option:selected').val();
					$(".textarea").val(data.testData[p1].dataJson);
				});
			}
		} else {
			layer.alert(data.msg, {icon:5});
		}	
		layer.close(index);
	});
}

/**
 * 场景测试
 */
function sceneTest() {
	var requestUrl=$("#selectUrl").val();
	var requestMessage=$(".textarea").val();
		
	if(requestUrl == "" || requestUrl == null || requestMessage == "" || requestMessage == null){
		layer.msg('请选择正确的接口地址和测试数据',{icon:2, time:1500});
		return;
	}
	var dataId = $("#selectData > option:selected").attr("data-id");
	var index = layer.msg('正在进行测试...', {icon:16, time:60000, shade:0.35});
	$.post(TEST_SCENE_URL, {messageSceneId:messageSceneId, dataId:dataId, requestUrl:requestUrl, requestMessage:requestMessage},function(data){
		if(data.returnCode==0){
			renderSceneTestPage(0);
			layer.close(index);
			var color="";
			var flag="";
			if (data.result.runStatus == "0") {
				color="green";
				flag="SUCCESS";
			} else if (data.result.runStatus == "1"){
				color="red";
				flag="FAIL";
			} else {
				color="red";
				flag="STOP";
			}
			
			
			var resultData = {
				color:color,
				flag:flag,
				useTime:data.result.useTime,
				statusCode:data.result.statusCode,
				responseMessage:(data.result.responseMessage == "null") ? "" : data.result.responseMessage,
				mark:data.result.mark
			};			
			
			parent.layer.open({
				  title: '测试结果',
				  shade: 0,
				  type: 1,
				  skin: 'layui-layer-rim', //加上边框		
				  area: ['700px', '600px'], //宽高
				  anim:-1,
				  content: resultTemplate(resultData)
				});
		}else{
			layer.close(index);
			layer.alert(data.msg, {icon:5});
		}
	});
}


