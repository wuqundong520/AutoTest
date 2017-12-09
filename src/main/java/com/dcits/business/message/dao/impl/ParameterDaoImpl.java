package com.dcits.business.message.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.dcits.business.base.dao.impl.BaseDaoImpl;
import com.dcits.business.message.bean.Parameter;
import com.dcits.business.message.dao.ParameterDao;

/**
 * 接口参数Dao接口实现
 * 
 * @author xuwangcheng
 * @version 1.0.0.0,2017.2.13
 */

@Repository("parameterDao")
public class ParameterDaoImpl extends BaseDaoImpl<Parameter> implements ParameterDao {
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Parameter> findByInterfaceId(int interfaceId) {
		return getSession().createQuery("from Parameter where interfaceInfo.interfaceId= :interfaceId")
				.setInteger("interfaceId", interfaceId)
				.list();
	}

	@Override
	public void editProperty(int parameterId, String attrName, String attrValue) {
		String hql = "update Parameter p set " + attrName + "= :attrValue "
				+ "where p.parameterId= :parameterId";
		
		getSession().createQuery(hql)
			.setString("attrValue", attrValue)
			.setInteger("parameterId",parameterId)
			.executeUpdate();		
	}

	@Override
	public void delByInterfaceId(int interfaceId) {
		// TODO Auto-generated method stub
		String hql = "delete from Parameter p where p.interfaceInfo.interfaceId=:interfaceId";
		
		getSession().createQuery(hql)
			.setInteger("interfaceId", interfaceId)
			.executeUpdate();
	}

	@Override
	public Parameter checkRepeatParameter(Integer parameterId,
			String parameterIdentify, String path, String type,
			Integer interfaceId) {
		// TODO Auto-generated method stub
		String hql = "From Parameter p where p.interfaceInfo.interfaceId=:interfaceId and p.parameterIdentify=:parameterIdentify"
				+ " and p.path=:path";
		Parameter p = (Parameter) getSession().createQuery(hql).setString("parameterIdentify", parameterIdentify).setString("path", path)
				.setInteger("interfaceId", interfaceId).setCacheable(true).uniqueResult();
		if (p != null && parameterId != null) {
			return parameterId.equals(p.getParameterId()) ? null : p;
		}
		return p;
	}
	
}
