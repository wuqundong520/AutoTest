package com.dcits.coretest.message.parse;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.dcits.business.message.bean.ComplexParameter;
import com.dcits.business.message.bean.Parameter;

/**
 * 固定报文
 * <br>针对于目前无法识别的格式报文，报文固定
 * @author xuwangcheng
 * @version 1.0.0.0, 20171030
 *
 */
public class FixedMessageParse extends MessageParse {

	@Override
	public boolean messageFormatValidation(String message) {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public Set<Parameter> importMessageToParameter(String message,
			Set<Parameter> existParams) {
		// TODO Auto-generated method stub
		Set<Parameter> params = new HashSet<Parameter>();
		Parameter param = new Parameter(message, "name", "defaultValue", "path", "String");
		if (validateRepeatabilityParameter(existParams, param)) {
			params.add(param);
		}
		return params;
	}

	@Override
	public ComplexParameter parseMessageToObject(String message,
			List<Parameter> params) {
		// TODO Auto-generated method stub
		return new ComplexParameter(params.get(0), null, null);
	}

	@Override
	public String depacketizeMessageToString(ComplexParameter complexParameter,
			String paramsData) {
		// TODO Auto-generated method stub
		Parameter param = complexParameter.getSelfParameter();
		return param.getParameterIdentify();
	}

	@Override
	public String checkParameterValidity(List<Parameter> params, String message) {
		// TODO Auto-generated method stub
		
		for (Parameter p:params) {
			if (message.equals(p.getParameterIdentify())) {
				return "true";
			}
		}
		
		return "报文已固定为：<br>" + params.get(0).getParameterIdentify();
	}

	@Override
	public String getObjectByPath(String message, String path) {
		// TODO Auto-generated method stub
		return message;
	}

}
