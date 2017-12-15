var table;
//遮罩层覆盖区域
var $wrapper = $('#div-table-container');

var interfaceId; //当前正在编辑的interface的id
var currIndex;//当前正在操作的layer窗口的index

var advancedQueryFormTemplate;//高级查询页面模板
var advancedQueryParameters = {
		interfaceName:"",
		interfaceCnName:"",
		interfaceType:"",
		interfaceProtocol:"",
		status:"",
		createTimeText:"",
		createUserName:"",
		mark:""
		
}; //高级查询的相关参数

var templateParams = {
		tableTheads:["名称","报文", "中文名","类型","协议","创建时间","状态","创建用户","最后修改","参数", "备注","操作"],
		btnTools:[{
			type:"primary",
			size:"M",
			id:"add-object",
			iconFont:"&#xe600;",
			name:"添加接口"
		},{
			type:"danger",
			size:"M",
			id:"batch-del-object",
			iconFont:"&#xe6e2;",
			name:"批量删除"
		},{
			type:"success",
			size:"M",
			id:"import-data-from-excel",
			iconFont:"&#xe642;",
			name:"Excel导入"
		},{
			type:"primary",
			size:"M",
			id:"advanced-query",
			iconFont:"&#xe665;",
			name:"高级查询"
		},{
			type:"primary",
			size:"M",
			id:"export-interface-document",
			iconFont:"&#xe644;",
			name:"下载接口文档"
		}],
		formControls:[
		{
			edit:true,
			label:"接口ID",  	
			objText:"interfaceIdText",
			input:[{	
				hidden:true,
				name:"interfaceId"
				}]
		},
		{
			required:true,
			label:"接口名称",  
			input:[{	
				name:"interfaceName"
				}]
		},
		{
			required:true,
			label:"接口类型",  	
			select:[{	
				name:"interfaceType",
				option:[{
					value:"SL",
					text:"受理类"
				},{
					value:"CX",
					text:"查询类",
					selected:"selected"
				}]
				}]
		},
		{
			required:true,
			label:"协议类型",  	
			select:[{	
				name:"interfaceProtocol",
				option:[{
					value:"HTTP",
					text:"HTTP",
					selected:"selected"
				},{
					value:"WebService",
					text:"WebService",					
				},{
					value:"Socket",
					text:"Socket",					
				}]
				}]
		},
		{
			required:true,
			label:"中文名称",  	
			input:[{	
				name:"interfaceCnName"
				}]
		},
		{
			label:"模拟请求地址",  	
			input:[{	
				name:"requestUrlMock",
				placeholder:"输入完整的Url请求地址,带http://"
				}]
		},
		{	
			required:true,
			label:"真实请求地址",  	
			input:[{	
				name:"requestUrlReal",
				placeholder:"输入完整的Url请求地址,带http://"
				}]
		},
		{	
			required:true,
			label:"接口状态",  			
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
			edit:true,			
			label:"创建日期",  
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
		},
		{
			name:"user.userId"
							
		},
		{
			edit:true,			
			label:"最后修改",  
			objText:"lastModifyUserText",
			input:[{	
				hidden:true,
				name:"lastModifyUser"
				}]
		},{
			label:"备注",  
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
                  return checkboxHmtl(data.interfaceName+'-'+data.interfaceCnName,data.interfaceId,"selectInterface");
              }},
          {"data":"interfaceId"},
          {
          	"className":"ellipsis",
		    "data":"interfaceName",
          	"render":CONSTANT.DATA_TABLES.COLUMNFUN.ELLIPSIS
          	},
          	{
                "data":"messagesNum",
                "render":function(data, type, full, meta){
                	var context =
                		[{
              			type:"default",
              			size:"M",
              			markClass:"show-interface-messages",
              			name:data
              		}];
                    return btnTextTemplate(context);
                }},
          {
      		"className":"ellipsis",
		    "data":"interfaceCnName",
		    "render":CONSTANT.DATA_TABLES.COLUMNFUN.ELLIPSIS
          		},
          {
          	"data":"interfaceType",
          	"render":function(data, type, full, meta ){
          		var option = {
          				"SL":{
          					btnStyle:"warning",
          					status:"受理类"
          					},
          				"CX":{
          					btnStyle:"success",
          					status:"查询类"
          				}
          		};                  
          		return labelCreate(data, option);
              }},
          {
            "data":"interfaceProtocol",
            "render":function(data) {
            	return labelCreate(data.toUpperCase());
            }
          },
          ellipsisData("createTime"),
          {
          	"data":"status",
          	"render":function(data, type, full, meta ){
                  return labelCreate(data);
              }},
          ellipsisData("user.realName"),ellipsisData("lastModifyUser"),
          
          {
              "data":"parametersNum",
              "render":function(data, type, full, meta){
              	var context =
              		[{
            			type:"secondary",
            			size:"M",
            			markClass:"edit-params",
            			name:data
            		}];
                  return btnTextTemplate(context);
              }},
          {
  		    "data":"mark",
  		    "className":"ellipsis",
  		    "render":function(data, type, full, meta) { 
  		    	if (data != "" && data != null) {
      		    	return '<a href="javascript:;" onclick="showMark(\'' + full.interfaceName + '\', \'mark\', this);"><span title="' + data + '">' + data + '</span></a>';
  		    	}
  		    	return "";
  		    }
            },
          {
              "data":null,
              "render":function(data, type, full, meta){
                var context = [{
    	    		title:"接口编辑",
    	    		markClass:"interface-edit",
    	    		iconFont:"&#xe6df;"
    	    	},{
    	    		title:"接口删除",
    	    		markClass:"interface-del",
    	    		iconFont:"&#xe6e2;"
    	    	}];
              	return btnIconTemplate(context);
              }}
      ];	

var eventList = {
		".show-interface-messages":function(){
			var data = table.row( $(this).parents('tr') ).data();			
			$(this).attr("data-title", data.interfaceName + "-" + data.interfaceCnName + " " + "报文管理");
			$(this).attr("_href", "resource/message/message.html?interfaceId=" + data.interfaceId + "&protocol=" + data.interfaceProtocol);
			Hui_admin_tab(this);			
		},
		"#add-object":function(){
			publish.renderParams.editPage.modeFlag = 0;					
			layer_show("增加接口", editHtml, editPageWidth, editPageHeight.add, 1);
			publish.init();
			
		},
		"#batch-del-object":function(){
			var checkboxList = $(".selectInterface:checked");
			batchDelObjs(checkboxList,INTERFACE_DEL_URL);
		},
		".edit-params":function(){
			var data = table.row( $(this).parents('tr') ).data();
			layer_show(data.interfaceName + "-" + data.interfaceCnName +" 接口参数管理", "interfaceParameter.html?interfaceId=" + data.interfaceId
					, null, null, 2, null, function() {
					refreshTable();
			});	
		},
		".interface-edit":function(){
			var data = table.row( $(this).parents('tr') ).data();
			publish.renderParams.editPage.modeFlag = 1;
			publish.renderParams.editPage.objId = data.interfaceId;
			layer_show("编辑接口信息", editHtml, editPageWidth, editPageHeight.edit,1);
			publish.init();	
		},
		".interface-del":function(){
			var data = table.row( $(this).parents('tr') ).data();
			delObj("确定删除此接口？此操作同时会删除该接口下所有的报文以及场景相关数据,请谨慎操作!",INTERFACE_DEL_URL,data.interfaceId,this);
		},
		"#import-data-from-excel":function() {
			createImportExcelMark("Excel导入接口信息", "../../excel/upload_interface_template.xlsx"
					, UPLOAD_FILE_URL, INTERFACE_IMPORT_FROM_EXCEL_URL);
		},
		"#advanced-query":function() {//打开高级查询页面
			currIndex = layer_show("接口-高级查询", advancedQueryFormTemplate(advancedQueryParameters), '600', '430', 1
					, function(layero, index) {
						$.each(advancedQueryParameters, function(name, value) {
							if ($("#" + name)) {
								 $("#" + name).val(advancedQueryParameters[name]);
							}
						});			
						layui.use('laydate', function(){
							  var laydate = layui.laydate;							  
							  //执行一个laydate实例
							  laydate.render({
							    elem: '#createTimeText' //指定元素
							    ,value: advancedQueryParameters["createTime"]
							    ,range: '~'
							  });
							});
					}, function() {
						saveQueryParameters();
					});
		},
		"#submit-advanced-query":function() {//提交高级查询数据			
			saveQueryParameters();
			layer.close(currIndex);
			refreshTable(INTERFACE_LIST_URL + "?queryMode=advanced&" + $("#advanced-query-form").serialize());			
		},
		"#submit-advanced-query-reset":function() {//保存高级查询参数并刷新表格显示所有
			saveQueryParameters();
			layer.close(currIndex);
			refreshTable(INTERFACE_LIST_URL);			
		},
		"#export-interface-document":function() {//导出详细的接口文档			
			var checkboxList = $(".selectInterface:checked");
			if (checkboxList.length < 1) {
				return false;
			}
			
			layer.confirm('确认导出选中的' + checkboxList.length + "条接口的详细文档?", {title:'提示', anim:5}, function (index) {
				var loadindex = layer.msg('正在批量导出接口文档...', {icon:16, time:60000, shade:0.35});
				var ids = [];
				$.each(checkboxList, function (i, n) {
					ids.push($(n).val());
				});
				
				$.post(INTERFACE_EXPORT_DOCUMENT_EXCEL_URL, {ids:ids.join(",")}, function (json) {
					layer.close(loadindex);
					if (json.returnCode == 0) {
						window.open("../../" + json.path)
					} else {
						layer.alert(json.msg, {icon:5});
					}
				});
				layer.close(index);
			});
		}
		
};

var mySetting = {
		eventList:eventList,
		templateCallBack:function(df) {
			advancedQueryFormTemplate = Handlebars.compile($("#advanced-query-form-template").html())
			df.resolve();
		},
		editPage:{
			editUrl:INTERFACE_EDIT_URL,
			getUrl:INTERFACE_GET_URL,
			rules:{
				interfaceName:{
					required:true,
					remote:{
						url:INTERFACE_CHECK_NAME_URL,
						type:"post",
						dataType: "json",
						data: {                   
					        interfaceName: function() {
					            return $("#interfaceName").val();
					        },
					        interfaceId:function(){
					        	return $("#interfaceId").val();
					        }
					}}
				},				
				interfaceType:{
					required:true,
				},
				interfaceCnName:{
					required:true,
					minlength:2,
					maxlength:100
				},
				requestUrlReal:{
					required:true,
				},
				status:{
					required:true,
				}			
			}

		},		
		listPage:{
			listUrl:INTERFACE_LIST_URL,
			tableObj:".table-sort",
			columnsSetting:columnsSetting,
			columnsJson:[0, 12, 13]
		},
		templateParams:templateParams		
	};

$(function(){			
	publish.renderParams = $.extend(true,publish.renderParams,mySetting);
	publish.init();
});

/******************************************************************************************************/
function saveQueryParameters () {
	$.each(advancedQueryParameters, function(name, value) {
		if ($("#" + name)) {
			advancedQueryParameters[name] = $("#" + name).val();
		}
	});
}
