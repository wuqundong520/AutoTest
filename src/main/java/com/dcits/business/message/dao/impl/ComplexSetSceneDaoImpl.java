package com.dcits.business.message.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.dcits.business.base.dao.impl.BaseDaoImpl;
import com.dcits.business.message.bean.ComplexSetScene;
import com.dcits.business.message.dao.ComplexSetSceneDao;

/**
 * 
 * @author xuwangcheng
 * @version 2017.11.23,1.0.0.0
 *
 */
@Repository("complexSetScene")
public class ComplexSetSceneDaoImpl extends BaseDaoImpl<ComplexSetScene> implements ComplexSetSceneDao {

	@SuppressWarnings("unchecked")
	@Override
	public List<ComplexSetScene> listComplexScenesBySetId(Integer setId) {
		// TODO Auto-generated method stu
		String hql = "From ComplexSetScene c where c.testSet.setId=:setId";		
		return getSession().createQuery(hql).setInteger("setId", setId).list();
	}

	@Override
	public void editComplexScene(Integer id, String complexSceneName,
			String mark) {
		// TODO Auto-generated method stub
		String hql = "update ComplexSetScene c set c.complexSceneName=:complexSceneName "
				+ ",c.mark=:mark where c.id=:id";
		getSession().createQuery(hql).setString("complexSceneName", complexSceneName)
			.setString("mark", mark).setInteger("id", id).executeUpdate();
	}

	@Override
	public void editComplexSceneVariables(Integer id, String scenes,
			String saveVariables, String useVariables) {
		// TODO Auto-generated method stub
		String hql = "update ComplexSetScene c set c.scenes=:scenes,c.saveVariables=:saveVariables "
				+ ",c.useVariables=:useVariables where c.id=:id";
		getSession().createQuery(hql).setString("scenes", scenes).setString("saveVariables", saveVariables)
			.setString("useVariables", useVariables).setInteger("id", id).executeUpdate();
		
	}
	
}
