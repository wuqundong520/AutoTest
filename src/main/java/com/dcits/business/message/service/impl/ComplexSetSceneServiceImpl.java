package com.dcits.business.message.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.dcits.business.base.service.impl.BaseServiceImpl;
import com.dcits.business.message.bean.ComplexSetScene;
import com.dcits.business.message.dao.ComplexSetSceneDao;
import com.dcits.business.message.service.ComplexSetSceneService;

/**
 * 
 * @author xuwangcheng
 * @version 2017.11.23,1.0.0.0
 *
 */
@Repository("complexSetSceneService")
public class ComplexSetSceneServiceImpl extends BaseServiceImpl<ComplexSetScene> implements ComplexSetSceneService {
	
	private ComplexSetSceneDao complexSetSceneDao;
	
	@Autowired
	public void setComplexSetSceneDao(ComplexSetSceneDao complexSetSceneDao) {
		super.setBaseDao(complexSetSceneDao);
		this.complexSetSceneDao = complexSetSceneDao;
	}

	@Override
	public List<ComplexSetScene> listComplexScenesBySetId(Integer setId) {
		// TODO Auto-generated method stub
		return complexSetSceneDao.listComplexScenesBySetId(setId);
	}

	@Override
	public void editComplexScene(Integer id, String complexSceneName,
			String mark) {
		// TODO Auto-generated method stub
		complexSetSceneDao.editComplexScene(id, complexSceneName, mark);
	}

	@Override
	public void editComplexSceneVariables(Integer id, String scenes,
			String saveVariables, String useVariables) {
		// TODO Auto-generated method stub
		complexSetSceneDao.editComplexSceneVariables(id, scenes, saveVariables, useVariables);
		
	}
}	
