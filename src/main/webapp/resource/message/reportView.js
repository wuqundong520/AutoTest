var resultData;
var reportId;

var currentIndex;

var eventList = {
	'tbody > tr':function() {
		var id = $(this).attr("id");       
        $(this).addClass('info').siblings('tr').removeClass('info');
        
        layer.open({
            type: 1,
            area: ['760px', '700px'],
            maxmin: false,
            fixed:false,
            //isOutAnim:false,
            //anim:-1,
            shade:0.4,
            title: resultData[id].messageInfo,
            shadeClose:true,
            content: $("#view-html").html(),
            success:function(layero) {            	
            	$(".layui-layer-content > .view-details > .row:eq(0) .col-sm-9").text(resultData[id].requestUrl);
                $(".layui-layer-content > .view-details > .row:eq(1) .col-sm-9").text(resultData[id].statusCode);
                $(".layui-layer-content > .view-details > .row:eq(2) .col-sm-9 textarea").text(resultData[id].requestMessage);
                $(".layui-layer-content > .view-details > .row:eq(3) .col-sm-9 textarea").text((resultData[id].responseMessage != null) ? resultData[id].responseMessage : "");
                $(".layui-layer-content > .view-details > .row:eq(4) .col-sm-9 textarea").text((resultData[id].mark != null) ? resultData[id].mark : "");
            }
        });
	},
	'.select-view-mark':{
		'change':function() {
			renderReportView();
		}
	}
};

var mySetting = {
		eventList:eventList,
		userDefaultRender:false,    
   	 	userDefaultTemplate:false,
   	 	customCallBack:function(params){
   	 		 currentIndex = layer.msg('正在努力加载中...', {icon:16, time:99999, shade:0.7});
   	 		 
	   	 	//esc关闭所有弹出层
	       	 $(window).keydown (function(e) {
	       		 var keycode = event.which;
	       		 if(keycode == 27){
	       			 layer.closeAll('page');
	       			 e.preventDefault();
	       		 } 
	       	 });
   	 		
   	 		reportId = GetQueryString("reportId"); 
	   	 	$.get(REPORT_GET_DETAILS_URL + "?reportId=" + reportId, function(data){
				if (data.returnCode == 0) {
					
					$(".panel-heading").text(data.title);
			        $("#sceneNum").append(data.desc.sceneNum);
			        $("#successNum").append(data.desc.successNum);
			        $("#failNum").append(data.desc.failNum);
			        $("#stopNum").append(data.desc.stopNum);
			        $("#successRate").append(data.desc.successRate);
			        $("#testDate").append(data.desc.testDate);
			        			        
			        resultData = data.data;
			        
			        renderReportView();
			         
				} else {
					layer.alert(data.msg,{icon:5});
				}
			});
   	 	}
	};


$(function(){			
	publish.renderParams = $.extend(true,publish.renderParams,mySetting);
	publish.init();
});


function renderReportView() {
	
    var dataHtml = '';
    var publicStatus = $("#status-views").val();
    var publicProtocol = $("#protocol-views").val();
    $.each(resultData, function(i, report){
    	
    	if ((report.runStatus == publicStatus || publicStatus == "3")
    			&& (report.protocolType == publicProtocol || publicProtocol == "all")) {
    		var messageInfo = (report.messageInfo).split(",");        	
            dataHtml += '<tr id="' + i + '">'    
                    + '<td>' + messageInfo[0] + '</td>'
                    + '<td>' + report.protocolType + '</td>'
                    + '<td>' + messageInfo[1] + '</td>'
                    + '<td>' + messageInfo[2] + '</td>'
                    + '<td class="status"><span>' + report.runStatus + '</span></td>'
                    + '<td>' + report.useTime + '</td>'
                    + '</tr>';
    	}    	
     });
     $("tbody").html(dataHtml);
     
     var statusList = $(".status");
     var status;
     $.each(statusList, function(i, n){
    	 var $status = $(n).children('span');
         status = $status.text();
         if (status == "0") {
        	 $status.addClass('label label-success');
        	 $status.text("Success");
         }

         if (status == "1") {
        	 $status.addClass('label label-danger');
        	 $status.text("Fail");
         }

         if (status == "2") {
        	 $status.addClass('label label-default');
        	 $status.text("Stop");
         }
     });
     /*setTimeout(function() {
    	 layer.close(currIndex);
     }, 3000)*/
     layer.close(currentIndex);
}