package com.dcits.business.system.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.dcits.business.base.dao.impl.BaseDaoImpl;
import com.dcits.business.system.bean.GlobalVariable;
import com.dcits.business.system.dao.GlobalVariableDao;

/**
 * 
 * @author xuwangcheng
 * @version 1.0.0.0,20171129
 *
 */
@Repository("globalVariableDao")
public class GlobalVariableDaoImpl extends BaseDaoImpl<GlobalVariable> implements GlobalVariableDao {

	@Override
	public GlobalVariable findByKey(String key) {
		// TODO Auto-generated method stub
		String hql = "From GlobalVariable g where g.key=:key";
		return (GlobalVariable) getSession().createQuery(hql)
				.setString("key", key).uniqueResult();
	}

	@Override
	public void updateValue(Integer variableId, String value) {
		// TODO Auto-generated method stub
		String hql = "update GlobalVariable g set g.value=:value where g.variableId=:variableId";
		getSession().createQuery(hql).setString("value", value).setInteger("variableId", variableId)
			.executeUpdate();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<GlobalVariable> findByVariableType(String variableType) {
		// TODO Auto-generated method stub
		String hql = "From GlobalVariable g where g.variableType=:variableType";
		return getSession().createQuery(hql).setString("variableType", variableType).list();
	}	
}
