package com.dcits.coretest.task;

import java.util.Map;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;

import com.dcits.business.system.bean.AutoTask;
import com.dcits.business.user.service.UserService;
import com.dcits.constant.SystemConsts;
import com.dcits.coretest.message.test.MessageAutoTest;
import com.dcits.util.PracticalUtils;
import com.dcits.util.SettingUtil;

public class JobAction implements Job {
	
	@Autowired
	private MessageAutoTest messageAutoTest;
	@Autowired
	private UserService userSerivce;
	
	private Logger LOGGER = Logger.getLogger(JobAction.class);
	
	@SuppressWarnings("rawtypes")
	@Override
	public void execute(JobExecutionContext context) {
		// TODO Auto-generated method stub
		JobDataMap dataMap = context.getJobDetail().getJobDataMap();
		
		AutoTask task = (AutoTask)dataMap.get(SystemConsts.QUARTZ_TASK_NAME_PREFIX_KEY + context.getJobDetail().getKey().getGroup());
		
		String[] result = new String[2];
		//获取请求地址
		String testUrl = SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_HOME) + "/" + SystemConsts.AUTO_TASK_TEST_RMI_URL
				+ "?setId=" + task.getRelatedId() + "&autoTestFlag=true" + "&tooken=" + SystemConsts.REQUEST_ALLOW_TOOKEN;
		LOGGER.info("[自动化定时任务]执行自动化测试任务:url=" + testUrl);
		
		String returnJson = PracticalUtils.doGetHttpRequest(testUrl);
		
		LOGGER.info("[自动化定时任务]请求返回内容：" + returnJson);
		try {
			Map maps = new ObjectMapper().readValue(returnJson, Map.class);
			if ("0".equals(maps.get("returnCode").toString())) {
				result[0] = maps.get("reportId").toString();
			} else {
				result[1] = returnJson;
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			LOGGER.error("[自动化定时任务]自动化测试出错:" + returnJson, e);
			result[1] = returnJson;
		}
				
		context.setResult(result);				
	}

}
