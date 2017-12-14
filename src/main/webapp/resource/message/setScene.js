var table;
//遮罩层覆盖区域
var $wrapper = $('#div-table-container');

var setId;
var setName;
var currentSetInfo;//当前测试集信息
var mode = 0; //0-管理  1-添加

var settingConfigViewTemplate;//运行时配置页面模板

var templateParams = {
		tableTheads:["接口", "报文", "场景", "操作"],
		btnTools:[{
			type:"primary",
			size:"M",
			id:"manger-scene",
			iconFont:"&#xe60c;",
			name:"管理场景"
		},{
			size:"M",
			id:"add-scene",
			iconFont:"&#xe600;",
			name:"添加场景"
		},{
			size:"M",
			id:"batch-op",
			iMarkClass:"Hui-iconfont-del3",
			name:"批量操作"
		},{
			type:"success",
			size:"M",
			id:"setting-set-config",
			iconFont:"&#xe62e;",
			name:"运行时设置"
		},{
			type:"success",
			size:"M",
			id:"show-complex-set-scene",
			iconFont:"&#xe6f3;",
			name:"组合场景"
		},{
			type:"success",
			size:"M",
			id:"edit-set-info",
			iconFont:"&#xe60c;",
			name:"编辑测试集信息"
		},{
			type:"danger",
			size:"M",
			id:"del-this-set",
			iconFont:"&#xe6e2;",
			name:"删除当前测试集"
		}]		
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
                         "data":null,
                         "render":function(data, type, full, meta){
                        	 
                           var context;
                           
                           //管理-删除
                           if (mode == 0) {
                        	   context = [{
	   	               	    		title:"删除",
	   	               	    		markClass:"op-scene",
	   	               	    		iconFont:"&#xe6e2;"
                  	    		}];
                           }
                           
                           //添加
                           if (mode == 1) {
                        	   context = [{
	   	               	    		title:"添加",
	   	               	    		markClass:"op-scene",
	   	               	    		iconFont:"&#xe600;"
                 	    		}];
                           }
                           
                           
                         	return btnIconTemplate(context);
                       }}										     
];


var eventList = {
		"#batch-op":function() { //批量操作 删除或者添加
			var checkboxList = $(".selectScene:checked");
			var opName = "删除";
			if (mode == 1) {
				opName = "添加";
			}
			batchDelObjs(checkboxList, SET_OP_SCENE_URL + "?mode=" + mode + "&setId=" + setId, table, opName)
		},
		"#setting-set-config":function() {
			
			if (currentSetInfo == null) {
				return false;
			}
			var tip = "<strong><span class=\"c-primary\">【自定义】</span></strong><br>点击<span class=\"c-warning\">'默认'</span>将会恢复为默认配置<br>点击<span class=\"c-warning\">'自定义'</span>修改或者查看当前配置!"
			var mode = 1;
			if (currentSetInfo.config == null) {
				tip = "<strong><span class=\"c-primary\">【默认】</span></strong><br>点击<span class=\"c-warning\">'自定义'</span>将会创建自定义的配置信息<br>点击<span class=\"c-warning\">'默认'</span>返回!";
				mode = 0;
			}
			tip += "<br>点击<span class=\"c-warning\">'自定义模板'</span>选择一个模板并配置为该测试集的运行时设置!";
			
			layer.confirm('当前选择的运行时配置为：' + tip, {icon: 0,title:'提示', btn:['默认', '自定义', '自定义模板'],
				btn3:function(index) {
					//选择自定义模板
					$.post(GLOBAL_VARIABLE_LIST_URL, {variableType:"setRuntimeSetting"}, function(json) {
						if (json.returnCode == 0) {
							showSelectBox(json.data, "variableId", "variableName", function(variableId, globalVariable, index1) {
								$.post(SET_RUN_SETTING_CONFIG_URL, {setId:currentSetInfo.setId, variableId:variableId}, function(json) {
									if (json.returnCode == 0) {
										currentSetInfo.config = json.config;
										layer.msg('已确定选择！', {icon:1, time:1800});
										layer.closeAll('page');
									} else {
										layer.alert(json.msg, {icon:5});
									}
								});																
							})
						} else {
							layer.alert(json.msg, {icon:5});
						}
					});
				}}
				, function(index) {
					if (mode == 1) {
						settingConfig(currentSetInfo.setId, mode, function (json) {
							currentSetInfo.config = null;
							layer.close(index);
							layer.msg("修改成功!", {icon:1, time:1500});
						});
					} else {
						layer.close(index);
					}										
				}
				, function(index) {
					if (mode == 0) {
						settingConfig(currentSetInfo.setId, mode, function (json) {
							currentSetInfo.config = json.config;
							layer.close(index);
							viewRunSettingConfig();	
						});
					} else {					
						viewRunSettingConfig();	
					}
									
				});
		},
		"#update-option":function() {
			updateTestOptions();
		},
		"#reset-option":function() {
			resetOptions();
		},
		"#del-this-set":function () {//删除当前测试集
			parent.delSet('确认删除此测试集吗？<br><span class="c-red">删除之后将会跳转到测试集列表</span>', setId, function(json) {
				parent.$("#show-all-set").click();
			});
		},
		"#show-complex-set-scene":function () {//打开组合场景页面		
			$(this).attr("data-title", setName + " - 测试集 - 组合场景");
			$(this).attr("_href", "resource/message/complexSetScene.html?setId=" + setId);
			parent.Hui_admin_tab(this);
		},
		"#edit-set-info":function () { //编辑当前测试集信息
			parent.publish.renderParams.editPage.modeFlag = 1;
			parent.publish.renderParams.editPage.objId = setId;
			parent.layer_show("编辑测试集信息", parent.editHtml, 550, parent.editPageHeight.edit, 1);
			parent.publish.init();	
		},
		"#manger-scene":function() { //管理测试集 - 从测试集中删除
			var that = this;
			mode = 0;				
			refreshTable(SET_SCENE_LIST_URL + "?mode=" + mode + "&setId=" + setId, function(json) {
				$(that).addClass('btn-primary').siblings("#add-scene").removeClass('btn-primary');
			}, null, true);	
			$("#batch-op").children("i").removeClass("Hui-iconfont-add").addClass("Hui-iconfont-del3");
		},
		"#add-scene":function() { //添加测试场景
			var that = this;
			mode = 1;			
			refreshTable(SET_SCENE_LIST_URL + "?mode=" + mode + "&setId=" + setId, function(json) {
				$(that).addClass('btn-primary').siblings("#manger-scene").removeClass('btn-primary');
			}, null, true);	
			$("#batch-op").children("i").removeClass("Hui-iconfont-del3").addClass("Hui-iconfont-add");
		},
		".op-scene":function() {//单条删除或者添加
			var tip = '删除';
			
			if (mode == 1) {
				tip = "添加";
			}
						
			var data = table.row( $(this).parents('tr') ).data();
			var that = this;
			layer.confirm('确定要' + tip + '此场景吗?', {icon:0, title:'警告'}, function(index) {
				layer.close(index);
				$.get(SET_OP_SCENE_URL + "?mode=" + mode + "&setId=" + setId + "&messageSceneId=" + data.messageSceneId, function(json) {
					if (json.returnCode == 0) {
						table.row($(that).parents('tr')).remove().draw();
						layer.msg(tip + '成功!', {icon:1, time:1500});
					} else {
						layer.alert(json.msg, {icon:5});
					}
				});
			});						
		}	
};


var mySetting = {
		eventList:eventList,
		templateCallBack:function(df){
			setId = GetQueryString("setId");
			
			$.post(SET_GET_URL, {id:setId}, function(data) {
				if (data.returnCode == 0) {
					currentSetInfo = data.object;
				} else {
					layer.alert(data.msg, {icon:5});
				}
				
			});
			
			setName = GetQueryString("setName");
			//判断是从那个页面打开的 flag=true从目录树跳转的
			if (!GetQueryString("flag")) {
				$("#setting-set-config,#del-this-set,#show-complex-set-scene,#edit-set-info").hide();
			}
			settingConfigViewTemplate = Handlebars.compile($("#setting-config-template").html());
			publish.renderParams.listPage.listUrl = SET_SCENE_LIST_URL + "?mode=" + mode + "&setId=" + setId;
			df.resolve();			   		 	
   	 	},
		listPage:{
			tableObj:".table-sort",
			columnsSetting:columnsSetting,
			columnsJson:[0, 5],
			dtOtherSetting:{
				serverSide:false
			},
			exportExcel:false
		},
		templateParams:templateParams		
	};


$(function(){
	publish.renderParams = $.extend(true,publish.renderParams,mySetting);
	publish.init();
});

/****************************************************************/
function viewRunSettingConfig () { 
	layer_show(currentSetInfo.setName + "-运行时配置", settingConfigViewTemplate(currentSetInfo.config), '800', '510', 1, function() {
		resetOptions();
	});
}

function settingConfig(setId, mode, callback) {
	$.post(SET_RUN_SETTING_CONFIG_URL, {setId:setId, mode:mode}, function(json) {
		if (json.returnCode == 0) {			
			callback(json);
		} else {
			layer.alert(json.msg, {icon:5});
		}
	});
}

function resetOptions () {
	if (currentSetInfo.config != null) {
		$("#requestUrlFlag").val(currentSetInfo.config.requestUrlFlag);
		$("#connectTimeOut").val(currentSetInfo.config.connectTimeOut);
		$("#readTimeOut").val(currentSetInfo.config.readTimeOut);
		$("#checkDataFlag").val(currentSetInfo.config.checkDataFlag);
		$("#configId").val(currentSetInfo.config.configId);
		$("#runType").val(currentSetInfo.config.runType);
		$("#customRequestUrl").val(currentSetInfo.config.customRequestUrl);
		$("#retryCount").val(currentSetInfo.config.retryCount);
	}
}

//更新配置信息
function updateTestOptions(){
	var updateConfigData = $("#form-setting-config").serializeArray();
	$.post(UPDATE_TEST_CONFIG_URL, updateConfigData, function(data){
		if(data.returnCode == 0){
			currentSetInfo.config = data.config;
			layer.msg('更新成功',{icon:1, time:1500});
		} else {
			layer.alert("更新失败：" + data.msg, {icon:5});
		}
	});	
}