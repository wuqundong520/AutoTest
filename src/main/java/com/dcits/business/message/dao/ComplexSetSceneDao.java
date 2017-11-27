package com.dcits.business.message.dao;

import java.util.List;

import com.dcits.business.base.dao.BaseDao;
import com.dcits.business.message.bean.ComplexSetScene;

/**
 * 
 * @author xuwangcheng
 * @version 2017.11.23,1.0.0.0
 *
 */
public interface ComplexSetSceneDao extends BaseDao<ComplexSetScene> {
	
	/**
	 * 展示指定测试集拥有的组合场景
	 * @param setId
	 * @return
	 */
	List<ComplexSetScene> listComplexScenesBySetId(Integer setId);
	
	/**
	 * 编辑组合场景的名称和备注
	 * @param id
	 * @param complexSceneName
	 * @param mark
	 */
	void editComplexScene(Integer id, String complexSceneName, String mark);
	
	/**
	 * 更新组合场景中变量相关信息
	 * @param id
	 * @param scenes
	 * @param saveVariables
	 * @param useVariables
	 */
	void editComplexSceneVariables(Integer id, String scenes, String saveVariables, String useVariables);
	
}
