package com.dcits.business.system.action;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.dcits.business.base.action.BaseAction;
import com.dcits.business.system.bean.GlobalVariable;
import com.dcits.business.system.service.GlobalVariableService;
import com.dcits.business.user.bean.User;
import com.dcits.constant.ReturnCodeConsts;
import com.dcits.util.StrutsUtils;

/**
 * 
 * @author xuwangcheng
 * @version 1.0.0.0,20171129
 *
 */
@Controller("globalVariableAction")
public class GlobalVariableAction extends BaseAction<GlobalVariable> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private GlobalVariableService globalVariableService;
	
	@Autowired
	public void setGlobalVariableService(
			GlobalVariableService globalVariableService) {
		super.setBaseService(globalVariableService);
		this.globalVariableService = globalVariableService;
	}
	
	
	@Override
	public String edit() {
		// TODO Auto-generated method stub
		User user = (User)StrutsUtils.getSessionMap().get("user");
		if (model.getVariableId() == null) {
			//新增
			model.setCreateTime(new Timestamp(System.currentTimeMillis()));
			model.setUser(new User(user.getUserId()));
		}
		globalVariableService.edit(model);		
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		
		return SUCCESS;
	}

	/**
	 * 更新指定全局变量的value值，不包括constant和timestamp类型的
	 * @return
	 */
	public String updateValue() {
		
		globalVariableService.updateValue(model.getVariableId(), model.getValue());
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		
		return SUCCESS;
	}
	

	/**
	 * 在同种类型中判断key值是否重复<br>
	 * 新增或者修改状态下均可用
	 */
	@Override
	public void checkObjectName() {
		GlobalVariable info = globalVariableService.findByKey(model.getKey());
		checkNameFlag = (info != null && info.getVariableId() != model.getVariableId()) ? "重复的key" : "true";
		
		if (model.getVariableId() == null) {
			checkNameFlag = (info == null) ? "true" : "重复的key";
		}
	}

}
