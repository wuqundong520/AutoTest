package com.dcits.business.system.bean;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.struts2.json.annotations.JSON;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.dcits.business.message.bean.SceneValidateRule;
import com.dcits.business.message.bean.TestConfig;
import com.dcits.business.user.bean.User;
import com.dcits.constant.GlobalVariableConstant;
import com.dcits.util.PracticalUtils;

/**
 * 
 * 全局变量表<br>
 * <strong>目前可使用的场景(有key值)：</strong><br>
 * 	1、所有字段的测试数据<br>
 * 	2、请求地址(报文中的mock/real/接口中定义的/测试集运行时配置中配置的自定义请求地址)<br>
 * 	3、接口参数中的默认值<br>
 * 	4、定时任务中的Cron表达式<br>
 *  5、关联验证中验证值<br>
 *  6、节点验证中验证值(取值方式为字符串、数据库时均有效)<br>
 *  7、全文验证中验证报文
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
	
	private ObjectMapper mapper = new ObjectMapper();
	
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
	 * <i>randomString</i> 	两个数字，第一位表示字符串长度，第二位表示组成：0-只有大写字母 1-只有小写字母  2-大小写字母混合 3-数字和字母
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
	
	@SuppressWarnings("unused")
	private String variableUseName;
	/**
	 * 变量创建失败原因
	 */
	private String createErrorInfo;
	
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
	
	public String getVariableUseName() {
		return GlobalVariableConstant.USE_VARIABLE_LEFT_BOUNDARY
				+ this.key + GlobalVariableConstant.USE_VARIABLE_RIGHT_BOUNDARY;
	}
	
	
	public void setCreateErrorInfo(String createErrorInfo) {
		this.createErrorInfo = createErrorInfo;
	}
	
	public String getCreateErrorInfo() {
		return createErrorInfo;
	}
	
	/**
	 * 将value的JSON转换成Map
	 * @return
	 * @throws IOException 
	 * @throws JsonMappingException 
	 * @throws JsonParseException 
	 */
	@SuppressWarnings("unchecked")
	public Map<String, String> parseJsonToMap() throws JsonParseException, JsonMappingException, IOException {
		return mapper.readValue(this.value, Map.class);
	}
	/**
	 * 根据类型与规则生成指定内容返回
	 * @return
	 */
	public Object createSettingValue () {
		try {
			switch (this.variableType) {
			case VARIABLE_TYPE_SET_RUNTIME_SETTING: //生成一个测试集运行时设定
				Map<String, String> maps = parseJsonToMap();
				TestConfig config = new TestConfig();
				config.setCheckDataFlag(maps.get(GlobalVariableConstant.SET_RUNTIME_SETTING_CHECK_DATA_FLAG));
				config.setConnectTimeOut(Integer.parseInt(maps.get(GlobalVariableConstant.SET_RUNTIME_SETTING_CONNECT_TIMEOUT)));
				config.setCustomRequestUrl(maps.get(GlobalVariableConstant.SET_RUNTIME_SETTING_CUSTOMR_EQUEST_URL));
				config.setReadTimeOut(Integer.parseInt(maps.get(GlobalVariableConstant.SET_RUNTIME_SETTING_READ_TIMEOUT)));
				config.setRequestUrlFlag(maps.get(GlobalVariableConstant.SET_RUNTIME_SETTING_REQUEST_URL_FLAG));
				config.setRetryCount(Integer.parseInt(maps.get(GlobalVariableConstant.SET_RUNTIME_SETTING_RETRY_COUNT)));
				config.setRunType(maps.get(GlobalVariableConstant.SET_RUNTIME_SETTING_RUN_TYPE));
				
				return config;
			case VARIABLE_TYPE_VALIDATE_RELATED_KEY_WORD://生成一个关联规则
				SceneValidateRule rule = new SceneValidateRule();
				Map<String, String> maps1 = parseJsonToMap();
				rule.setValidateValue(maps1.get(GlobalVariableConstant.RELATED_KEYWORD_VALIDATE_VALUE));
				maps1.remove(GlobalVariableConstant.RELATED_KEYWORD_VALIDATE_VALUE);
				rule.setParameterName(JSONObject.fromObject(maps1).toString());
				rule.setValidateMethodFlag("0");
				rule.setStatus("0");
				rule.setMark("模板创建的关联验证");
				return rule;
			case VARIABLE_TYPE_CALL_PARAMETER_HTTP:
			case VARIABLE_TYPE_CALL_PARAMETER_SOCKET:
			case VARIABLE_TYPE_CALL_PARAMETER_WEBSERVICE:			
			case VARIABLE_TYPE_CONSTANT:
				return this.value;
			case VARIABLE_TYPE_CURRENT_TIMESTAMP:
				return String.valueOf(System.currentTimeMillis());
			case VARIABLE_TYPE_DATETIME:
				return PracticalUtils.formatDate(parseJsonToMap().get(GlobalVariableConstant.DATETIME_FORMAT_ATTRIBUTE_NAME), new Date());
			case VARIABLE_TYPE_RANDOM_NUM:
				Map<String, String> params = parseJsonToMap();
				int min = Integer.parseInt(params.get(GlobalVariableConstant.RANDOM_MIN_NUM_ATTRIBUTE_NAME));
				int max = Integer.parseInt(params.get(GlobalVariableConstant.RANDOM_MAX_NUM_ATTRIBUTE_NAME));

				return String.valueOf(PracticalUtils.getRandomNum(max, min));
			case VARIABLE_TYPE_RANDOM_STRING:
				Map<String, String> params1 = parseJsonToMap();
				return PracticalUtils.createRandomString(params1.get(GlobalVariableConstant.RANDOM_STRING_MODE_ATTRIBUTE_NAME)
						, Integer.parseInt(params1.get(GlobalVariableConstant.RANDOM_STRING_NUM_ATTRIBUTE_NAME)));
			default:
				break;
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			createErrorInfo = e.getMessage();
		}
		
		
		return null;
	}
	
	/**
	 * 判断指定类型是否需要唯一的key
	 * @return
	 */
	public static boolean ifHasKey(String type) {
		if (VARIABLE_TYPE_CALL_PARAMETER_HTTP.equals(type) ||
				VARIABLE_TYPE_CALL_PARAMETER_SOCKET.equals(type) ||
				VARIABLE_TYPE_CALL_PARAMETER_WEBSERVICE.equals(type) ||
				VARIABLE_TYPE_SET_RUNTIME_SETTING.equals(type) ||
				VARIABLE_TYPE_VALIDATE_RELATED_KEY_WORD.equals(type)) {						
			return false;
		}
		return true;
	}
	
}
