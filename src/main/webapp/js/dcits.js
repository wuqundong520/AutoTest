/* -----------神州数码自动化测试平台-------------
* dcits.js V1.0
* Created & Modified by xuwangcheng
* Date modified 2017-01.22
*
* Copyright 2015-2016 神州数码系统集成服务有限公司 All rights reserved.
* Licensed under MIT license.
* http://opensource.org/licenses/MIT
*
*/
/**
 * handlebars模板 
 */
var tableTheadTemplate;
var btnTextTemplate;
var btnIconTemplate;
var formControlTemplate;

var editHtml = "";
var table;
var editPageWidth = 800;
var editPageHeight;
var maxHeight = $(document).height();
var maxWidth = $(document).width();


$(function() {
	//加载对应的js文件		
	var r = (window.location.pathname.split("."))[0].split("/");
	r = r[r.length-1] + ".js";
	dynamicLoadScript(r);
});

//设置jQuery Ajax全局的参数  
$.ajaxSetup({  
    error: function (jqXHR, textStatus, errorThrown) {  
    	layer.closeAll('dialog');
        switch (jqXHR.status) {  
            case(500):  
                layer.alert("服务器系统内部错误", {icon:5});  
                break;  
            case(401):  
            	layer.alert("未登录或者身份认证过期", {icon:5});  
                break;  
            case(403):  
            	layer.alert("你的权限不够", {icon:5});  
                break;  
            case(408):  
            	layer.alert("AJAX请求超时",{icon:5});
                break;  
            default:  
            	layer.alert("AJAX调用失败", {icon:5});
        }        
    }
});

//DT的配置常量
var CONSTANT = {
		DATA_TABLES : {	
			DEFAULT_OPTION:{
			"aaSorting": [[ 1, "desc" ]],//默认第几个排序
            "bStateSave": true,//状态保存
            "processing": false,   //显示处理状态
    		"serverSide": true,  //服务器处理
        	"autoWidth": false,   //自动宽度
        	"scrollX": false,//水平滚动条
            "responsive": false,   //自动响应
            "searchDelay": 800, //搜索间隔,默认为400ms
            "language": {
                "url": "../../js/zh_CN.txt"
            },
            "lengthMenu": [[10, 20, 50, 100, 999999], ['10', '20', '50','100', '全部数据']],  //显示数量设置
            //行回调
            "createdRow": function ( row, data, index ){
                $(row).addClass('text-c');
            }},
            //常用的COLUMN
			COLUMNFUN:{
				//过长内容省略号替代
				ELLIPSIS:function (data, type, row, meta) {
                	data = data||"";
                	return '<span title="' + data + '">' + data + '</span>';
                }
			}
		}
};


/**
 * 初始化方式
 * 通过以下方式来设置相关参数 
 * publish.renderParams = $.extend(true,publish.renderParams,mySetting);
 * 通过publish.init();来进行初始化
 */
var publish = {
     //模块初始化入口
     init : function(){
    	 var that = this;
    	//模板渲染只有一次
		 var df1 = $.Deferred();
		 df1.done(function(){
			 var df = $.Deferred();
	    	 df.done(function(){
	    		 that.renderData(that.renderParams.customCallBack);
	    		 //防止事件被绑定多次
	    		 (that.renderParams.ifFirst == true) && (that.initListeners(that.renderParams.eventList));
	    	 }); 
	    	 if (that.renderParams.renderType == "list") {
	    		 that.renderParams.listPage.beforeInit(df);
	    	 } else if (that.renderParams.renderType == "edit") {
	    		 that.renderParams.editPage.beforeInit(df);
	    	 }	    	 	   
		 });
		 if (that.renderParams.ifFirst == true) {
			 that.renderTemplate(df1,that.renderParams.templateCallBack); 
		 } else {
			 df1.resolve();
		 }	
     },
     /**
      * 渲染所需参数
      * 不可选：
      * ifFirst: true 当前是否为本页面第一次初始化  防止事件被重复绑定 默认为true
      * 可选:
      * customCallBack:自定义数据渲染 不是list  edit页面的自定义数据渲染方法 或者在DT初始化完毕之后进行二次渲染  参数p = renderParams
      * templateCallBack:自定义模板渲染 默认模板渲染之后的二次渲染
      * eventList:页面event绑定 默认{}
      * renderType: 当前渲染模式 listPage还是editPage 默认为list 可选edit
      * userDefaultRender:是否使用默认的数据渲染  默认为true  可选 false为不使用,仅使用使用提供customCallBack回调方法中的渲染
      * userDefaultTemplate:是否使用默认的模板渲染  默认为true 可选false为不使用,仅使用templateCallBack回调中的默认渲染
      * 
      * 
      * list页面
      * 必须：
      * listUrl: Datatables请求数据地址 必要
      * tableObj:对应的DT容器jquery对象 必要
      * columnsSetting:列的设置
      * 
      * 可选:
      * beforeInit:执行list页面的init方法之前执行的方法  请在该方法最后调用df.resolve();   
      * columnsJson:不参与排序的列
      * dtOtherSetting:DT其他的自定义设置
      * dtAjaxCallback:DataTables在每次通过ajax.reload返回之后的回调
      * exportExcel:是否在工具栏添加  导出到excel 的按钮工具  默认为true
      * 
      * edit页面
      * 必须：
      * editUrl:编辑请求地址 必要
      * ifUseValidate:是否使用jqueryValidate插件  默认true  可选false  如果不使用,需要自己定义提交事件
      * 可选：
      * beforeInit:执行edit页面的init方法之前执行  请在该方法最后调用df.resolve();
      * formObj:对应的form容器 默认为 ".form-horizontal" 可选
      * modeFlag:指定时add还是edit操作  默认为0-add  可选 1-edit
      * objId: get实体时需要的id
      * getUrl:获取实体对象时的请求地址
      * rules:rules规则 定义验证规则
      * messages 提示 定义验证时展示的提示信息
      * beforeSubmitCallback 提交表单数据之前的回调，带一个参数modeFlag表示当前是新增(0)还是编辑数据(1)
      * closeFlag:成功提交并返回之后是否关闭当前编辑窗口  默认为true  可选false
      * ajaxCallbackFun: ajax提交中的回调函数  如传入null,则使用默认
      * renderCallback:function(obj){}  如果默认的渲染结果不是完整或者正确的,可以传入该回调重新或者附加渲染  obj=通过get方法获取的对应实体对象
      * 
      * 
      * templateParams参数：
      * tableTheads:必须的  传入字符串数组,渲染成指定的表头  
      * btnTools:表格上方的工具栏 带文字和图标样式按钮
	  * formControls: edit页面的表单控件渲染,参见下面的数据格式  
	  *		   [{
				edit:flase,
				required:false,
				label:"",   	//如果没有label 该控件为隐藏input 同时需要填写下面的name 可选value
				name:"",
				objText:"",
				input:[{	
					flag:flase,
					hidden:false,
					value:"",
					placeholder:"",
					name:""	
					}],
				textarea:[{
					flag:false,
					placeholder:"",
					value:"",
					name:""	
					}],
				select:[{
					flag:false,
					name:""	,
					option:[{
						value:"",
						text:"",
						selected:""  //可选"selected"
						}]
					}],
				button:[{
					flag:false,
					style:"",
					markClass:"",
					value:""		
					}]	
			}]
      * 
      */
     renderParams:{
    	 renderType:"list",
    	 userDefaultRender:true,    
    	 userDefaultTemplate:true,
    	 customCallBack:function(p) {},
    	 templateCallBack:function(df) {
    		 df.resolve();
    	 },
    	 eventList:{},
    	 ifFirst: true,
    	 listPage:{
    		 listUrl:"",
    		 beforeInit:function(df) {
        		 df.resolve();
        	 },
        	 dtAjaxCallback:function() {},      	 
        	 tableObj:null,
        	 columnsSetting:{},
        	 columnsJson:[],
        	 dtOtherSetting:{},
        	 dt:null,
        	 exportExcel:true
    	 },
    	 editPage:{
    		 beforeInit:function(df) {
        		 df.resolve();
        	 },
        	 ifUseValidate:true,
    		 modeFlag:0,
    		 objId:null,
    		 editUrl:"",
    		 saveUrl:"",
        	 formObj:".form-horizontal",
        	 getUrl:"",
        	 rules:{},
        	 messages:{},
        	 beforeSubmitCallback:function(modeFlag) {},
        	 closeFlag:true,
        	 ajaxCallbackFun:null,
        	 renderCallback:function(obj) {} 
    	 },  
    	 templateParams:{
    		 tableTheads:[],
    		 btnTools:[],
    		 formControls:[]
    	 }
     },
     /**
      * 在进行数据渲染之前先进行静态的模板渲染
      * @param callback
      */
     renderTemplate:function (df, callback) {    	 
    	 if(this.renderParams.userDefaultTemplate) {
    		 //renderShadeIndex = layer.msg('正在努力加载中...', {icon:16, time:99999, shade:0.4});
    		 $(".page-container").spinModal();
    		 var t = this.renderParams.templateParams;
    		 editPageHeight = countEditPageHeight();
        	 var html = "";
        	//预编译handlebars模板
    		$("#template-page").load("../template/pageTemplate.htm", function() {    			
    			//registHelper();
    			
    			btnTextTemplate = Handlebars.compile($("#btn-text-template").html());
    			btnIconTemplate = Handlebars.compile($("#btn-icon-template").html());
    			
    			if ($("#table-thead")) {
    				tableTheadTemplate = Handlebars.compile($("#table-thead-template").html());
    				//渲染表头
    		    	$("#table-thead").append(tableTheadTemplate(t.tableTheads));
    			}
    			
    			if ($("#btn-tools")) {
    				//渲染表格上方工具栏
    		    	 $("#btn-tools").append(btnTextTemplate(t.btnTools));
    			}
    			
    			if ($("#edit-page")) {
    				 formControlTemplate = Handlebars.compile($("#form-control-template").html());       			
	       	    	 //渲染editPage的表单控件
	       	    	 editHtml = formControlTemplate(t.formControls);
    			}
    			
    	    	 //传入回调进行二次的渲染如果对editPage做过自定义的渲染  那么必须重新定义全局变量 editHtml	    	
    	    	 callback(df);
    		}); 
    	 } else {
    		 callback(df);
    	 }   	 
     },
     /**
      * 内部所用的函数-渲染数据 不同的页面的渲染模式  通用为list(列表页) edit(编辑增加页) 其他类型自己扩展
      * @param callback  
      */
     renderData : function (callback) { 
    	 var p = this.renderParams;
    	 //默认渲染
    	 if (p.userDefaultRender == true) {
    		 if (p.renderType == "list") {
    			 var l = p.listPage;
    			 table = initDT(l.tableObj, l.listUrl, l.columnsSetting, l.columnsJson, l.dtOtherSetting); 
    			 if (l.exportExcel) {
    				 new $.fn.dataTable.Buttons( table, {
    	    			    buttons: [
    	    			              { extend: 'excelHtml5', className: 'btn btn-primary radius', text:'导出到Excel', title:(new Date()).Format("yyyy-MM-dd-hhmmssS")}
    	    			    ]
    	    			} );  
    	    		 table.buttons().container().appendTo( $('.cl', table.table().container() ) ); 
    			 }
    			 
    		 }       		 
    		 if (p.renderType == "edit") {
    			 var e = p.editPage;
    			 var sUrl = e.editUrl;
    			 if (e.modeFlag == 1) {
    				 ObjectEditPage(e.objId, e.getUrl, e.renderCallback);
    			 } else {
    				 (e.saveUrl != null && e.saveUrl != "") && (sUrl = e.saveUrl);
    			 }    			 
    			 e.ifUseValidate && formValidate(e.formObj, e.rules, e.messages, sUrl, e.closeFlag, e.ajaxCallbackFun, e.beforeSubmitCallback);
    		 }    		 
    	 } 
    	callback(p); 
     },
     /**
      * 统一绑定监听器
      * @param eventList  事件列表 jsonObject
      * 没有传入{}
      * 格式: 
      * '.btn' : function(){}  点击事件
      * '.checkbox' : {'change' : function(){}}  其他事件  请参照jquery的event
      */
     initListeners : function (eventList) {
         $(document.body).delegates(eventList);
         this.renderParams.ifFirst = false;
         this.renderParams.renderType = "edit";
     }
};



/**
 * 自定义扩展的jquery方法
 * 已配置的方式代理事件
 */
$.fn.delegates = function(configs) {
     el = $(this[0]);
     for (var name in configs) {
          var value = configs[name];
          if (typeof value == 'function') {
               var obj = {};
               obj.click = value;
               value = obj;
          };
          for (var type in value) {
               el.delegate(name, type, value[type]);
          }
     }
     return this;
};


/**
 * 
 * @param tableObj 对应表格dom的jquery对象
 * @param ajaxUrl  ajax请求数据的地址  string
 * @param columnsSetting columns设置  jsonArray
 * @param columnsJson  不参与排序的列 jsonArray
 * @returns table 返回对应的DataTable实例
 */
function initDT (tableObj, ajaxUrl, columnsSetting, columnsJson, dtOtherSetting) {
	var data = [];
	var table = $(tableObj)
	/*//发送ajax请求时
	.on('perXhr.dt', function() {
		
	})*/
	//ajax完成时
	.on('xhr.dt', function ( e, settings, json, xhr ) {
        if(json.returnCode != 0){
        	layer.alert(json.msg, {icon:5});
        	return false;
        }
        data = json.data;
        
    })
   /* //重绘完毕
    .on('draw.dt', function () { //初始化和刷新都会触发
    	publish.renderParams.listPage.dtAjaxCallback();
    })*/
    //初始化完毕
    .on( 'init.dt', function () {  //刷新表格不会触发此事件  只存在一次
    	//添加动态拖拽改变列宽的插件
    	$('.table').colResizable({
    		partialRefresh:true,
    		minWidth:35,
    		liveDrag:true,
    		disabledColumns:[0]
    	});
    	$(".page-container").spinModal(false); 	    	
    })
	.DataTable($.extend(true, {}, CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
		"ajax":ajaxUrl,
        "columns":columnsSetting,                                           
        "columnDefs": [{"orderable":false, "aTargets":columnsJson}]
        }, dtOtherSetting));
	
	return table;
}


/**
 * 返回DT中checkbox的html
 * @param name  name属性,对象的name或者其他
 * @param val   value属性,对象的id
 * @param className  class属性,一般为select+对象名称
 */
function checkboxHmtl(name,val,className) {
	return '<input type="checkbox" name="'+name+'" value="'+val+'" class="'+className+'">';
}


/**
 * 单个删除功能，通用
 * tip 确认提示
 * url 删除请求地址
 * id 删除的实体ID
 * obj 表格删除对应的内容
 */
function delObj(tip, url, id, obj) {
	layer.confirm(tip, {icon:0, title:'警告'}, function(index) {
		$(".table").spinModal();
		$.post(url,{id:id},function(data) {
    		if (data.returnCode == 0) {
    			$(".table").spinModal(false);
    			table.row($(obj).parents('tr')).remove().draw();
                layer.msg('已删除',{icon:1,time:1500});
    		} else {
    			$(".table").spinModal(false);
    			layer.alert(data.msg, {icon: 5});
    		}
    	});
	});
}

/**
 * 按照设定显示浮动选择条
 * @param data 展示的数据 数组
 * @param idName option的value取值字段名
 * @param titleNames option的text取值字段名 传入数组的话将会用'-'号连接起多个字段值
 * @param chooseCallback 选择之后的回调，带三个参数：id - id值，obj - 选择的对应实体 ， index - 打开的layer窗体index
 */
function showSelectBox (data, idName, titleNames, chooseCallback) {
	if (data.length < 1) {
		layer.msg('无可用数据!', {icon:0, time:2000});
		return;
	}
	var show_html = '<div class="row cl" style="width:340px;margin:15px;">'		 
		+ '<div class="formControls col-xs-10"><span class="select-box radius mt-0">'
		+ '<select class="select" size="1" name="select-object" id="select-object">';	
	if (!(titleNames instanceof Array)) {
		titleNames = [titleNames];
	}
	var count = titleNames.length;
	$.each(data, function(i, n) {
		show_html += '<option value="' + n[idName] + '" data-id="' + i + '">';
		$.each(titleNames, function(i1, n1) {
			show_html += n[n1];
			if (count > i1 + 1) {
				show_html += "-";
			}
		});		
		show_html += '</option>';
	});
	show_html += '</select></span></div><div class="form-label col-xs-2">'
		+ '<input type="button" class="btn btn-primary radius" onclick="" id="show-select-box-choose" value="选择"/></div></div>';
	
	var index = layer_show("请选择", show_html, '400', '120', 1, function() {
		$(document).delegate("#show-select-box-choose", 'click', function() {
			var data_id = $('#select-object option:selected').attr('data-id');
			chooseCallback($('#select-object').val(), data[data_id], index);
		});
	})
}

/**
 * 批量方法-表格为DT时
 * @param checkboxList  checkBox被选中的列表
 * @param url   url 远程接口
 * @param tableObj   TD对象，默认名为table
 * @param opName 操作方式名称 默认为 删除
 * @param idName 对应实体的ID名称
 * @param otherSendData 其他要随着ID发送的参数
 * @returns {Boolean}
 */
function batchOp (checkboxList, url, opName, tableObj, idName, otherSendData, callback) {
	if (checkboxList.length < 1) {
		return false;
	}
	
	if (opName == null) {
		opName = "删除";
	}
	layer.confirm('确认' + opName + '选中的' + checkboxList.length + '条记录?', {icon:0, title:'警告'}, function(index) {
		layer.close(index);
		var loadindex = layer.msg('正在进行批量' + opName + "...", {icon:16, time:60000, shade:0.35});
		var delCount = 0;
		var totalCount = 0;
		var errorTip = "";
		$.each(checkboxList ,function(i, n) {
			var objId = $(n).val();//获取id
			var objName = $(n).attr("name");	//name属性为对象的名称	
			var params = {id: objId};
			if (strIsNotEmpty(idName) && idName != "id") {
				params[idName] = objId;
			}
			if (otherSendData != null && otherSendData instanceof Object) {
				$.each(otherSendData, function(i, n) {
					params[i] = n;
				});
			}
			
			//layer.msg("正在" + opName + objName + "...", {time: 999999});    
				$.ajax({
					type:"post",
					url:url,
					data:params,
					//async:false,
					success:function(data) {
						totalCount++;
						if(data.returnCode != 0) {	
							errorTip += "[" + objName + "]";
						}else{
							delCount++;
						}
					}
					});			
		});
		
		var intervalID = setInterval(function() {
			if (totalCount == checkboxList.length) {
				clearInterval(intervalID);
				if (callback != null) {
					callback();
				}
				refreshTable(null, function(json) {
					layer.close(loadindex);
					if (errorTip != "") {
						errorTip = "在" + opName + errorTip + "时发生了错误<br>请执行单笔" + opName + "操作!";
						layer.alert(errorTip, {icon:5}, function(index) {
							layer.close(index);							
							layer.msg("共" + opName + delCount + "条数据!", {icon:1, time:2000});
						});
					} else {
						layer.msg("共" + opName + delCount + "条数据!", {icon:1, time:2000});
					}
				});	
			}
		}, 500);				
	});
}

/**
 * 批量删除
 * @param checkboxList
 * @param url
 * @param tableObj
 * @param opName
 */
function batchDelObjs(checkboxList, url, tableObj, opName, callback) {
	batchOp(checkboxList, url, opName, tableObj, null, null, callback);	
}

/**
 * 编辑页面 当modeflag为1(编辑)时 默认的页面渲染
 * @param id  指定实体的id
 * @param ajaxUrl  ajax地址
 * @param callback(function(obj){}) 如果默认的渲染结果不是完整或者正确的,可以传入该回调重新渲染  obj 实体对象
 */
function ObjectEditPage(id, ajaxUrl, callback) {
	$(".form-horizontal").spinModal();
	//编辑模式时将某些隐藏的控件展示
	$(".editFlag").css("display","block");
	$.post(ajaxUrl, {id:id}, function(data) {
		if (data.returnCode == 0) {
			var o = data.object;
			//默认的渲染  object中同名id 控件 以及id名为 idText
			iterObj(o);		
			//该回调可以自行渲染默认没有渲染完整的控件
			callback(o);	
			$(".form-horizontal").spinModal(false);
		} else {
			layer.alert(data.msg, {icon:5});
		}
	});
	
	
}

/**
 * 迭代循环遍历json对象中属性
 * @param jsonObj
 * @param parentName 
 */
function iterObj(jsonObj, parentName) {
	$.each(jsonObj, function(k, v) {
		if (parentName != null&&parentName != "") {
			k = parentName + "\\." + k;
		}
		if (!(v instanceof Object)) {	
			if ($("#" + k)) {
				$("#" + k).val(v);
			}
			if ($("#" + k + "Text")) {
				$("#" + k + "Text").text(v);
			}
		} else {
			iterObj(v, k);
		}
	});	
}



/**
 * 所有实体edit页面的jqueryValidate方法
 * @param formObj  表单obj
 * @param rules   rules规则 定义验证规则
 * @param messages 提示 定义验证时展示的提示信息
 * @param ajaxUrl  验证成功 ajax提交地址
 * @param closeFlag  成功提交并返回之后是否关闭当前窗口  true  false
 * @param ajaxCallbackFun  ajax提交中的回调函数  如传入null,则使用默认
 */
function formValidate(formObj, rules, messages, ajaxUrl, closeFlag, ajaxCallbackFun, beforeSubmitCallback) {
	var callbackFun = function(data) {
		if (data.returnCode == 0) {	
			refreshTable();
			if (closeFlag) {
				//关闭当前的所有页面层
				layer.closeAll('page');
			}					
		} else {
			layer.alert(data.msg, {icon: 5});
		}			
	};
	if (ajaxCallbackFun != null) {
		callbackFun = ajaxCallbackFun;
	}
	$(formObj).validate({
		rules:rules,
		messages:messages,
		ignore: "",
		onkeyup:false,
		focusCleanup:true,
		success:"valid",
		submitHandler:function(form) {
			if (beforeSubmitCallback != null) {
				beforeSubmitCallback(publish.renderParams.editPage.modeFlag);
			}
			var formData = $(form).serialize();
			$.post(ajaxUrl, formData, callbackFun);			
		}
	});
}

/**
 * 刷新表格
 * 所有表格页面都是的DT对象名称都要命名为table
 * @param ajaxUrl2 传入指定的ajax数据地址,刷新将会使用这个地址获取表格数据
 * @param callback 刷新完表格后的回调函数
 * @param tableObject 当前页面的DT对象
 * @param resetPaging 是否重置分页信息 false不重置  true 重置
 */
function refreshTable(ajaxUrl2, callback, tableObject, resetPaging){
	$(".table").spinModal();
	
	if (tableObject == null && table == null) {
		$(".table").spinModal(false);
		return false;
	}
	
	if (tableObject == null) {
		tableObject = table;
	}
	
	if (callback == null) {
		callback = function(){};
	}
	
	if (resetPaging == null) {
		resetPaging = false;
	}
	
	
	if (ajaxUrl2 != null) {
		tableObject.ajax.url(ajaxUrl2).load(function(json) {
			publish.renderParams.listPage.dtAjaxCallback();
			callback(json);
			$(".table").spinModal(false);
		}, resetPaging);
	} else {
		tableObject.ajax.reload(function(json) {
			publish.renderParams.listPage.dtAjaxCallback();
			callback(json);
			$(".table").spinModal(false);
		}, resetPaging);
	}
}

/**
 * 获取json长度
 * @param jsonData
 * @returns {Number}
 */
function getJsonLength(jsonData) {
	var jsonLength = 0;
	for(var item in jsonData){
		jsonLength ++;
	}
	return jsonLength;
}

/**
 * 注册需要的handlerbars的helper
 */
function registHelper() {	
	//比对用的helper
	//使用{{#compare people.name '==' 'peter'}} {{else}} {{/compare}}
	Handlebars.registerHelper('compare', function(left, operator, right, options) {
		if (arguments.length < 3) {
			throw new Error('Handlerbars Helper "compare" needs 2 parameters');
		}
		var operators = {
			'==': function(l, r) {return l == r; },
			'===': function(l, r) {return l === r; },
			'!=': function(l, r) {return l != r; },
			'!==': function(l, r) {return l !== r; },
			'&lt;': function(l, r) {return l < r; },
			'&gt;': function(l, r) {return l > r; },
			'&lt;=': function(l, r) {return l <= r; },
			'&gt;=': function(l, r) {return l >= r; },
			'typeof': function(l, r) {return typeof l == r; }
		};
		if (!operators[operator]) {
			throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
		}
		var result = operators[operator](left, right);
		if (result) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}});
}

/**
 * 生成标签模板
 * 
 * @param option   
 * {
	"0":{
		btnStyle:"success",
		status:"正常"
		},
	"1":{
		btnStyle:"default",
		status:"失败"
		},
	"default":{
		btnStyle:"danger",
		status:"未知"
		}
	}
 以上是默认的配置,你也可以传入自定义的配置
 * @param data   ["1","0"] 数组或者 字符串 number都可以
 * @returns {String}
 */
function labelCreate(data, option){
	var html = '';
	var datas = [];
	if (!(data instanceof Array)) {
		datas.push(data);
	} else {
		datas = data;
	}
	
	if (option == null) {
		option = {
				"default":{
					btnStyle:"primary",
					status:datas[0]
				}};
	}
	
	$.each(datas, function(i, n) {
        if (option && option[n]) {
            html += '<span class="label label-'+option[n]["btnStyle"]+' radius">'+option[n]["status"]+'</span>';
        } else {
            if (n == "0") {
            	html += '<span class="label label-success radius">正常</span>';
            }
            if (n == "1") {
            	html += '<span class="label label-danger radius">禁用</span>';
            } 
            
            if (n != "0" && n != "1") {
            	html += '<span class="label label-' + option["default"]["btnStyle"] + ' radius">' + option["default"]["status"] + '</span>';
            }                       
        }
        if (datas.length > (i+1) ) {
        	html += "&nbsp;";
        }
    });
	return html;
}

/**
 * 获取远程地址的html文件
 */
function jqueryLoad(url, dom, callback) {
	if (typeof dom != 'object') {
		dom = $(dom);
	}
	dom.load(url, function() {
		var domHmtl = dom.html();
		dom.html('');
		callback(domHmtl);		
	});	
}

/**
 * 获取地址栏参数
 * @param name
 * @returns
 */
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return decodeURIComponent(r[2]); return null;
}

/**
 * DataTable辅助，省略列内容
 * @param dataName
 * @returns {___anonymous19689_19800}
 */
function ellipsisData(dataName) {
	return {
  		"className":"ellipsis",
	    "data":dataName,
	    "render":CONSTANT.DATA_TABLES.COLUMNFUN.ELLIPSIS
	};
}

/**
 * 原生js动态加载脚本或者css
 * @param scriptPath 脚本css路径
 * @param type  默认为javascript 可选css
 */
function dynamicLoadScript (scriptPath, type) {
	var new_element;
	if (type == null || type == "javascript") {
		//加载对应的js文件	
		new_element = document.createElement("script");
		new_element.setAttribute("type", "text/javascript");	
		new_element.setAttribute("src", scriptPath);
		document.body.appendChild(new_element);
	} 
	
	if (type == "css") {
		//加载对应的css文件
		new_element = document.createElement("link");
		new_element.setAttribute("rel", "stylesheet");
		new_element.setAttribute("type", "text/css");
		new_element.setAttribute("href", scriptPath);
		document.head.appendChild(new_element);
	}
	
}


/**
 * layer弹出层
 * 参数解释
 * @param title 标题
 * @param url  url地址或者html页面
 * @param w 宽度,默认值
 * @param h 高度,默认值
 * @param type 类型 1-页面层 2-frame层
 * @param success 成功打开之后的回调函数
 * @param cancel 右上角关闭层的回调函数
 * @param end 层销毁之后的回调
 * @param other 其他DT设置
 * @returns index
 */
function layer_show (title, url, w, h, type, success, cancel, end, other) {
	
	if (other == null) {
		other = {};
	}
	
	if (title == null || title == '') {
		title = false;
	};
	if (url == null || url == '') {
		url="../../404.html";
	};
	if (w == null || w == '' || w >= maxWidth) {
		w =	maxWidth * 0.8
	};
	if (h == null || h == '' || h >= maxHeight) {
		h= (maxHeight * 0.86) ;
	};
	if (type == null || type == '') {
		type = 2;
	}
	index = layer.open($.extend(true, {
		type: type,
		area: [w+'px', h +'px'],
		fix: false, //不固定
		maxmin: false,
		shade:0.4,
		anim:5,
		title: title,
		content: url,
		success:success,
		cancel:cancel,
		end:end
	} ,other));
	return index;
}


/**
 * 显示备注或者其他
 * @param itemName
 * @param markName
 * @param obj
 * @param tipName 窗口上提示
 */
function showMark(itemName, markName, obj, tipName) {
	var data = table.row( $(obj).parents('tr') ).data();
	if (tipName == null) {
		tipName = "备注";
	}
	layer.prompt({
		formType: 2,
		maxlength:65535,
		anim:5,
		shadeClose:true,
		value: data[markName],
		title: itemName + '-' + tipName,
		area: ['500px', '300px']}, 
		function(value, index, elem){
			layer.close(index);
		});
}


/**
 * 关联验证
 * 取值顺序页面按键  减一
 */
function reduceSeq() {
	var seq=$("#objectSeqText").text();
	if(seq==1){
		return;
	}
	$("#objectSeqText").text(seq-1);
	$("#ORDER").val(seq-1);
}

/**
 * 关联验证
 * 取值顺序页面按键  加一
 */
function addSeq() {
	var seq=$("#objectSeqText").text();
	$("#objectSeqText").text(parseInt(seq)+1);
	$("#ORDER").val(parseInt(seq)+1);
}

//对Date的扩展，将 Date 转化为指定格式的String   
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
//例子：   
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
//author: meizz
Date.prototype.Format = function(fmt)   
{    
	var o = {   
	 "M+" : this.getMonth()+1,                 //月份   
	 "d+" : this.getDate(),                    //日   
	 "h+" : this.getHours(),                   //小时   
	 "m+" : this.getMinutes(),                 //分   
	 "s+" : this.getSeconds(),                 //秒   
	 "q+" : Math.floor((this.getMonth()+3)/3), //季度   
	 "S"  : this.getMilliseconds()             //毫秒   
	};   
	if(/(y+)/.test(fmt))   
	 fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	for(var k in o)   
	 if(new RegExp("("+ k +")").test(fmt))   
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	return fmt;   
} 


String.prototype.replaceAll = function(s1,s2){
	　　return this.replace(new RegExp(s1,"gm"),s2);
}

/**
 * 上传excel导入数据的说明页面
 * @param title 窗口标题
 * @param templatePath 模板文件路径
 * @param uploadUrl 上传接口
 * @param importUrl 导入接口
 */
function createImportExcelMark(title, templatePath, uploadUrl, importUrl) {
	var html = '<div style="margin:18px;" id="show-import-from-excel-content"><p>请在导入之前下载Excel模板，并在模板第二页阅读相关字段说明.</p><p><a class="btn radius btn-primary size-M" '
		+ 'href="' + templatePath + '"><i class="Hui-iconfont">&#xe640;</i> 下载Excel模板'
		+ '</a></p><p><span class="label label-warning radius">注意：</span>请务必按照模板样式进行排版填写,导入完成之后根据提示检查失败的数据的有效性。<span class="c-red">名称(一般为第一列)为空的将不会添加到数据库。</span></p>'
		+ '<br><p>请点击&nbsp;<a href="javascript:;" class="btn btn-success radius size-S " id="upload-data-excel"><i class="Hui-iconfont ">&#xe642;</i> 导入Excel</a>&nbsp;开始上传文档</p></div>';
	layer_show(title, html, "710", "270", 1, function() {
		//excel上传数据
		var loadIndex;
		layui.use('upload', function(){
			  var upload = layui.upload;				   
			  //执行实例
			  var uploadInst = upload.render({
			    elem: '#upload-data-excel' //绑定元素
			    ,url: uploadUrl //上传接口
			    ,accept:"file"
			    ,exts:"xlsx|xls"
			    ,size:"102400"
			    ,drag:false
			    ,before:function(obj) {
			    	loadIndex = layer.msg('正在上传文件中...', {icon:16, time:99999, shade:0.4});
			    }
			    ,done: function(res){
			      //上传完毕回调
			    	if (res.returnCode == 0) {//上传成功
			    		 layer.close(loadIndex);
			    		 loadIndex = layer.msg('正在导入数据...', {icon:16, time:99999, shade:0.4});
			    		 $.post(importUrl, {path:res.path}, function(json) {
			    				if (json.returnCode == 0) {
			    					$("#show-import-from-excel-content").html("");
			    					var showResultHtml = '<p><span class="label label-primary radius">导入总数 :</span>&nbsp;&nbsp;' + json.result.totalCount + '</p>'
			    						+ '<p><span class="label label-success radius">导入成功数 :</span>&nbsp;&nbsp;' + json.result.successCount + '</p>'
			    						+ '<p><span class="label label-danger radius">导入失败数:</span>&nbsp;&nbsp;' + json.result.failCount + '</p>'
			    						+ '<p><span class="label label-secondary radius">导入详情信息:</span><br>' + json.result.msg + '</p>';
			    					$("#show-import-from-excel-content").html(showResultHtml);
			    					layer.close(loadIndex);
			    					refreshTable();
			    				} else {
			    					layer.alert(json.msg, {icon:5});
			    				}
			    			});
			    	} else {
			    		layer.close(loadIndex);
			    		layer.alert(res.msg, {icon:5});
			    	}
			    }
			  });
			});
	});
}

/**
 * 判断字符串是否为空 为null undefined 或者 只有空字符/制表符等均为空
 * @param str
 * @returns {Boolean}
 */
function strIsNotEmpty (str) {
	if (str == null || str == undefined || str.replace(/(^s*)|(s*$)/g, "").length ==0) {
		return false;
	}
	return true;
}

/**
 * 计算 编辑页面的弹出层高度
 */
function countEditPageHeight () {
	var returnHeight = {add:null, edit:null};
	if (!$.isEmptyObject(publish.renderParams.templateParams.formControls)) {			
		//添加页面的高度
		var addPageHeight = 140;
		//编辑页面的高度
		var editPageHeight = 140;
		$.each(publish.renderParams.templateParams.formControls, function (i, n) {
			if (strIsNotEmpty(n.label)) {
				editPageHeight = editPageHeight + (n.textarea ? 116 : 45);
				if (!(n.edit)) {
					addPageHeight = addPageHeight + (n.textarea ? 116 : 45);
				}
				
			}
		});
		if (addPageHeight >= maxHeight) {
			addPageHeight = null;
		}
		if (editPageHeight >= maxHeight) {
			editPageHeight = null;
		}
		returnHeight.add = addPageHeight;
		returnHeight.edit = editPageHeight;
	}
	return returnHeight;
}