package com.dcits.business.message.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dcits.business.base.service.impl.BaseServiceImpl;
import com.dcits.business.message.bean.MessageScene;
import com.dcits.business.message.bean.TestConfig;
import com.dcits.business.message.bean.TestSet;
import com.dcits.business.message.dao.TestSetDao;
import com.dcits.business.message.service.TestSetService;

/**
 * 
 * @author xuwangcheng
 * @version 1.0.0.0,20170518
 *
 */

@Service("testSetService")
public class TestSetServiceImpl extends BaseServiceImpl<TestSet> implements TestSetService {
	
	private TestSetDao testSetDao;
	
	@Autowired
	public void setTestSetDao(TestSetDao testSetDao) {
		setBaseDao(testSetDao);
		this.testSetDao = testSetDao;
	}

	@Override
	public List<MessageScene> getEnableAddScenes(Integer setId) {
		// TODO Auto-generated method stub
		return testSetDao.getEnableAddScenes(setId);
	}

	@Override
	public void addSceneToSet(Integer setId, Integer messageSceneId) {
		// TODO Auto-generated method stub
		testSetDao.addSceneToSet(setId, messageSceneId);
	}

	@Override
	public void delSceneToSet(Integer setId, Integer messageSceneId) {
		// TODO Auto-generated method stub
		testSetDao.delSceneToSet(setId, messageSceneId);
	}

	@Override
	public List<TestSet> getUserSets(Integer userId) {
		// TODO Auto-generated method stub
		return testSetDao.getUserSets(userId);
	}

	@Override
	public void updateSettingConfig(Integer setId, TestConfig config) {
		// TODO Auto-generated method stub
		testSetDao.updateSettingConfig(setId, config);
	}

	@Override
	public List<TestSet> getRootSet() {
		// TODO Auto-generated method stub
		return testSetDao.getRootSet();
	}

	@Override
	public void delete(int id) {
		// TODO Auto-generated method stub
		TestSet set = get(id);
		if (set == null) {
			return;
		}
		
		if ("0".equals(set.getParented())) {//测试集目录
			TestSet parentSet = set.getParentSet();
			
			for (TestSet s:set.getChildrenSets()) {
				s.setParentSet(parentSet);
				edit(s);
			}
		}
		set.setChildrenSets(null);		
		testSetDao.delete(id);
		
	}

	@Override
	public void moveFolder(Integer setId, Integer parentId) {
		// TODO Auto-generated method stub
		testSetDao.moveFolder(setId, parentId);
	}
}
