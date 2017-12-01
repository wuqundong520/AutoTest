package com.dcits.business.system.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dcits.business.base.service.impl.BaseServiceImpl;
import com.dcits.business.system.bean.GlobalVariable;
import com.dcits.business.system.dao.GlobalVariableDao;
import com.dcits.business.system.service.GlobalVariableService;
/**
 * 
 * @author xuwangcheng
 * @version 1.0.0.0,20171129
 *
 */
@Service("globalVariableService")
public class GlobalVariableServiceImpl extends BaseServiceImpl<GlobalVariable> implements GlobalVariableService {
	
	private GlobalVariableDao globalVariableDao;
	
	@Autowired
	public void setGlobalVariableDao(GlobalVariableDao globalVariableDao) {
		super.setBaseDao(globalVariableDao);
		this.globalVariableDao = globalVariableDao;
	}

	@Override
	public GlobalVariable findByKey(String key) {
		// TODO Auto-generated method stub
		return globalVariableDao.findByKey(key);
	}

	@Override
	public void updateValue(Integer variableId, String value) {
		// TODO Auto-generated method stub
		globalVariableDao.updateValue(variableId, value);
		
	}
}
