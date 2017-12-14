//遮罩层覆盖区域
var $wrapper = $('#div-table-container');

var setId; //当前测试id
var currIndex;//当前正在操作的layer窗口的index

var validateValueOriginal; //原始验证值

var thisMark = "";
var table;


var templateParams = {
		tableTheads:["名称", "包含场景", "创建时间", "备注", "操作"],
		btnTools:[{
			type:"primary",
			size:"M",
			markClass:"add-object",
			iconFont:"&#xe600;",
			name:"添加组合场景"
		},{
			type:"danger",
			size:"M",
			markClass:"batch-del-object",
			iconFont:"&#xe6e2;",
			name:"批量删除"
		}],
		formControls:[
		{
			edit:true,
			label:"ID",  	
			objText:"idText",
			input:[{	
				hidden:true,
				name:"id"
				}]
		},
		{
			required:true,
			label:"组合场景名称",  
			input:[{	
				name:"complexSceneName",
				placeholder:"输入组合场景名称"
				}]
		},
		{
			name:"setId",
		},
		{
			label:"备注",  
			textarea:[{	
				name:"mark"
				}]
		},
		]		
	};

var columnsSetting = [
                      {
                      	"data":null,
                      	"render":function(data, type, full, meta){                       
                              return checkboxHmtl(data.complexSceneName, data.id, "selectComplexScene");
                          }},
                      {"data":"id"},
                      ellipsisData("complexSceneName"),                     
                      {
                    	  "data":"scenesNum",
                          "render":function(data, type, full, meta){
                          	var context =
                          		[{
                        			type:"default",
                        			size:"M",
                        			markClass:"show-scenes",
                        			name:data
                        		}];
                              return btnTextTemplate(context);
                              }
            		    },            		    
            	       ellipsisData("createTime"),
                      {
            		    "data":"mark",
            		    "className":"ellipsis",
            		    "render":function(data, type, full, meta) { 
            		    	if (data != "" && data != null) {
                		    	return '<a href="javascript:;" onclick="showMark(\'' + full.complexSceneName + '\', \'mark\', this);"><span title="' + data + '">' + data + '</span></a>';
            		    	}
            		    	return "";
            		    }
                      },
                      {
                          "data":null,
                          "render":function(data, type, full, meta){
                            var context = [{
                	    		title:"场景编辑",
                	    		markClass:"complex-scene-edit",
                	    		iconFont:"&#xe6df;"
                	    	},{
                	    		title:"场景删除",
                	    		markClass:"complex-scene-del",
                	    		iconFont:"&#xe6e2;"
                	    	}];                              
                          	return btnIconTemplate(context);
                          }}
                  ];

var eventList = {
		".add-object":function() {
			publish.renderParams.editPage.modeFlag = 0;					
			currIndex = layer_show("添加组合场景", editHtml, editPageWidth, editPageHeight.add, 1);
			publish.init();			
		},
		".batch-del-object":function() {
			var checkboxList = $(".selectComplexScene:checked");
			batchDelObjs(checkboxList, COMPLEX_SET_SCENE_DEL_URL);
		},
		".complex-scene-edit":function() {
			var data = table.row( $(this).parents('tr') ).data();
			publish.renderParams.editPage.modeFlag = 1;
			publish.renderParams.editPage.objId = data.id;
			layer_show("编辑组合场景信息", editHtml, editPageWidth, editPageHeight.edit, 1);
			publish.init();	
		},
		".complex-scene-del":function() {
			var data = table.row( $(this).parents('tr') ).data();
			delObj("确定删除此组合场景？ 请慎重操作!",COMPLEX_SET_SCENE_DEL_URL, data.id, this);
		},
		".show-scenes":function() { //管理组合中的场景
			var data = table.row( $(this).parents('tr') ).data();
			layer_show("组合场景设定", "messageScene.html?setId=" + setId 
					+ "&complexSceneId=" + data.id + "&complexSceneFlag=0", null, null, 2, null, function(index, layero) {//点击x关闭时保存
				var body = layer.getChildFrame('body', index);
				body.find('#save-scene-variables').click();
				return false;
			})
		}
};


var mySetting = {
		eventList:eventList,
		templateCallBack:function(df){			
			setId = GetQueryString("setId");			
			publish.renderParams.listPage.listUrl = COMPLEX_SET_SCENE_LIST_URL + "?setId=" + setId;
									
			df.resolve();			   		 	
   	 	},
		editPage:{
			editUrl:COMPLEX_SET_SCENE_EDIT_URL,
			getUrl:COMPLEX_SET_SCENE_GET_URL,
			rules:{
				complexSceneName:{
					required:true,
					minlength:2,
					maxlength:255
				}										
			},
			beforeInit:function(df){
				$("#setId").val(setId);
       		 	df.resolve();
       	 	},

		},		
		listPage:{
			listUrl:COMPLEX_SET_SCENE_LIST_URL,
			tableObj:".table-sort",
			columnsSetting:columnsSetting,
			columnsJson:[0, 5, 6],
			dtOtherSetting:{
				"serverSide": false
			}
		},
		templateParams:templateParams		
	};

$(function(){
	publish.renderParams = $.extend(true,publish.renderParams,mySetting);
	publish.init();
});

/**********************************************************************************************************************/




