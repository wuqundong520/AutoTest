//遮罩层覆盖区域
var $wrapper = $('#div-table-container');

var currIndex;//当前正在操作的layer窗口的index


var templateParams = {
		tableTheads:["测试集", "场景数", "成功数", "失败数", "异常数", "进度", "开始时间", "结束时间", "测试人" ,"备注", "操作"],
		btnTools:[{
			type:"primary",
			size:"M",
			id:"advanced-query",
			iconFont:"&#xe665;",
			name:"高级查询"
		},{
			type:"danger",
			size:"M",
			id:"batch-del-object",
			iconFont:"&#xe6e2;",
			name:"批量删除"
		}]	
	};


var columnsSetting = [
					{
					  	"data":null,
					  	"render":function(data, type, full, meta){                       
					          return checkboxHmtl(data.setName, data.reportId, "selectReport");
					      }},
					{"data":"reportId"},
					ellipsisData("setName"),
					{
						"data":"sceneNum",
						"render":function(data, type, full, meta){
                          	var context =
                          		[{
                        			type:"primary",
                        			size:"M",
                        			markClass:"show-result",
                        			name:data
                        		}];
                              return btnTextTemplate(context);
                              }
					},
					{
						"data":null,
						"render":function(data, type, full, meta){
                          	var context =
                          		[{
                        			type:"success",
                        			size:"M",
                        			markClass:"show-result",
                        			name:data.successNum
                        		}];
                              return btnTextTemplate(context);
                              }
					},
					{
						"data":null,
						"render":function(data, type, full, meta){
                          	var context =
                          		[{
                        			type:"warning",
                        			size:"M",
                        			markClass:"show-result",
                        			name:data.failNum
                        		}];
                              return btnTextTemplate(context);
                              }
					},
					{
						"data":null,
						"render":function(data, type, full, meta){
                          	var context =
                          		[{
                        			type:"danger",
                        			size:"M",
                        			markClass:"show-result",
                        			name:data.stopNum
                        		}];
                              return btnTextTemplate(context);
                              }
					},
					{
						"data":"finishFlag",
						"render":function(data) {
							var option = {
                		  			"Y":{
                		  				btnStyle:"success",
                		  				status:"已完成"
                		  				},
            		  				"N":{
            		  					btnStyle:"danger",
            		  					status:"未完成"
            		  					},
            		  				 	
                		  	};	
                		  	return labelCreate(data, option);
							
						}
							
					},
					ellipsisData("createTime"),
					ellipsisData("finishTime"),
					ellipsisData("createUserName"),
					ellipsisData("mark"),
					{
						"data":null,
                        "render":function(data, type, full, meta){
                          var context = [{
              	    		title:"查看报告",
              	    		markClass:"view-report",
              	    		iconFont:"&#xe695;"
              	    	},{
              	    		title:"离线报告",
              	    		markClass:"download-report",
              	    		iconFont:"&#xe640;"
              	    	},{
              	    		title:"删除报告",
              	    		markClass:"del-report",
              	    		iconFont:"&#xe6e2;"
              	    	}];                           
                        	return btnIconTemplate(context);
                        }
					}									
	];


var eventList = {
		'#advanced-query':function() {
			layer.msg('敬请期待!', {icon:1, time:1500});
		},
		'#batch-del-object':function() {
			var checkboxList = $(".selectReport:checked");
			batchDelObjs(checkboxList, REPORT_DEL_URL);
		},
		'.show-result':function() {
			var data = table.row( $(this).parents('tr') ).data();
			
			var statusName = "全部";
			var runStatus = "all";
			var count = data.sceneNum;
			
			if ($(this).hasClass("btn-success")) {
				statusName = "成功";
				runStatus = "0";
				count = data.successNum;
			}
			
			if ($(this).hasClass("btn-warning")) {
				statusName = "失败";
				runStatus = "1";
				count = data.failNum;
			}
			
			if ($(this).hasClass("btn-danger")) {
				statusName = "异常";
				runStatus = "2";
				count = data.stopNum;
			}
							
			openResults(data.reportId, runStatus, data.setName + " - " + statusName + "场景", count);
		},
		'.view-report':function() {
			var data = table.row( $(this).parents('tr') ).data();
			if (data.sceneNum < 1) {
	    		layer.alert("当前测试报告中没有任何测试详情结果", {icon:5});
	    		return false;
	    	}   	
	    	window.open("reportView.html?reportId=" + data.reportId);
		},
		'.del-report':function() {
			var data = table.row( $(this).parents('tr') ).data();
			delObj("确定删除此测试报告吗？", REPORT_DEL_URL, data.reportId, this);
		},
		'.download-report':function() { //下载离线报告
			var data = table.row( $(this).parents('tr') ).data();
			if (data.sceneNum < 1) {
	    		layer.alert("当前测试报告中没有任何测试详情结果", {icon:5});
	    		return false;
	    	} 
			$.post(REPORT_DOWNLOAD_STATIS_HTML, {reportId:data.reportId}, function(json) {
				if (json.returnCode == 0) {
					window.open(json.path)
				} else {
					layer.alert(json.msg,{icon:5});
				}
			});
		}
};

var mySetting = {
		eventList:eventList,
		listPage:{
			listUrl:REPORT_LIST_URL,
			tableObj:".table-sort",
			columnsSetting:columnsSetting,
			columnsJson:[0,4,5,6,12]			
		},
		templateParams:templateParams	
};

$(function(){
	publish.renderParams = $.extend(true,publish.renderParams,mySetting);
	publish.init();
});

/***************************************************************************/
function openResults(reportId, type, title, count) {
	if (count < 1) {
		return false;
	}
	layer_show(title, "result.html?reportId=" + reportId + "&runStatus=" + type, 1100, 620, 2);
}
