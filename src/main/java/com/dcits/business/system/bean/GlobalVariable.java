package com.dcits.business.system.bean;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.dcits.business.user.bean.User;

/**
 * 
 * 全局变量表
 * @author xuwangcheng
 * @version 2017.11.29,1.0.0.0
 *
 */
public class GlobalVariable {
	
	public static final String VARIABLE_TYPE_CALL_PARAMETER_HTTP = "httpCallParameter";
	public static final String VARIABLE_TYPE_CALL_PARAMETER_SOCKET = "socketCallParameter";
	public static final String VARIABLE_TYPE_CALL_PARAMETER_WEBSERVICE = "webServiceCallParameter";
	public static final String VARIABLE_TYPE_VALIDATE_RELATED_KEY_WORD = "relatedKeyWord";
	public static final String VARIABLE_TYPE_SET_RUNTIME_SETTING = "setRuntimeSetting";
	public static final String VARIABLE_TYPE_CONSTANT = "constant";
	public static final String VARIABLE_TYPE_DATETIME = "datetime";
	public static final String VARIABLE_TYPE_RANDOM_NUM = "randomNum";
	public static final String VARIABLE_TYPE_CURRENT_TIMESTAMP = "currentTimestamp";
	public static final String VARIABLE_TYPE_RANDOM_STRING = "randomString";
	
	private Integer variableId;
	/**
	 * 自定义的名称<br>
	 * 例如：当前日期、正常号码1
	 */
	private String variableName;
	/**
	 * 变量类型,目前分为以下几种类型：<br>
	 * <strong>配置模板类型：</strong><br>
	 * <i>httpCallParameter</i> 	HTTP协议调用参数模板<br>
	 * <i>socketCallParameter</i> 	socket协议调用参数模板<br>
	 * <i>webServiceCallParameter</i> 	webService调用参数模板<br>
	 * <i>relatedKeyWord</i> 	验证规则中的关联设定模板<br>
	 * <i>setRuntimeSetting</i> 	测试集运行时配置模板<br>
	 * 
	 * <strong>可以使用的变量：</strong><br>
	 * <i>constant</i>  常量<br>
	 * <i>datetime</i> 	当前日期时间 <br>
	 * <i>randomNum</i> 	随机数,目前只能是整数<br>
	 * <i>currentTimestamp</i> 	当前时间戳，<br>
	 * <i>randomString</i> 	随机字母组成的字符串
	 * 
	 */
	private String variableType;
	/**
	 * 如果这个变量可以被使用,则需要设置key值<br>
	 * datetime、constant、randomNum类型
	 */
	private String key;
	/**
	 * 根据variableType的不同，该值表示含义不同<br>
	 * <i>datetime</i>  	该值为日期格式表达式：yyyy-MM-dd HH:mm:ss<br>
	 * <i>httpCallParameter/socketCallParameter/relatedKeyWord</i> 	对应模板的JSON字符串<br>
	 * <i>setRuntimeSetting</i> 	对应配置内容的JSON字符串<br>
	 * <i>constant</i> 	任何常量内容<br>
	 * <i>randomNum</i>  	两个数字，分别表示最小值，最大值，用逗号分隔<br>
	 * <i>currentTimestamp</i> 	为空<br>
	 * <i>randomString</i> 	两个数字，第一位表示字符串长度，第二位表示组成：0-只有大写字母 1-只有小写字母  3-大小写字母混合
	 * 
	 */
	private String value;
	/**
	 * 创建时间
	 */
	private Timestamp createTime;
	/**
	 * 创建人
	 */
	private User user;
	/**
	 * 备注
	 */
	private String mark;
	
	public GlobalVariable(String variableName, String variableType, String key,
			String value, Timestamp createTime, User user, String mark) {
		super();
		this.variableName = variableName;
		this.variableType = variableType;
		this.key = key;
		this.value = value;
		this.createTime = createTime;
		this.user = user;
		this.mark = mark;
	}

	public GlobalVariable() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Integer getVariableId() {
		return variableId;
	}

	public void setVariableId(Integer variableId) {
		this.variableId = variableId;
	}

	public String getVariableName() {
		return variableName;
	}

	public void setVariableName(String variableName) {
		this.variableName = variableName;
	}

	public String getVariableType() {
		return variableType;
	}

	public void setVariableType(String variableType) {
		this.variableType = variableType;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getMark() {
		return mark;
	}

	public void setMark(String mark) {
		this.mark = mark;
	}
	
	/**
	 * 根据类型与规则生成指定内容返回
	 * @return
	 */
	public String createSettingValue () {
		
		
		return null;
	}
	
}
