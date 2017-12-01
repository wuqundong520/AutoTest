package com.dcits.coretest.task;

import java.sql.Timestamp;

import org.apache.commons.lang.StringUtils;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;
import org.springframework.beans.factory.annotation.Autowired;

import com.dcits.business.message.service.TestReportService;
import com.dcits.business.system.bean.AutoTask;
import com.dcits.business.system.service.AutoTaskService;
import com.dcits.business.user.service.MailService;
import com.dcits.constant.SystemConsts;

public class TaskJobListener implements JobListener {

	public static final String LISTENER_NAME = "autoTest";
	
	@Autowired
	private MailService mailService;
	@Autowired
	private AutoTaskService taskService;
	@Autowired
	private TestReportService reportService;
	
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
			
			tip = "接口自动化测试定时任务<br><span class=\"label label-primary radius\">[任务Id]</span> = " + task.getTaskId() + "<br><span class=\"label label-primary radius\">[任务名称]</span> = " + task.getTaskName() + "<br><span class=\"label label-primary radius\">[任务类型]</span> = " + getTaskType(task.getTaskType()) + "<br><span class=\"label label-primary radius\">[测试报告ID]</span> = " + result[0] + "<br>详情请至测试报告模块查看本次报告!";
		}
		
		if ("1".equals(task.getTaskType())) {
			
		}
		
		task.setRunCount(task.getRunCount() + 1);
		task.setLastFinishTime(new Timestamp(System.currentTimeMillis()));
		taskService.edit(task);
		
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
