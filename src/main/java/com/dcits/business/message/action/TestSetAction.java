package com.dcits.business.message.action;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.dcits.business.base.action.BaseAction;
import com.dcits.business.message.bean.ComplexSetScene;
import com.dcits.business.message.bean.MessageScene;
import com.dcits.business.message.bean.TestConfig;
import com.dcits.business.message.bean.TestSet;
import com.dcits.business.message.service.ComplexSetSceneService;
import com.dcits.business.message.service.MessageSceneService;
import com.dcits.business.message.service.TestConfigService;
import com.dcits.business.message.service.TestSetService;
import com.dcits.business.system.bean.GlobalVariable;
import com.dcits.business.system.service.GlobalVariableService;
import com.dcits.business.user.bean.User;
import com.dcits.constant.ReturnCodeConsts;
import com.dcits.util.StrutsUtils;

/**
 * 接口自动化<br>
 * 测试集Action
 * @author xuwangcheng
 * @version 1.0.0.0,20170518
 *
 */
@Controller
@Scope("prototype")
public class TestSetAction extends BaseAction<TestSet> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private TestSetService testSetService;
	
	@Autowired
	private MessageSceneService messageSceneService;
	@Autowired
	private TestConfigService testConfigService;
	@Autowired
	private ComplexSetSceneService complexSetSceneService;
	@Autowired
	private GlobalVariableService globalVariableService;
	
	/**
	 * (1)、添加还是删除场景,0-增加 1-删除<br>
	 * (2)、查询存在于测试集或者不存在测试集中的测试场景,0-存在于测试集  1-不存在于测试集<br>
	 * (3)、更改测试集的运行时配置,0-更改为自定义  1-更改为默认
	 */
	private String mode;
	
	private Integer messageSceneId;
	
	private String complexSceneName;
	
	private String scenes;
	
	private String useVariables;
	
	private String saveVariables;
	
	private Integer variableId;
	
	private Integer parentId;
	
	@Autowired
	public void setTestSetService(TestSetService testSetService) {
		super.setBaseService(testSetService);
		this.testSetService = testSetService;
	}

	
	@Override
	public String[] prepareList() {
		// TODO Auto-generated method stub
		this.filterCondition = new String[]{"parented=1"};
		return this.filterCondition;
	}

	/**
	 * 获取目录树结构
	 * @return
	 */
	public String getCategoryNodes () {
		List<TestSet> rootSets = testSetService.getRootSet();
		
		if (rootSets.size() < 1) {
			jsonMap.put("msg", "根节点不存在!");
			jsonMap.put("returnCode", ReturnCodeConsts.SYSTEM_ERROR_CODE);
			return SUCCESS;
		}
		
		List<Map<String, Object>> sets = new ArrayList<Map<String, Object>>();
		for (TestSet set:rootSets) {
			sets.add(set.getNodesMap(testSetService));
		}
		jsonMap.put("nodes", sets);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}


	@Override
	public String edit() {
		// TODO Auto-generated method stub		
		if (model.getSetId() == null) {
			model.setCreateTime(new Timestamp(System.currentTimeMillis()));
			model.setUser((User)(StrutsUtils.getSessionMap().get("user")));			
		} else {
			model.setMs(testSetService.get(model.getSetId()).getMs());
		}
		if (parentId != 0) {
			model.setParentSet(new TestSet(parentId));
		}		
		testSetService.edit(model);
		
		jsonMap.put("object", model);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 该测试集当前拥有的测试场景或不存在的测试场景<br>
	 * 根据mode参数 0-该测试集拥有的场景  1-该测试集可以添加的场景
	 * @return
	 */
	public String listScenes() {				
		model = testSetService.get(model.getSetId());
		List<MessageScene> scenes = new ArrayList<MessageScene>();
		
		if (model != null) {
			if ("0".equals(mode)) {
				scenes = new ArrayList<MessageScene>(model.getMs());
			}
			
			if ("1".equals(mode)) {
				scenes = testSetService.getEnableAddScenes(model.getSetId());
			}
		}
		
		jsonMap.put("data", scenes);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 移动测试集到文件夹目录下
	 * @return
	 */
	public String moveFolder () {
		
		testSetService.moveFolder(model.getSetId(), parentId);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 操作测试场景到测试集
	 * @return
	 */
	public String opScene() {
		//增加场景到测试集
		if ("1".equals(mode)) {
			testSetService.addSceneToSet(model.getSetId(), messageSceneId == null ? id : messageSceneId);
		}
		
		//从测试集删除场景
		if ("0".equals(mode)) {
			testSetService.delSceneToSet(model.getSetId(), messageSceneId == null ? id : messageSceneId);
		}
		
		
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 获取当前用户拥有的测试集
	 * @return
	 */
	public String getMySet () {
		
		jsonMap.put("data", testSetService.findAll("parented=1"));
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 当前测试集的组合场景列表
	 * @return
	 */
	public String listComplexScenes() {
		
		jsonMap.put("data", complexSetSceneService.listComplexScenesBySetId(model.getSetId()));
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 删除指定组合场景<br>
	 * 不会删除包含的场景和场景与测试集的关联关系
	 * @return
	 */
	public String delComplexScene() {
		
		complexSetSceneService.delete(id);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 获取指定组合场景的信息
	 * @return
	 */
	public String getComplexScene() {
		
		jsonMap.put("object", complexSetSceneService.get(id));
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 编辑组合场景<br>能编辑的只能是 名称和备注
	 * @return
	 */
	public String editComplexScene() {
		if (id == null) {
			//新增
			TestSet testSet = new TestSet();
			testSet.setSetId(model.getSetId());
			ComplexSetScene scene = new ComplexSetScene(complexSceneName, "", "{}", "{}"
					, testSet,new Timestamp(System.currentTimeMillis()), model.getMark());
			complexSetSceneService.save(scene);
		} else {
			//修改
			complexSetSceneService.editComplexScene(id, complexSceneName, model.getMark());
		}
		
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 更新组合场景变量信息
	 * @return
	 */
	public String editComplexSceneVariables() {
		complexSetSceneService.editComplexSceneVariables(id, scenes, saveVariables, useVariables);		
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 设置运行时配置
	 * @return
	 */
	public String settingConfig() {
		model = testSetService.get(model.getSetId());
		TestConfig config = null;
		
		if ("0".equals(mode)) {
			config = (TestConfig) testConfigService.getConfigByUserId(0).clone();
			config.setConfigId(null);
			config.setUserId(null);
			testConfigService.save(config);
			model.setConfig(config);
		} else {
			if (model.getConfig() != null) {
				Integer configId = model.getConfig().getConfigId();
				model.setConfig(null);
				testConfigService.delete(configId);
			}
		}
			
		if (variableId != null) {
			//配置模板
			GlobalVariable v = globalVariableService.get(variableId);
			config = (TestConfig) v.createSettingValue();
			testConfigService.save(config);
			model.setConfig(config);
		}
		
		testSetService.edit(model);
		
		jsonMap.put("config", config);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**************************************************************/
	public void setMode(String mode) {
		this.mode = mode;
	}
	public void setMessageSceneId(Integer messageSceneId) {
		this.messageSceneId = messageSceneId;
	}
	
	public void setComplexSetSceneService(
			ComplexSetSceneService complexSetSceneService) {
		this.complexSetSceneService = complexSetSceneService;
	}
	
	public void setComplexSceneName(String complexSceneName) {
		this.complexSceneName = complexSceneName;
	}
	
	public void setSaveVariables(String saveVariables) {
		this.saveVariables = saveVariables;
	}
	
	public void setUseVariables(String useVariables) {
		this.useVariables = useVariables;
	}
	
	public void setScenes(String scenes) {
		this.scenes = scenes;
	}
	
	public void setVariableId(Integer variableId) {
		this.variableId = variableId;
	}
	
	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}
	
}
