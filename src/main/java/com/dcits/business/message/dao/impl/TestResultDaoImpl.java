package com.dcits.business.message.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.dcits.business.base.dao.impl.BaseDaoImpl;
import com.dcits.business.message.bean.TestResult;
import com.dcits.business.message.dao.TestResultDao;

@Repository("testResultDao")
public class TestResultDaoImpl extends BaseDaoImpl<TestResult> implements TestResultDao {

	@SuppressWarnings("unchecked")
	@Override
	public List<TestResult> listByReportId(Integer reportId) {
		// TODO Auto-generated method stub
		String hql = "from TestResult t where t.testReport.reportId=:reportId";
		
		return getSession().createQuery(hql).setInteger("reportId", reportId).setCacheable(true).list();
	}

}
