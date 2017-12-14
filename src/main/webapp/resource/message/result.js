//遮罩层覆盖区域
var $wrapper = $('#div-table-container');

var currIndex;//当前正在操作的layer窗口的index
var resultTemplate;

var reportId;
var runStatus = "all";

var templateParams = {
		tableTheads:["接口", "结果", "状态码", "耗时ms", "详情"]			
};

var columnsSetting = [
					 {
					  	"data":null,
					  	"render":function(data, type, full, meta){                       
					          return checkboxHmtl(data.messageInfo, data.resultId, "selectResult");
					      }},
					  {"data":"resultId"},
					  {	
						  "data":"messageInfo",
						  "className":"ellipsis",
						  "render":function(data, type, full, meta){
						    	data = (data.split(","))[0];
						    	return  '<span title="' + data + '">' + data + '</span>';
						    },
						    "createdCell":function(td, cellData, rowData, row, col){
						    			var infoList = rowData.messageInfo.split(",");
						    			var data = "[报文名]-" + infoList[1] + "<br>[场景名]-" + infoList[2];
										var index;
								        $(td).mouseover(function(){
								        	index=layer.tips(data, td, {
					  		  					tips: [1, '#3595CC']
								        		});				        
								        });
								        $(td).mouseout(function(){
								        	layer.close(index);
								        });
													    						    					    	
						    }
						  
					  },
					  {
						  "data":"runStatus",
						  "render":function(data) {
							  var option = {
                  		  			"0":{
                  		  				btnStyle:"success",
                  		  				status:"SUCCESS"
                  		  				},
              		  				"1":{
              		  					btnStyle:"danger",
              		  					status:"FAIL"
              		  					},
              		  				"2":{
	              		  				btnStyle:"disabled",
	          		  					status:"STOP"
              		  					}
                  		  		};	
                  		  	return labelCreate(data, option);
						  }
					  
					  },
					  {"data":"statusCode"},
					  {"data":"useTime"},
					  {
						  "data":null,
						  "render":function(data) {
							  var context = [{
	                	    		title:"详情查看",
	                	    		markClass:"show-result-detail",
	                	    		iconFont:"&#xe685;"
	                	    	}];                           
	                          	return btnIconTemplate(context);
						  }
					  }
];


var eventList = {
	'.show-result-detail':function() {
		var data = table.row( $(this).parents('tr') ).data();
		var color = "";
		var flag = "";
		if (data.runStatus == "0") {
			color = "green";
			flag = "SUCCESS";
		} else if (data.runStatus == "1"){
			color = "red";
			flag = "FAIL";
		} else {
			color = "red";
			flag = "STOP";
		}				
		var resultData = {
			color:color,
			flag:flag,
			useTime:data.useTime,
			statusCode:data.statusCode,
			requestMessage:data.requestMessage,
			responseMessage:(data.responseMessage != "null") ? data.responseMessage : "",
			mark:data.mark
		};			
		
		layer_show('测试结果', resultTemplate(resultData), null, null, 1, null, null, null, {
			shade: 0.35,
			shadeClose:true,
			skin: 'layui-layer-rim', //加上边框
		})
	}			
};

var mySetting = {
		eventList:eventList,
		templateCallBack:function(df){
			reportId = GetQueryString("reportId");
			runStatus = GetQueryString("runStatus");
			
			publish.renderParams.listPage.listUrl = RESULT_LIST_URL + "?reportId=" + reportId + "&runStatus=" + runStatus;
			
			resultTemplate =  Handlebars.compile($("#scene-test-result").html());
			df.resolve();			   		 	
   	 	},
		listPage:{
			tableObj:".table-sort",
			columnsSetting:columnsSetting,
			columnsJson:[0, 6],
			dtOtherSetting:{
				"bStateSave": false,//状态保存			
			},
			exportExcel:false
		},
		templateParams:templateParams		
	};


$(function(){
	publish.renderParams = $.extend(true,publish.renderParams,mySetting);
	publish.init();
});