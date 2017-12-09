package com.dcits.business.message.service;

import java.util.List;

import com.dcits.business.base.service.BaseService;
import com.dcits.business.message.bean.TestResult;

public interface TestResultService extends BaseService<TestResult> {
	/**
	 * 查找指定测试报告的测试详情结果集
	 * @param reportId
	 * @return
	 */
	List<TestResult> listByReportId(Integer reportId);
}
