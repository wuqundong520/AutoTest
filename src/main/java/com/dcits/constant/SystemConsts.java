package com.dcits.constant;

import com.dcits.util.MD5Util;



/**
 * 系统相关常量
 * @author xuwangcheng
 * @version 1.0.0.0,2017.2.13
 */
public class SystemConsts {
	
	/**
	 * 默认admin角色的roleId
	 */
	public static final Integer ADMIN_ROLE_ID = 1;
	
	/**
	 * 默认default角色的roleId
	 */
	public static final Integer DEFAULT_ROLE_ID = 3;
	
	/**
	 * 默认ADMIN账户的用户ID
	 */
	public static final Integer ADMIN_USER_ID = 1;
	
	public static final String REQUEST_ALLOW_TOOKEN = "ec189a1731d73dfe16d8f9df16d67187";
	
	
	/**
	 * 管理角色名
	 * 
	 */
	public static final String SYSTEM_ADMINISTRATOR_ROLE_NAME = "admin";
	
	
	 //操作接口类型ID

	/**
	 * 接口自动化操作接口类型id
	 */
	public static final Integer MESSAGE_OP_ID = 2;
	
	/**
	 * 系统设置操作接口类型id
	 */
	public static final Integer SYSTEM_OP_ID = 13;
	
	/**
	 * 用户角色操作接口id
	 */
	public static final Integer USER_OP_ID = 19;
	
	/**
	 * web自动化操作接口id
	 */
	public static final Integer WEB_OP_ID = 85;
	
	/**
	 * app自动化操作接口id
	 */
	public static final Integer APP_OP_ID = 100;
	
	//指定result name
	/**
	 * 用户未登陆
	 */
	public static final String RESULT_NOT_LOGIN = "usernotlogin";
	
	/**
	 * 操作接口不可用
	 */
	public static final String RESULT_DISABLE_OP = "opisdisable";
	
	/**
	 * 没有权限
	 */
	public static final String RESULT_NO_POWER = "usernotpower";
	
	/**
	 * 不存在的请求接口
	 */
	public static final String RESULT_NON_EXISTENT_OP = "opnotfound"; 
	
	//特殊参数的id
	//数组中的数组参数对象
	public static final Integer PARAMETER_ARRAY_IN_ARRAY_ID = 2;
	//数组中的Map参数对象
	public static final Integer PARAMETER_MAP_IN_ARRAY_ID = 3;
	//Object对象 对应外层
	public static final Integer PARAMETER_OBJECT_ID = 1;
	
	//ApplicationMap中指定属性名	
	public static final String APPLICATION_ATTRIBUTE_QUERY_DB = "queryDb";
	
	public static final String APPLICATION_ATTRIBUTE_WEB_SETTING = "settingMap";
	
	public static final String APPLICATION_ATTRIBUTE_OPERATION_INTERFACE = "ops";
	
	//定时任务相关标志词语	
	public static final String QUARTZ_TASK_NAME_PREFIX_KEY = "scheduleJob";
	
	public static final String QUARTZ_SCHEDULER_START_FLAG = "quartzStatus";
	
	public static final String QUARTZ_SCHEDULER_IS_START = "true"; 
	
	public static final String QUARTZ_SCHEDULER_IS_STOP = "false";
	
	
	//全局设置指定设置名称
	public static final String GLOBAL_SETTING_HOME = "home";
	
	public static final String GLOBAL_SETTING_NOTICE = "notice";
	
	public static final String GLOBAL_SETTING_VERSION = "version";
	
	public static final String GLOBAL_SETTING_STATUS = "status";
	
	public static final String GLOBAL_SETTING_LOGSWITCH = "logSwitch";
	
	public static final String GLOBAL_SETTING_MESSAGE_ENCODING = "messageEncoding";
	
	public static final String GLOBAL_SETTING_IF_SEND_REPORT_MAIL = "sendReportMail";
	public static final String GLOBAL_SETTING_MAIL_SERVER_HOST = "mailHost";
	public static final String GLOBAL_SETTING_MAIL_SERVER_PORT = "mailPort";
	public static final String GLOBAL_SETTING_MAIL_AUTH_USERNAME = "mailUsername";
	public static final String GLOBAL_SETTING_MAIL_AUTH_PASSWORD = "mailPassword";
	public static final String GLOBAL_SETTING_MAIL_RECEIVE_ADDRESS = "mailReceiveAddress";
	public static final String GLOBAL_SETTING_MAIL_COPY_ADDRESS = "mailCopyAddress";
	public static final String GLOBAL_SETTING_MAIL_SSL_FLAG = "mailSSL";
	
	//测试报告静态html存储文件夹
	public static final String REPORT_VIEW_HTML_FOLDER = "reportHtml";
	public static final String REPORT_VIEW_HTML_FIXED_HTML = "viewTemplate.xml";
	
	//测试集测试请求地址
	public static final String AUTO_TASK_TEST_RMI_URL = "test-scenesTest";
	
	//生成静态报告请求地址
	public static final String CREATE_STATIC_REPORT_HTML_RMI_URL = "report-generateStaticReportHtml";
	
	//上传或者下载 excel保存的文件夹
	public static final String EXCEL_FILE_FOLDER = "excel";
	

}
