var table;
//遮罩层覆盖区域
var $wrapper = $('#div-table-container');



var templateParams = {
		tableTheads:["接口名称","调用地址","所属节点","当前状态","备注"],
		btnTools:[{
			type:"primary",
			markClass:"show-msg-ops",
			iconFont:"&#xe636;",
			name:"接口自动化"
		},{
			type:"default",
			markClass:"show-web-ops",
			iconFont:"&#xe6d2;",
			name:"WEB自动化"
		},{
			type:"default",
			markClass:"show-app-ops",
			iconFont:"&#xe6a2;",
			name:"APP自动化"
		},{
			type:"default",
			markClass:"show-sys-ops",
			iconFont:"&#xe62e;",
			name:"系统管理"
		},{
			type:"default",
			markClass:"show-user-ops",
			iconFont:"&#xe62c;",
			name:"用户权限管理"
		}]			
	};

var columnsSetting = [
    {
    	"data":null,
    	"render":function(data, type, full, meta){
		  		return checkboxHmtl(data.opName,data.opId,"selectOp");
	           }},
	{"data":"opId"},{"data":"opName"},                                 
	{
	   "data":"callName",
	   "render":function(data, type, full, meta ){
		   return '<a href="' + data + '" target="_blank">' + data + '</a>';	   
		   }
	},{"data":"parentOpName"},
	{
		"data":"status",
	    "render":function(data, type, full, meta){
            return labelCreate(data);	    	
	    }
	},{
	    "data":"mark",
	    "className":"ellipsis",
	    "render":function(data, type, full, meta) { 
	    	if (data != "" && data != null) {
		    	return '<a href="javascript:;" onclick="showMark(\'' + full.opName + '\', \'mark\', this);"><span title="' + data + '">' + data + '</span></a>';
	    	}
	    	return "";
	    }
      }
];

var eventList = {
		".l > a":function(){
			var opType = 1;
			
			if($(this).hasClass("show-msg-ops") ){
				opType=1;
			}
			
			if($(this).hasClass("show-web-ops")){
				opType=2;
			}
			
			if($(this).hasClass("show-app-ops")){
				opType=3;
			}
			
			if($(this).hasClass("show-sys-ops")){
				opType=4;
			}
			
			if($(this).hasClass("show-user-ops")){
				opType=5;
			}
			
			table.ajax.url(OP_INTERFACE_LIST_URL + '?opType=' + opType).load();
			$(this).addClass("btn-primary").siblings("a").removeClass("btn-primary").addClass("btn-default");
		}
};

var mySetting = {
		eventList:eventList,
		listPage:{
			listUrl:OP_INTERFACE_LIST_URL + "?opType=1",
			tableObj:".table-sort",
			columnsSetting:columnsSetting,
			columnsJson:[0]
		},
		templateParams:templateParams		
	};

$(function(){
	CONSTANT.DATA_TABLES.DEFAULT_OPTION.serverSide=false;
	publish.renderParams = $.extend(true,publish.renderParams,mySetting);
	publish.init();
});

