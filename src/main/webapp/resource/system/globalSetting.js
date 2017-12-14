var editInfo = {};
var beforeSettings = {};

var eventList = {
		".save-setting":function(){
			if(getJsonLength(editInfo) > 0){
				$.post(publish.renderParams.editPage.editUrl, editInfo, function(data) {
					if(data.returnCode == 0){	
						editInfo = {};
						layer.msg("修改成功!",{icon:1, time:1500});
					}else{
						layer.alert(data.msg,{icon:5});
					}
				});
			}
		}
};



var mySetting = {
		eventList:eventList,
		userDefaultRender:false,    
   	 	userDefaultTemplate:false,
   	 	customCallBack:function(params){
   	 		$.Huitab("#tab-system .tabBar span", "#tab-system .tabCon", "current","click", "0");
	   	 	$.post(params.editPage.getUrl,function(data){
				if(data.returnCode==0){
					var o=data.data;
					$.each(o,function(i,n){								
						if ($("#" + n.settingName)) {
							$("#" + n.settingName).val((strIsNotEmpty(n.settingValue) ? n.settingValue : n.defaultValue));
							beforeSettings[n.settingName] = n.settingValue;
						}						
					});
					$("input,select,textarea").change(function(){
						if (beforeSettings[$(this).attr("name")] == $(this).val()){
							delete editInfo[$(this).attr("name")];
						} else {
							editInfo[$(this).attr("name")] = $(this).val();
						}
						
					});
				}else{
					layer.alert(data.msg,{icon:5});
				}
			});
   	 	},
		editPage:{
			editUrl:GLOBAL_SETTING_EDIT_URL,
			getUrl:GLOBAL_SETTING_LIST_ALL_URL
		}	
	};


$(function(){			
	publish.renderParams = $.extend(true,publish.renderParams, mySetting);
	publish.init();
});