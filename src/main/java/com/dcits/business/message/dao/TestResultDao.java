package com.dcits.business.message.dao;

import java.util.List;

import com.dcits.business.base.dao.BaseDao;
import com.dcits.business.message.bean.TestResult;

public interface TestResultDao extends BaseDao<TestResult> {
	/**
	 * 查找指定测试报告的测试详情结果集
	 * @param reportId
	 * @return
	 */
	List<TestResult> listByReportId(Integer reportId);

}
