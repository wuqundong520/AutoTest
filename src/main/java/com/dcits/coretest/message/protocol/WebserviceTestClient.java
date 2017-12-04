package com.dcits.coretest.message.protocol;

import java.util.HashMap;
import java.util.Map;

import javax.xml.namespace.QName;

import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.Options;
import org.apache.axis2.rpc.client.RPCServiceClient;

import com.dcits.business.message.bean.TestConfig;
import com.dcits.constant.MessageKeys;
import com.dcits.util.PracticalUtils;

public class WebserviceTestClient extends TestClient {

	@Override
	public Map<String, String> sendRequest(String requestUrl,
			String requestMessage, String callParameter, TestConfig config) {
		// TODO Auto-generated method stub
		Map<String, Object> callParameterMap = null;
		String username = null;
		String password = null;
		String namespace = "";
		String method = "";
		int connectTimeOut = 5000;
		try {
			callParameterMap = getCallParameter(callParameter);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		
		if (callParameterMap != null) {
			username = (String) callParameterMap.get(MessageKeys.PUBLIC_PARAMETER_USERNAME);
			password = (String) callParameterMap.get(MessageKeys.PUBLIC_PARAMETER_PASSWORD);
			namespace = (String) callParameterMap.get(MessageKeys.WEB_SERVICE_PARAMETER_NAMESPACE);
			method = (String) callParameterMap.get(MessageKeys.PUBLIC_PARAMETER_METHOD);
			connectTimeOut = (int)callParameterMap.get(MessageKeys.PUBLIC_PARAMETER_CONNECT_TIMEOUT);
		}
		
		String responseMessage = "";
		String useTime = "0";
		String statusCode = "200";
		String mark = "";
		
		try {
			long beginTime = System.currentTimeMillis();
			responseMessage = callService(requestUrl, requestMessage, namespace, method, connectTimeOut, username, password);
			long endTime = System.currentTimeMillis();
			useTime = String.valueOf(endTime - beginTime);			
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			statusCode = "false";
			mark = "Fail to call web-service url=" + requestUrl + ",namespace=" + namespace + ",method=" + method + "!";
		}
		Map<String, String> returnMap = new HashMap<String, String>();
		returnMap.put("responseMessage", responseMessage);
		returnMap.put("useTime", useTime);
		returnMap.put("statusCode", statusCode);
		returnMap.put("mark", mark);
		return returnMap;
	}

	@Override
	public boolean testInterface(String requestUrl) {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public void closeConnection() {
		// TODO Auto-generated method stub		
	}
	
	/****************************************************************************************************/
	/**
	 * 使用Axis2调用webservice<br>
	 * 使用RPC方式调用
	 * @param requestUrl
	 * @param request
	 * @param namespace
	 * @param method
	 * @param connectTimeOut
	 * @return
	 * @throws Exception 
	 */
	private String callService (String requestUrl, String request, String namespace, String method, long connectTimeOut, String username, String password) throws Exception {
		try {
			RPCServiceClient client = new RPCServiceClient();
			Options option = client.getOptions();

			// 指定调用的的wsdl地址
			//例如：http://ws.webxml.com.cn/WebServices/ChinaOpenFundWS.asmx?wsdl
			EndpointReference reference = new EndpointReference(requestUrl);
			option.setTo(reference);
			option.setTimeOutInMilliSeconds(connectTimeOut);
			
			if (PracticalUtils.isNormalString(username) && PracticalUtils.isNormalString(password)) {
				option.setUserName(username);
				option.setPassword(password);
			}

			/*
			 * 设置要调用的方法 
			 * http://ws.apache.org/axis2 为默认的（无package的情况）命名空间，
			 * 如果有包名，则为 http://axis2.webservice.elgin.com ,包名倒过来即可 
			 * method为方法名称
			 */
			QName qname = new QName(namespace, method);

			// 调用远程方法,并指定方法参数以及返回值类型
			Object[] result = client.invokeBlocking(qname,
					new Object[] { request }, new Class[] { String.class });
			return result[0].toString();
		} catch (Exception e) {
			// TODO: handle exception
			//e.printStackTrace();	
			LOGGER.debug("Fail to call web-service url=" + requestUrl + ",namespace=" + namespace + ",method=" + method + "!", e);
			throw e;
		}
				          
	}
}
