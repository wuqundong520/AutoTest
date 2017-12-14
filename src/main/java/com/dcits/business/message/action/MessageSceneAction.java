package com.dcits.business.message.action;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.dcits.business.base.action.BaseAction;
import com.dcits.business.message.bean.InterfaceInfo;
import com.dcits.business.message.bean.Message;
import com.dcits.business.message.bean.MessageScene;
import com.dcits.business.message.bean.SceneValidateRule;
import com.dcits.business.message.bean.TestData;
import com.dcits.business.message.service.MessageSceneService;
import com.dcits.business.message.service.MessageService;
import com.dcits.business.message.service.SceneValidateRuleService;
import com.dcits.business.message.service.TestDataService;
import com.dcits.business.message.service.TestSetService;
import com.dcits.business.system.bean.GlobalVariable;
import com.dcits.business.system.service.GlobalVariableService;
import com.dcits.constant.ReturnCodeConsts;
import com.dcits.coretest.message.parse.MessageParse;
import com.dcits.util.PracticalUtils;
import com.dcits.util.excel.ImportMessageScene;

/**
 * 报文场景Action
 * 
 * @author xuwangcheng
 * @version 1.0.0.0,2017.3.6
 */

@Controller
@Scope("prototype")
public class MessageSceneAction extends BaseAction<MessageScene>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer messageId;

	private MessageSceneService messageSceneService;
	@Autowired
	private TestSetService testSetService;
	@Autowired
	private TestDataService testDataService;
	@Autowired
	private GlobalVariableService globalVariableService;
	@Autowired
	private SceneValidateRuleService sceneValidateRuleService;
	@Autowired
	private MessageService messageService;
	
	private String path;
	private Integer variableId;
	private Integer setId;
	
	@SuppressWarnings("unused")
	private String mode;

	@Autowired
	public void setMessageSceneService(MessageSceneService messageSceneService) {
		super.setBaseService(messageSceneService);
		this.messageSceneService = messageSceneService;
	}
	
	
	@Override
	public String[] prepareList() {
		// TODO Auto-generated method stub
		if (messageId != null) {
			this.filterCondition = new String[]{"message.messageId=" + messageId};
		}
		return this.filterCondition;
	}	
	
	/**
	 * 从上传的Excel导入场景信息到数据库
	 * @return
	 */
	public String importFromExcel () {
		
		Message message = messageService.get(messageId);
		
		if (message == null) {
			jsonMap.put("msg", "报文信息不存在!");
			jsonMap.put("returnCode", ReturnCodeConsts.SYSTEM_ERROR_CODE);
			return SUCCESS;
		}
		
		Map<String, Object> result = ImportMessageScene.importToDB(path, message);
		
		jsonMap.put("result", result);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 获取测试集场景
	 * <br>
	 * mode=0 获取拥有的<br>
	 * mode=1 获取没有的
	 * @return
	 */
	/*@SuppressWarnings("unchecked")
	public String listSetScenes() {
		Map<String,Object>  dt = StrutsUtils.getDTParameters(MessageScene.class);
		PageModel<MessageScene> pu = messageSceneService.findSetScenesByPager(start, length
				,(String)dt.get("orderDataName"),(String)dt.get("orderType")
				,(String)dt.get("searchValue"),(List<String>)dt.get("dataParams"), setId, mode);
		
		jsonMap.put("draw", draw);
		jsonMap.put("data", pu.getDatas());
		
		int count = testSetService.get(setId).getSceneNum();
		if ("1".equals(mode)) {
			count = messageSceneService.totalCount() - count;
		} 
		
		jsonMap.put("recordsTotal", count);		
		jsonMap.put("recordsFiltered", count);
		
		if (!((String)dt.get("searchValue")).equals("")) {
			jsonMap.put("recordsFiltered", pu.getDatas().size());
		}
		
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		
		return SUCCESS;
	}*/
	
	@Override
	public String edit() {
		if (model.getMessageSceneId() == null) { //新增
			model.setCreateTime(new Timestamp(System.currentTimeMillis()));
			model.setMessageSceneId(messageSceneService.save(model));
			//新增时默认该该场景添加一条默认数据		
			TestData defaultData = new TestData();
			defaultData.setDataDiscr("默认数据");
			defaultData.setStatus("0");
			defaultData.setMessageScene(model);
			defaultData.setParamsData("");	
			testDataService.edit(defaultData);
			
			//是否配置关联验证模板
			if (variableId != null) {
				GlobalVariable v = globalVariableService.get(variableId);
				SceneValidateRule rule = (SceneValidateRule) v.createSettingValue();
				rule.setMessageScene(model);
				sceneValidateRuleService.save(rule);								
			}			
		} else {
			messageSceneService.edit(model);
		}
		
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		
		return SUCCESS;
	}
	
	/**
	 * 变更验证规则
	 * @return
	 */
	public String changeValidateRule() {		
		messageSceneService.updateValidateFlag(model.getMessageSceneId(), model.getValidateRuleFlag());
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/**
	 * 获取测试中需要用到的url和所有可用测试数据
	 * @return
	 */
	public String getTestObject() {
		
		model = messageSceneService.get(model.getMessageSceneId());
		Message msg = model.getMessage();
		InterfaceInfo info = msg.getInterfaceInfo();
		List<String> urls = new ArrayList<String>();
		
		if (StringUtils.isNotBlank(info.getRequestUrlReal())) {
			urls.add(info.getRequestUrlReal());
		}
				
		if (StringUtils.isNotBlank(info.getRequestUrlMock())) {
			urls.add(info.getRequestUrlMock());
		}

		if (StringUtils.isNotBlank(msg.getRequestUrl())) {
			urls.add(msg.getRequestUrl());
		}
		
		//model.setEnabledTestDatas();
		Set<TestData> datas = model.getEnabledTestDatas(10);
		
		MessageParse parseUtil = MessageParse.getParseInstance(msg.getMessageType());
		
		for (TestData data:datas) {
			data.setDataJson(parseUtil.depacketizeMessageToString(msg.getComplexParameter(), data.getParamsData()));
		}
		
		jsonMap.put("urls", urls);
		jsonMap.put("testData", datas);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		
		return SUCCESS;
	}
	/**
	 * 获取指定测试集中没有测试数据的测试场景列表
	 * @return
	 */
	public String listNoDataScenes() {
		List<MessageScene> noDataScenes = new ArrayList<MessageScene>();		
		List<MessageScene> scenes = null;
		
		//全量
		if (setId == 0) {
			scenes = messageSceneService.findAll();
		//测试集	
		} else {
			scenes = messageSceneService.getBySetId(setId);
		}
		
		for(MessageScene ms:scenes){
			if(ms.getEnabledTestDatas(1).size() < 1){
				noDataScenes.add(ms);
			}								
		}	
		
		jsonMap.put("data", noDataScenes);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		return SUCCESS;
	}
	
	/***************************************GET-SET************************************************/
	
	public void setMessageId(Integer messageId) {
		this.messageId = messageId;
	}

	public void setSetId(Integer setId) {
		this.setId = setId;
	}
	
	public void setMode(String mode) {
		this.mode = mode;
	}
	
	public void setVariableId(Integer variableId) {
		this.variableId = variableId;
	}
	
	public void setPath(String path) {
		this.path = path;
	}
}
