var table;
//遮罩层覆盖区域
var $wrapper = $('#div-table-container');

var MAIL_LIST_URL = "mail-list";
var MAIL_DEL_URL = "mail-del";
var MAIL_CHANGE_STATUS = "mail-changeStatus";

var templateParams = {
		tableTheads:["发送用户","内容","发送时间","状态","操作"],
		btnTools:[{
			type:"danger",
			size:"M",
			markClass:"batch-del-object",
			iconFont:"&#xe6e2;",
			name:"批量删除"
		}]			
	};


var columnsSetting = [
	  {
	  	"data":null,
	  	"render":function(data, type, full, meta){
	  			return checkboxHmtl(data.mailId, data.mailId, "selectMail");
	          }
	  },
	{"data":"mailId"},{"data":"sendUserName"},                                 
	{
	   "className":"ellipsis",
	   "data":"mailInfo",
	   "render":function(data){
		   return '<a href="javascript:;" class="show-mail-info"><span title="' + data + '">' + data + '</span></a>';	   
		   }
	},
	ellipsisData("sendTime"),
	{
		"data":"readStatus",
		"render":function(data) {
			var option = {
		  			"0":{
		  				btnStyle:"success",
		  				status:"已读"
		  				},
	  				"1":{
	  					btnStyle:"default",
	  					status:"未读"
	  					}
		  	};	
		  	return labelCreate(data, option);
		}
	},
	{
		"data":null,
	    "render":function(data){	    	
	    	var context = [
	    	   {
		    		title:"删除",
		    		markClass:"mail-del",
		    		iconFont:"&#xe6e2;"
	    	    }
	    	];	    		
	    	return btnIconTemplate(context);
	    }
	}];



var eventList = {
		".batch-del-object":function(){
			var checkboxList = $(".selectMail:checked");
			batchDelObjs(checkboxList, "mail-del");
		},
		".mail-del":function(){
			var data = table.row( $(this).parents('tr') ).data();
			delObj("确认要删除此条信息吗？", "mail-del", data.mailId, this);			
		},
		".show-mail-info":function() {
			var data = table.row( $(this).parents('tr') ).data();
			var html = '<div style="margin:14px;" class="content"><p>' + (data.mailInfo).replaceAll('(\\r)+(\\n)+', '<br>') + '</p></div>';
			layer_show("来自" + data.sendUserName + "信息  &nbsp;- &nbsp;"  + data.sendTime, html, '600', '460', 1
					, function() {
						if (data.readStatus == "1") {
							$.post(MAIL_CHANGE_STATUS, {mailId:data.mailId, statusName:"readStatus", status:"0"}, function(json) {
								if (json.returnCode == 0) {
									refreshTable();
								} else {
									layer.alert(data.msg, {icon:5});
								}
							});
						}						
					});
		}
};

var mySetting = {
		eventList:eventList,
		listPage:{
			listUrl:MAIL_LIST_URL,
			tableObj:".table-sort",
			columnsSetting:columnsSetting,
			columnsJson:[0, 3, 6]
		},
		templateParams:templateParams		
	};

$(function(){
	publish.renderParams = $.extend(true, publish.renderParams, mySetting);
	publish.init();
});