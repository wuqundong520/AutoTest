package com.dcits.business.message.action;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.dcits.business.base.action.BaseAction;
import com.dcits.business.message.bean.InterfaceInfo;
import com.dcits.business.message.service.InterfaceInfoService;
import com.dcits.business.user.bean.User;
import com.dcits.constant.ReturnCodeConsts;
import com.dcits.util.StrutsUtils;
import com.dcits.util.excel.ExportInterfaceInfo;
import com.dcits.util.excel.ImportInterfaceInfo;
import com.dcits.util.excel.PoiExcelUtil;

/**
 * 接口自动化
 * 接口信息Action
 * @author xuwangcheng
 * @version 1.0.0.0,2017.2.13
 */

@Controller
@Scope("prototype")
public class InterfaceInfoAction extends BaseAction<InterfaceInfo> {

	private static final long serialVersionUID = 1L;	
	
	private InterfaceInfoService interfaceInfoService;
	
	private String path;
	
	private String queryMode;
	
	private String ids;
	
	@Autowired
	public void setInterfaceInfoService(InterfaceInfoService interfaceInfoService) {
		super.setBaseService(interfaceInfoService);
		this.interfaceInfoService = interfaceInfoService;
	}
	
	/**
	 * 获取参数jsonTree数据
	 * @return
	 */
	public String getParametersJsonTree () {
		Object[] os = interfaceInfoService.get(model.getInterfaceId()).getParameterZtreeMap();
		
		if (os == null) {
			jsonMap.put("msg", "没有可用的参数,请检查!");
			jsonMap.put("returnCode", ReturnCodeConsts.NO_RESULT_CODE);
			return SUCCESS;
		}
		
		jsonMap.put("data", os[0]);
		jsonMap.put("rootPid", Integer.parseInt(os[1].toString()));
		jsonMap.put("error", os[2].toString());
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);	
		return SUCCESS;
	}
	
	/**
	 * 批量导出接口文档
	 * @return
	 */
	public String exportInterfaceDocument () {
		if (ids == null) {
			ids = "";
		}
		
		String[] ids_s = ids.split(",");
		
		List<InterfaceInfo> infos = new ArrayList<InterfaceInfo>();
		for (String s:ids_s) {
			infos.add(interfaceInfoService.get(Integer.valueOf(s)));
		}
		
		if (infos.size() < 1) {
			jsonMap.put("msg", "没有足够的数据可供导出,请刷新表格并重试!");
			jsonMap.put("returnCode", ReturnCodeConsts.MISS_PARAM_CODE);	
			return SUCCESS;
		}
		
		String path = null;
		
		try {
			path = ExportInterfaceInfo.exportDocuments(infos, PoiExcelUtil.XLSX);
		} catch (Exception e) {
			// TODO: handle exception
			jsonMap.put("returnCode", ReturnCodeConsts.SYSTEM_ERROR_CODE);
			jsonMap.put("msg", "后台写文件出错:<br>" + e.getMessage() + "<br>请联系管理员!");
			return SUCCESS;
		}
		
		jsonMap.put("path", path);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);	
		return SUCCESS;
	}
	
	/**
	 * 从指定excel中导入数据
	 * @return
	 */
	public String importFromExcel () {
		Map<String, Object> result = ImportInterfaceInfo.importToDB(path);
		
		jsonMap.put("result", result);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		
		return SUCCESS;
	}
	
	
	
	/**
	 * 高级查询<br>目前只针对接口信息有高级查询，后期将高级查询做成公共方法适用于大部分查询
	 */
	@Override
	public String[] prepareList() {
		// TODO Auto-generated method stub
		if ("advanced".equals(queryMode)) {//高级查询
			List<String> querys = new ArrayList<String>();
			if (StringUtils.isNotBlank(model.getInterfaceName())) {
				querys.add("interfaceName like '%" + model.getInterfaceName() + "%'");
			}
			if (StringUtils.isNotBlank(model.getInterfaceCnName())) {
				querys.add("interfaceCnName like '%" + model.getInterfaceCnName() + "%'");
			}
			if (StringUtils.isNotBlank(model.getInterfaceType())) {
				querys.add("interfaceType='" + model.getInterfaceType() + "'");
			}
			if (StringUtils.isNotBlank(model.getInterfaceProtocol())) {
				querys.add("interfaceProtocol='" + model.getInterfaceProtocol() + "'");
			}
			if (StringUtils.isNotBlank(model.getStatus())) {
				querys.add("status='" + model.getStatus() + "'");
			}
			if (StringUtils.isNotBlank(model.getCreateTimeText())) {
				String[] dates = model.getCreateTimeText().split("~");
				querys.add("createTime>'" + dates[0].trim() + " 00:00:00" +"'");
				querys.add("createTime<'" + dates[1].trim() + " 23:59:59" +"'");
			}
			if (StringUtils.isNotBlank(model.getCreateUserName())) {
				querys.add("user.realName like '%" + model.getCreateUserName() + "%'");
			}
			if (StringUtils.isNotBlank(model.getMark())) {
				querys.add("mark like '%" + model.getMark() + "%'");
			}
			filterCondition = (String[]) querys.toArray(new String[0]);
		}
		
		return filterCondition;
	}

	/**
	 * 更新接口
	 * 根据传入的interfaceId判断修改还是新增
	 */
	@Override
	public String edit() {
		User user = (User)StrutsUtils.getSessionMap().get("user");
		//判断接口名是否重复
		checkObjectName();
		if (!checkNameFlag.equals("true")) {
			jsonMap.put("returnCode", ReturnCodeConsts.NAME_EXIST_CODE);
			jsonMap.put("msg", "该接口名已存在,请更换!");
			
			return SUCCESS;
		}
		if (model.getInterfaceId() == null) {
			//新增									
			model.setCreateTime(new Timestamp(System.currentTimeMillis()));
			model.setUser(user);				
		}
		
		model.setLastModifyUser(user.getRealName());	
		interfaceInfoService.edit(model);
		jsonMap.put("returnCode", ReturnCodeConsts.SUCCESS_CODE);
		
		return SUCCESS;
	}
	
		
	
	/**
	 * 判断接口名重复性
	 * 新增或者修改状态下均可用
	 */
	@Override
	public void checkObjectName() {
		InterfaceInfo info = interfaceInfoService.findInterfaceByName(model.getInterfaceName());
		checkNameFlag = (info != null && !info.getInterfaceId().equals(model.getInterfaceId())) ? "重复的接口名" : "true";
		
		if (model.getInterfaceId() == null) {
			checkNameFlag = (info == null) ? "true" : "重复的接口名";
		}
	}
	
	
	public void setPath(String path) {
		this.path = path;
	}
	
	public void setQueryMode(String queryMode) {
		this.queryMode = queryMode;
	}
	
	public void setIds(String ids) {
		this.ids = ids;
	}
}
