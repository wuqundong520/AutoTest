package com.dcits.util.excel;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.dcits.business.message.bean.InterfaceInfo;
import com.dcits.business.message.bean.Message;
import com.dcits.business.message.bean.MessageScene;
import com.dcits.business.message.bean.Parameter;
import com.dcits.business.message.bean.TestData;
import com.dcits.business.message.service.InterfaceInfoService;
import com.dcits.business.message.service.MessageSceneService;
import com.dcits.business.message.service.MessageService;
import com.dcits.business.message.service.ParameterService;
import com.dcits.business.message.service.TestDataService;
import com.dcits.business.user.bean.User;
import com.dcits.coretest.message.parse.MessageParse;
import com.dcits.coretest.message.protocol.TestClient;
import com.dcits.util.StrutsUtils;

/**
 * 从指定excel中读取对象内容
 * @author xuwangcheng
 * @version 2017.12.05,1.0.0.0
 *
 */
public class ImportInterfaceInfo {
	
	private static final Logger LOGGER = Logger.getLogger(ImportInterfaceInfo.class);
	
	public static final String RESULT_MAP_TOTAL_COUNT = "totalCount";
	public static final String RESULT_MAP_SUCCESS_COUNT = "successCount";
	public static final String RESULT_MAP_FAIL_COUNT = "failCount";
	public static final String RESULT_MAP_MSG = "msg";
	
	/**
	 * 从excel导入interfaceInfo到数据库
	 * @param path
	 * @return
	 */
	public static Map<String, Object> importToDB (String path) {
		List<InterfaceInfo> infos = importValue(path);
		
		Map<String, Object> result = new HashMap<String, Object>();
		
		int totalCount = infos.size();
		int successCount = 0;
		int failCount = 0;
		StringBuilder msg = new StringBuilder();
		
		InterfaceInfoService interfaceInfoService = (InterfaceInfoService) StrutsUtils.getSpringBean("interfaceInfoService");
		MessageService messageService = (MessageService) StrutsUtils.getSpringBean("messageService");
		MessageSceneService messageSceneService = (MessageSceneService) StrutsUtils.getSpringBean("messageSceneService");
		TestDataService testDataService = (TestDataService) StrutsUtils.getSpringBean("testDataService");
		ParameterService parameterService = (ParameterService) StrutsUtils.getSpringBean("parameterService");
		
		
		for (InterfaceInfo info:infos) {
			//排除interfaceName为空的情况
			if (StringUtils.isBlank(info.getInterfaceName())) {
				totalCount--;
				continue;
			}			
			//验证是否合法
			Object[] objs = validateInfo(info);
			msg.append(objs[1].toString());
			if (!(boolean) objs[2]) {
				failCount++;
				continue;
			}
			try {
				info.setCreateTime(new Timestamp(System.currentTimeMillis()));
				User user = (User)StrutsUtils.getSessionMap().get("user");
				info.setUser(user);
				info.setLastModifyUser(user.getRealName());
				
				//解析参数
				MessageParse parse = MessageParse.getParseInstance(info.getMessageType());
				Set<Parameter> params = parse.importMessageToParameter(info.getRequestMsg(), new HashSet<Parameter>());
				
				
				//判断是否需要创建默认测试报文
				Message message = null;
				if (StringUtils.isNotBlank(info.getCreateMessage())) {
					message = new Message();
					message.setCallParameter("");
					message.setComplexParameter(parse.parseMessageToObject(info.getRequestMsg(), new ArrayList<Parameter>(params)));
					message.setCreateTime(new Timestamp(System.currentTimeMillis()));
					message.setUser(user);
					message.setLastModifyUser(user.getRealName());
					message.setMessageName(info.getCreateMessage());
					message.setMessageType(info.getMessageType());
					message.setRequestUrl("");
					message.setStatus("0");
				}
				
				MessageScene scene = null;
				//判断是否需要创建默认测试场景
				if (message != null && StringUtils.isNotBlank(info.getCreateScene())) {
					scene = new MessageScene();
					scene.setCreateTime(new Timestamp(System.currentTimeMillis()));
					scene.setSceneName(info.getCreateScene());
					scene.setMark("");
				}
				
				//开始进行数据库保存
				//保存interfaceInfo
				info.setInterfaceId(interfaceInfoService.save(info));
				
				//保存params
				for (Parameter p:params) {
					p.setInterfaceInfo(info);
					parameterService.save(p);
				}
				
				//保存message
				if (message != null) {
					message.setInterfaceInfo(info);
					message.setMessageId(messageService.save(message));
				}
				
				//保存scene
				if (scene != null) {
					scene.setMessage(message);
					scene.setMessageSceneId(messageSceneService.save(scene));
					//设置一条默认数据
					TestData defaultData = new TestData();
					defaultData.setDataDiscr("默认数据");
					defaultData.setStatus("0");
					defaultData.setMessageScene(scene);
					defaultData.setParamsData("");	
					testDataService.save(defaultData);
				}
				msg.append("<span class=\"c-green\">导入该条信息成功.</span><br>");
				successCount++;
			} catch (Exception e) {
				// TODO: handle exception
				LOGGER.error("在进行Excel批量导入接口信息时发生了错误：" + info.toString(), e);
				msg.append("<span class=\"c-red\">导入过程中发生了错误：" + e.getMessage() + "！导入该条信息失败.</span><br>");
				failCount++;
			}
		}
			
		result.put(RESULT_MAP_TOTAL_COUNT, totalCount);
		result.put(RESULT_MAP_SUCCESS_COUNT, successCount);
		result.put(RESULT_MAP_FAIL_COUNT, failCount);
		result.put(RESULT_MAP_MSG, msg.toString());
		return result;
	}
	
	/**
	 * 验证传入的InterfaceInfo是否合法<br>
	 * 主要验证类型是否为SL/CX  报文格式是否正确   协议 接口状态
	 * @param info 
	 * @return 返回  数组第一位修改之后的InterfaceInfo 数组第二位字符串标识警告信息或者错误信息 数组第三位为boolean标识该接口信息是否可以入库
	 */
	public static Object[] validateInfo (InterfaceInfo info) {
		//判断类型是否为SL/CX，否则默认选择为CX
		StringBuilder tigs = new StringBuilder("<span class=\"label label-default radius\">" + info.getInterfaceName() + "-" + info.getInterfaceCnName() + ":" + "</span>&nbsp;");
		boolean flag = true;
		
		Object[] obj = new Object[3];
		
		//验证名称是否重复
		InterfaceInfoService interfaceInfoService = (InterfaceInfoService) StrutsUtils.getSpringBean("interfaceInfoService");
		InterfaceInfo info_1 = interfaceInfoService.findInterfaceByName(info.getInterfaceName());
		
		if (info_1 != null) {
			tigs.append("<span class=\"c-red\">已存在同名的接口信息,请检查!导入该条信息失败.</span><br>");
			flag = false;
			obj[0] = info;
			obj[1] = tigs.toString();
			obj[2] = flag;
			return obj;
		}
		
		if (!"SL".equalsIgnoreCase(info.getInterfaceType()) && !"CX".equalsIgnoreCase(info.getInterfaceType())) {
			info.setInterfaceType("CX");
			tigs.append("接口类型不正确,已默认设置为查询类型(CX);");
		}
		
		MessageParse parse = MessageParse.getParseInstance(info.getMessageType());
		if (parse == null || !parse.messageFormatValidation(info.getRequestMsg())) {
			tigs.append("<span class=\"c-red\">报文格式类型与入参报文不一致或者不正确！导入该条信息失败.</span><br>");
			flag = false;
			obj[0] = info;
			obj[1] = tigs.toString();
			obj[2] = flag;
			return obj;
		} 
				
		TestClient client = TestClient.getTestClientInstance(info.getInterfaceProtocol());
		if (client == null) {
			tigs.append("协议类型不正确,默认设置为HTTP;");
			info.setInterfaceProtocol("HTTP");
		}
		
		if (!"0".equals(info.getStatus()) && !"1".equals(info.getStatus())) {
			tigs.append("接口状态设置不正确,默认设置为正常(0);");
			info.setStatus("0");
		}
		
		obj[0] = info;
		obj[1] = tigs.toString();
		obj[2] = flag;
		return obj;
		
	}
	
	/**
	 * 从excel读取数据
	 * @param path
	 * @return
	 */
	public static List<InterfaceInfo> importValue (String path) {
		if (path != null && !path.equals("")) {
            String ext = PublicExcelImportUtil.getExt(path);
            if (ext!=null && !ext.equals("")) {
                if (ext.equals("xls")) {
                    return readXls(path);
                } else if (ext.equals("xlsx")) {
                    return readXlsx(path);
                }
            }
        }
		return new ArrayList<InterfaceInfo>();
	}
	
	/**
	 * 从xls文件读取interfaceInfo
	 * @param path
	 * @return
	 */
	public static List<InterfaceInfo> readXls (String path) {
		HSSFWorkbook hssfWorkbook = null;
		try {
			 InputStream is = new FileInputStream(path);
			 hssfWorkbook = new HSSFWorkbook(is);			 
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		InterfaceInfo info = null;
		List<InterfaceInfo> infos = new ArrayList<InterfaceInfo>();
		
		if (hssfWorkbook != null) {
			// Read the Sheet.只读取第一页
			HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(0);
			// Read the Row
			 for (int rowNum = 1; rowNum <= hssfSheet.getLastRowNum(); rowNum++) {
                 HSSFRow hssfRow = hssfSheet.getRow(rowNum);
                 if (hssfRow != null) {
                     info = new InterfaceInfo();
                     HSSFCell interfaceName = hssfRow.getCell(0);
                     HSSFCell interfaceType = hssfRow.getCell(1);
                     HSSFCell interfaceProtocol = hssfRow.getCell(2);
                     HSSFCell interfaceCnName = hssfRow.getCell(3);
                     HSSFCell requestUrlMock = hssfRow.getCell(4);
                     HSSFCell requestUrlReal = hssfRow.getCell(5);
                     HSSFCell status = hssfRow.getCell(6);
                     HSSFCell requestMsg = hssfRow.getCell(7);
                     HSSFCell messageType = hssfRow.getCell(8);
                     HSSFCell createMessage = hssfRow.getCell(9);
                     HSSFCell createScene = hssfRow.getCell(10);
                     
                     info.setInterfaceName(PublicExcelImportUtil.getValue(interfaceName));
                     info.setInterfaceType(PublicExcelImportUtil.getValue(interfaceType).toUpperCase());
                     info.setInterfaceProtocol(PublicExcelImportUtil.getValue(interfaceProtocol));
                     info.setInterfaceCnName(PublicExcelImportUtil.getValue(interfaceCnName));
                     info.setRequestUrlMock(PublicExcelImportUtil.getValue(requestUrlMock));
                     info.setRequestUrlReal(PublicExcelImportUtil.getValue(requestUrlReal));
                     info.setStatus(PublicExcelImportUtil.getValue(status));
                     info.setRequestMsg(PublicExcelImportUtil.getValue(requestMsg));
                     info.setMessageType(PublicExcelImportUtil.getValue(messageType).toUpperCase());
                     info.setCreateMessage(PublicExcelImportUtil.getValue(createMessage));
                     info.setCreateScene(PublicExcelImportUtil.getValue(createScene));
                     
                     infos.add(info);
                 }
             }
		}
		
		return infos;
		
	}
	
	/**
	 * 从xlsx文件读取interfaceInfo
	 * @param path
	 * @return
	 */
	public static List<InterfaceInfo> readXlsx (String path) {
		XSSFWorkbook xssfWorkbook = null;
        try {
            InputStream is = new FileInputStream(path);
            xssfWorkbook = new XSSFWorkbook(is);
        } catch (IOException e) {
            e.printStackTrace();
        }
        InterfaceInfo info = null;
		List<InterfaceInfo> infos = new ArrayList<InterfaceInfo>();
		
		if (xssfWorkbook != null) {
			// Read the Sheet.只读取第一页
			XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(0);
			// Read the Row
			 for (int rowNum = 1; rowNum <= xssfSheet.getLastRowNum(); rowNum++) {
                 XSSFRow xssfRow = xssfSheet.getRow(rowNum);
                 if (xssfRow != null) {
                     info = new InterfaceInfo();
                     XSSFCell interfaceName = xssfRow.getCell(0);
                     XSSFCell interfaceType = xssfRow.getCell(1);
                     XSSFCell interfaceProtocol = xssfRow.getCell(2);
                     XSSFCell interfaceCnName = xssfRow.getCell(3);
                     XSSFCell requestUrlMock = xssfRow.getCell(4);
                     XSSFCell requestUrlReal = xssfRow.getCell(5);
                     XSSFCell status = xssfRow.getCell(6);
                     XSSFCell requestMsg = xssfRow.getCell(7);
                     XSSFCell messageType = xssfRow.getCell(8);
                     XSSFCell createMessage = xssfRow.getCell(9);
                     XSSFCell createScene = xssfRow.getCell(10);
                     
                     info.setInterfaceName(PublicExcelImportUtil.getValue(interfaceName));
                     info.setInterfaceType(PublicExcelImportUtil.getValue(interfaceType).toUpperCase());
                     info.setInterfaceProtocol(PublicExcelImportUtil.getValue(interfaceProtocol));
                     info.setInterfaceCnName(PublicExcelImportUtil.getValue(interfaceCnName));
                     info.setRequestUrlMock(PublicExcelImportUtil.getValue(requestUrlMock));
                     info.setRequestUrlReal(PublicExcelImportUtil.getValue(requestUrlReal));
                     info.setStatus(PublicExcelImportUtil.getValue(status));
                     info.setRequestMsg(PublicExcelImportUtil.getValue(requestMsg));
                     info.setMessageType(PublicExcelImportUtil.getValue(messageType).toUpperCase());
                     info.setCreateMessage(PublicExcelImportUtil.getValue(createMessage));
                     info.setCreateScene(PublicExcelImportUtil.getValue(createScene));
                     
                     infos.add(info);
                 }
             }
		}
		
		return infos;
        
	}
	
	
}
