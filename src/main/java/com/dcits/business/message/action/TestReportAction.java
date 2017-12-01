package com.dcits.business.message.action;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.dcits.business.base.action.BaseAction;
import com.dcits.business.message.bean.TestReport;
import com.dcits.business.message.bean.TestSet;
import com.dcits.business.message.service.TestReportService;
import com.dcits.business.message.service.TestSetService;
import com.dcits.constant.ReturnCodeConsts;
import com.dcits.constant.SystemConsts;
import com.dcits.util.PracticalUtils;
import com.dcits.util.StrutsUtils;

/**
 * 接口自动化<br>
 * 测试报告和测试结果Action
 * @author xuwangcheng
 * @version 1.0.0.0,2017.07.10
 *
 */


@Controller
@Scope("prototype")
public class TestReportAction extends BaseAction<TestReport> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private TestReportService testReportService;
	@Autowired
	private TestSetService testSetService;
	
	@Autowired
	public void setTestReportService(TestReportService testReportService) {
		super.setBaseService(testReportService);
		this.testReportService = testReportService;
	}

	@Override
	public String get() {
		// TODO Auto-generated method stub
		model = testReportService.get(model.getReportId());
		model.setSceneNum();
		
		jsonMap.put("report", model);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Object processListData(Object o) {
		// TODO Auto-generated method stub
		List<TestReport> reports = (List<TestReport>) o;
		
		for (TestReport r:reports) {
			r.setSceneNum();
			r.setSetName("全量测试");
			
			if (!"0".equals(r.getTestMode())) {
				TestSet set = testSetService.get(Integer.valueOf(r.getTestMode()));
				
				if (set != null) {
					r.setSetName(set.getSetName());
				} else {
					r.setSetName("测试集已删除");
				}
			}
		}		
		return reports;
	}
	
	/**
	 * 获取生成完整测试报告所需数据
	 * @return
	 */
	public String getReportDetail() {
		
		TestReport report = testReportService.get(model.getReportId());
		report.setSceneNum();
		
		TestSet set = testSetService.get(Integer.valueOf(report.getTestMode()));
		String title = "神州数码接口自动化测试报告";
		
		jsonMap.put("title", "全量测试  " + report.getCreateTime() + " - " + title);
		
		if (!"0".equals(report.getTestMode())) {
			if (set == null) {
				jsonMap.put("title", "接口测试  " + report.getCreateTime() + " - " + title);
			} else {
				jsonMap.put("title", set.getSetName() + " - " + title);
			}
		}
		
		Map<String, Object> desc = new HashMap<>();
		
		desc.put("sceneNum", report.getSceneNum());
		desc.put("testDate", report.getCreateTime());
		desc.put("successNum", report.getSuccessNum());
		desc.put("failNum", report.getFailNum());
		desc.put("stopNum", report.getStopNum());
		desc.put("successRate",  String.format("%.2f", Double.valueOf(String.valueOf(((double)report.getSuccessNum() / report.getSceneNum() * 100)))));
		
		jsonMap.put("desc", desc);
		jsonMap.put("data", report.getTrs());		
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 生成静态报告
	 * @return
	 */
	public String generateStaticReportHtml() {
		TestReport report = testReportService.get(model.getReportId());
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		//判断测试是否已经完成 /判断是否有测试结果
		if ("N".equals(report.getFinishFlag()) || report.getTrs().size() < 1) {
			jsonMap.put("msg", "该项测试还未完成或者没有任何测试结果,请确认之后再查看离线报告!");
			jsonMap.put("returnCode", ReturnCodeConsts.ILLEGAL_HANDLE_CODE);
			return SUCCESS;
		}

		//最终生成文件： reportId_startTime.html
		File htmlFile = new File(StrutsUtils.getProjectPath() + "/" + report.getReportHtmlPath());
		//判断是否已经生成
		if (htmlFile.exists()) {
			jsonMap.put("path", "../../" + report.getReportHtmlPath());		
			return SUCCESS;
		}
		
		//存储文件夹
		String saveFolder = StrutsUtils.getProjectPath() + "/" + SystemConsts.REPORT_VIEW_HTML_FOLDER;
						
		//获取固定部分
		File fixedFile = new File(saveFolder + "/" + SystemConsts.REPORT_VIEW_HTML_FIXED_HTML);
		BufferedOutputStream bos = null;
		FileInputStream fis = null;
		String encoding = "UTF-8";
		boolean successFlag = true;
		String msg = "";
		try {
			bos = new BufferedOutputStream(new FileOutputStream(htmlFile));
			fis = new FileInputStream(fixedFile);
			//读取固定内容
			Long fileLength = fixedFile.length();
			byte[] filecontent = new byte[fileLength.intValue()];
			
			fis.read(filecontent);			
			
			StringBuilder html = new StringBuilder();
			html.append(new String(filecontent, encoding));
			
			//增加动态生成的部分
			report.setSceneNum();
			
			TestSet set = testSetService.get(Integer.valueOf(report.getTestMode()));
			String title = "神州数码接口自动化测试报告";
			
			if (!"0".equals(report.getTestMode())) {
				if (set == null) {
					title = "接口测试  " + report.getCreateTime() + " - " + title;
				} else {
					title = set.getSetName() + " - " + title;
				}
			}
			
			String successRate = String.format("%.2f", Double.valueOf(String.valueOf(((double)report.getSuccessNum() / report.getSceneNum() * 100))));
			
			html.append(PracticalUtils.createReport(report, title, successRate));
			
			//写入文件
			bos.write(html.toString().getBytes(encoding));
			bos.flush();
		} catch (Exception e) {
			// TODO: handle exception
			LOGGER.error("写静态报告文件出错!reportId=" + report.getReportId() + ",输出文件路径=" + StrutsUtils.getProjectPath() 
					+ "/" + report.getReportHtmlPath(), e);
			successFlag = false;
			msg = "写静态报告文件出错!reportId=" + report.getReportId() + ",输出文件路径=" + StrutsUtils.getProjectPath() 
					+ "/" + report.getReportHtmlPath() + "错误原因：<br>" + e.getMessage();
		} finally {
			if (bos != null) {
				try {
					bos.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
			if (fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		
		if (successFlag) {
			jsonMap.put("path", "../../" + report.getReportHtmlPath());
		} else {
			jsonMap.put("returnCode", ReturnCodeConsts.SYSTEM_ERROR_CODE);
			jsonMap.put("msg", msg);
		}
		
		return SUCCESS;
	}
	
}
