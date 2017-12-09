package com.dcits.coretest.task;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;
import org.springframework.beans.factory.annotation.Autowired;

import com.dcits.business.message.bean.TestReport;
import com.dcits.business.message.bean.TestResult;
import com.dcits.business.message.service.TestReportService;
import com.dcits.business.message.service.TestResultService;
import com.dcits.business.system.bean.AutoTask;
import com.dcits.business.system.service.AutoTaskService;
import com.dcits.business.user.service.MailService;
import com.dcits.constant.SystemConsts;
import com.dcits.util.PracticalUtils;
import com.dcits.util.SettingUtil;
import com.dcits.util.mail.Mail;

public class TaskJobListener implements JobListener {

	public static final String LISTENER_NAME = "autoTest";
	
	@Autowired
	private MailService mailService;
	@Autowired
	private AutoTaskService taskService;
	@Autowired
	private TestReportService reportService;
	@Autowired
	private TestResultService resultService;
	
	private static final Logger LOGGER = Logger.getLogger(TaskJobListener.class);
	
	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return LISTENER_NAME;
	}

	/**
	 * 准备执行
	 */
	@Override
	public void jobToBeExecuted(JobExecutionContext context) {
		// TODO Auto-generated method stub
		/*JobDataMap dataMap = context.getJobDetail().getJobDataMap();
		AutoTask task = (AutoTask)dataMap.get(SystemConsts.QUARTZ_TASK_NAME_PREFIX_KEY + context.getJobDetail().getKey().getGroup());
		String tip = "系统准备执行自动化测试任务:[任务Id]=" + task.getTaskId() + ",[任务名称]=" + task.getTaskName() + ",[任务类型]=" + getTaskType(task.getTaskType());
		mailService.sendSystemMail(tip, SystemConsts.ADMIN_USER_ID);*/
	}	

	/**
	 * 执行完成后
	 */
	@Override
	public void jobWasExecuted(JobExecutionContext context,
			JobExecutionException jobException) {
		// TODO Auto-generated method stub
		JobDataMap dataMap = context.getJobDetail().getJobDataMap();
		AutoTask task = (AutoTask)dataMap.get(SystemConsts.QUARTZ_TASK_NAME_PREFIX_KEY + context.getJobDetail().getKey().getGroup());
		
		String[] result = (String[]) context.getResult();
		String tip = "";
		if (StringUtils.isEmpty(result[0])) {
			tip = "接口自动化测试定时任务<br><span class=\"label label-primary radius\">[任务Id]</span> = " + task.getTaskId() + "<br><span class=\"label label-primary radius\">[任务名称]</span> = " + task.getTaskName() + "<br><span class=\"label label-primary radius\">[任务类型]</span> = " + getTaskType(task.getTaskType()) + "<br><span class=\"label label-primary radius\">[任务状态]</span> = <span class=\"c-red\"><strong>失败</strong></span><br><pre class=\"prettyprint linenums\">" + result[1] + "</pre>";
			mailService.sendSystemMail(tip, SystemConsts.ADMIN_USER_ID);
			return;
		}
		
		if ("0".equals(task.getTaskType())) {
			String finishFlag = "N";
			
			while ("N".equalsIgnoreCase(finishFlag)) {
				finishFlag = reportService.isFinished(Integer.parseInt(result[0]));				
				try {
					Thread.sleep(2000);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
			tip = "接口自动化测试定时任务<br><span class=\"label label-primary radius\">[任务Id]</span> = " 
					+ task.getTaskId() + "<br><span class=\"label label-primary radius\">[任务名称]</span> = " 
					+ task.getTaskName() + "<br><span class=\"label label-primary radius\">[任务类型]</span> = " 
					+ getTaskType(task.getTaskType()) + "<br><span class=\"label label-primary radius\">[测试报告ID]</span> = " 
					+ result[0] + "<br>详情请至测试报告模块查看本次报告!";
		}		
		
		task.setRunCount(task.getRunCount() + 1);
		task.setLastFinishTime(new Timestamp(System.currentTimeMillis()));
		taskService.edit(task);
		
		//发送推送邮件
		if ("0".equals(SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_IF_SEND_REPORT_MAIL))) {
			String createReportUrl = SettingUtil.getSettingValue(SystemConsts.GLOBAL_SETTING_HOME) + "/" 
					+ SystemConsts.CREATE_STATIC_REPORT_HTML_RMI_URL + "?reportId=" + result[0] 
					+ "&tooken=" + SystemConsts.REQUEST_ALLOW_TOOKEN;
			String returnJson = PracticalUtils.doGetHttpRequest(createReportUrl);
			try {
				Map maps = new ObjectMapper().readValue(returnJson, Map.class);
				if (!"0".equals(maps.get("returnCode").toString())) {
					throw new Exception(returnJson);
				}
				
				TestReport report = reportService.get(Integer.valueOf(result[0]));
				report.setTrs(new HashSet<TestResult>(resultService.listByReportId(Integer.valueOf(result[0]))));
				
				String sendMailSuccessFlag = Mail.sendReportEmail(report);
				
				if ("true".equalsIgnoreCase(sendMailSuccessFlag)) {
					tip += "<p class=\"c-green\">本次测试结果及报告已通过邮件推送!</p>";
				} else {
					tip += "<p class=\"c-red\">发送推送邮件失败,原因：</p><p>" + sendMailSuccessFlag + "</p>";
				}
				
				
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
				tip += "<p class=\"c-red\">发送推送邮件失败，原因：无法生成当前测试报告的静态html文件！调用接口" + SystemConsts.CREATE_STATIC_REPORT_HTML_RMI_URL 
						+ "失败。ReportId=" + result[0] + "</p>";
			}
		}
		
		mailService.sendSystemMail(tip, SystemConsts.ADMIN_USER_ID);
		
		
	}
	
	@Override
	public void jobExecutionVetoed(JobExecutionContext context) {
		// TODO Auto-generated method stub
		
	}
	
	private static String getTaskType (String type) {
		switch (type) {
		case "0":
			return "接口自动化";
		case "1":
			return "Web自动化";
		default:
			return "未知类型";
		}
	}

}
