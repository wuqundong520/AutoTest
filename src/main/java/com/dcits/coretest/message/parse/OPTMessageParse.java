package com.dcits.coretest.message.parse;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.dcits.business.message.bean.ComplexParameter;
import com.dcits.business.message.bean.Parameter;
import com.dcits.business.message.service.ParameterService;
import com.dcits.util.StrutsUtils;


/**
 * 自定义报文
 * <br>无限定报文，针对于目前无法识别的格式报文，报文不做任何验证
 * @author xuwangcheng
 * @version 1.0.0.0, 20171030
 *
 */
public class OPTMessageParse extends FixedMessageParse {

	@Override
	public String checkParameterValidity(List<Parameter> params, String message) {
		// TODO Auto-generated method stub
		return "true";
	}
	
	@Override
	public ComplexParameter parseMessageToObject(String message,
			List<Parameter> params) {
		// TODO Auto-generated method stub
		ParameterService ps = (ParameterService) StrutsUtils.getSpringBean("parameterService");
		int pid = ps.save(new Parameter(message, "name", "defaultValue", "path", "String"));
		return new ComplexParameter(new Parameter(pid), null, null);
	}

	@Override
	public String depacketizeMessageToString(ComplexParameter complexParameter,
			String paramsData) {
		// TODO Auto-generated method stub
		if (StringUtils.isNotEmpty(paramsData)) {
			Map<String, Object> params = parseParamsDataToMap(paramsData);
			
			for (Object o:params.values()) {
				return o.toString();
			}
		}
		
		return complexParameter.getSelfParameter().getParameterIdentify();
	}
	
}
