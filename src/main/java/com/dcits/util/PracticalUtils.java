package com.dcits.util;

import java.io.InputStream;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Scanner;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpRequestBase;

import com.dcits.business.message.bean.TestReport;
import com.dcits.business.message.bean.TestResult;
import com.dcits.business.system.bean.GlobalVariable;
import com.dcits.business.system.service.GlobalVariableService;
import com.dcits.coretest.message.protocol.HTTPTestClient;
import com.dcits.util.message.JsonUtil;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

/**
 * 实用小工具类
 * 
 * @author xuwangcheng
 * @version 1.0.0.0,2017.2.14
 */
public class PracticalUtils {

	public static final String DEFAULT_DATE_PATTERN = "HH:mm:ss";
	public static final String FULL_DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";

	private PracticalUtils() {
		throw new Error("Please don't instantiate me！");
	}

	/**
	 * 格式化美化json串 同样可以 用此方法判断是否为json格式
	 * 
	 * @param uglyJSONString
	 * @return
	 */
	public static String formatJsonStr(String uglyJSONString) {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		JsonParser jp = new JsonParser();
		try {
			JsonElement je = jp.parse(uglyJSONString);
			String prettyJsonString = gson.toJson(je);
			return prettyJsonString;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	/**
	 * 判断字符串是否为数字
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNumeric(Object str) {
		if (str == null) {
			return false;
		}
		Pattern pattern = Pattern.compile("[0-9].*");
		Matcher isNum = pattern.matcher(str.toString());
		if (!isNum.matches()) {
			return false;
		}
		return true;
	}

	/**
	 * arrayList的toString工具
	 * 
	 * @param list
	 * @return
	 */
	public static String arrayListToString(ArrayList<String> list) {
		StringBuffer returnStrs = new StringBuffer();
		for (String s : list) {
			returnStrs.append("[" + s + "]");
		}
		return returnStrs.toString();
	}

	/**
	 * 删除指定字符串中的指定字符
	 * 
	 * @param s
	 *            要操作的字符串
	 * @param string
	 *            要删除的字符
	 * @param i
	 *            删除第几个
	 * @return
	 */
	public static String removeChar(String s, String string, int i) {
		if (i == 1) {

			int j = s.indexOf(string);
			s = s.substring(0, j) + s.substring(j + 1);
			i--;
			return s;

		} else {

			int j = s.indexOf(string);
			i--;
			return s.substring(0, j + 1)
					+ removeChar(s.substring(j + 1), string, i);
		}
	}

	/**
	 * 替换sql中需要替换的参数 参数格式 <参数名> Web自动化测试中使用的
	 * 
	 * @param sqlStr
	 * @param map
	 * @return
	 */
	public static String replaceSqlStr(String sqlStr, Map<String, Object> map) {

		String regex = "(<[a-zA-Z0-9]*>)";
		Pattern pattern = Pattern.compile(regex);
		List<String> regStrs = new ArrayList<String>();
		Matcher matcher = pattern.matcher(sqlStr);// 匹配类

		while (matcher.find()) {
			regStrs.add(matcher.group());
		}
		for (String s : regStrs) {
			if (map.get(s) != null) {
				sqlStr = sqlStr.replaceAll(s, (String) map.get(s));
			}
		}
		return sqlStr;
	}

	/**
	 * 替换sql语句中的参数 参数格式 <节点名称或者路径> 接口自动化中使用的
	 * 
	 * @param sqlStr
	 * @param requestMap
	 *            入参报文中所有节点名集合
	 * @param requestJson
	 *            请求入参报文
	 * @return
	 */
	public static String replaceSqlStr(String sqlStr,
			Map<String, String> requestMap, String requestJson) {
		String regex = "(<[a-zA-Z0-9_.]*>)";
		Pattern pattern = Pattern.compile(regex);
		List<String> regStrs = new ArrayList<String>();
		Matcher matcher = pattern.matcher(sqlStr);

		while (matcher.find()) {
			regStrs.add(matcher.group());
		}
		for (String s : regStrs) {
			String regS = s.substring(1, s.length() - 1);
			if (s.indexOf(".") != -1) {
				regS = JsonUtil.getObjectByJson(requestJson, regS,
						JsonUtil.TypeEnum.string);
				if (regS != null) {
					sqlStr = sqlStr.replaceAll(s, regS);
				}
			} else {
				if (requestMap.get(regS) != null) {
					sqlStr = sqlStr.replaceAll(s, requestMap.get(regS));
				}
			}
		}
		return sqlStr;
	}

	/**
	 * 时间格式化
	 * 
	 * @param fromat
	 * @param date
	 * @return
	 */
	public static String formatDate(String fromat, Date date) {
		DateFormat dateFormat = new SimpleDateFormat(fromat);
		return dateFormat.format(date);
	}

	/**
	 * 是否为正常字符串，不为null并且不为空
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNormalString(String str) {
		if (str == null || str.isEmpty()) {
			return false;
		}
		return true;
	}

	/**
	 * 生成用户登录标识
	 * 
	 * @param password
	 * @return
	 * @throws NoSuchAlgorithmException
	 */
	public static String createUserLoginIdentification(String password)
			throws NoSuchAlgorithmException {
		return MD5Util.code(password + System.currentTimeMillis());
	}

	/**
	 * 生成静态报告文件
	 * 
	 * @param report
	 * @param title
	 *            html标题
	 * @param successRate
	 *            成功率
	 * @return 返回生成的html部分
	 */
	public static StringBuilder createReport(TestReport report, String title,
			String successRate) {
		StringBuilder str = new StringBuilder();
		Set<TestResult> results = report.getTrs();

		str.append("<div class=\"panel-heading\">")
				.append(title)
				.append("</div>")
				.append("<div class=\"panel-body text-left\"><div class=\"row\"><div class=\"col-sm-6\"><span>测试场景数:</span>&nbsp;&nbsp;<span id=\"sceneNum\">")
				.append(report.getSceneNum())
				.append("</span></div><div class=\"col-sm-6\"><span>执&nbsp;行&nbsp;日&nbsp;期:</span>&nbsp;&nbsp;<span id=\"testDate\">")
				.append(report.getCreateTime())
				.append("</span></div></div><div class=\"row\"><div class=\"col-sm-6\"><span>执行成功数:</span>&nbsp;&nbsp;<span id=\"successNum\">")
				.append(report.getSuccessNum())
				.append("</span></div><div class=\"col-sm-6\"><span>异常中断数:</span>&nbsp;&nbsp;<span id=\"stopNum\">")
				.append(report.getStopNum())
				.append("</span></div></div><div class=\"row\"><div class=\"col-sm-6\"><span>执行失败数:</span>&nbsp;&nbsp;<span id=\"failNum\">")
				.append(report.getFailNum())
				.append("</span></div><div class=\"col-sm-6\"><span>测试成功率:</span>&nbsp;&nbsp;<span id=\"successRate\">")
				.append(successRate)
				.append("</span>%</div></div><hr><table class=\"table table-hover\"><thead><tr><th>接口</th><th>协议</th><th>报文</th><th>场景</th><th>状态</th><th>耗时(ms)</th></tr></thead><tbody>");

		int count = 0;
		for (TestResult result : results) {
			str.append("<tr id=\"" + count + "\" class=\"result-view\">");
			String[] infos = result.getMessageInfo().split(",");
			str.append("<td>" + infos[0] + "</td>")
					.append("<td>" + result.getProtocolType() + "</td>")
					.append("<td>" + infos[1] + "</td>")
					.append("<td>" + infos[2] + "</td>")
					.append("<td class=\"status\" style=\"display:table-cell; vertical-align:middle;\"><span class=\"label label-");

			switch (result.getRunStatus()) {
			case "0":
				str.append("success\">Success");
				break;
			case "1":
				str.append("danger\">Fail");
				break;
			case "2":
				str.append("default\">Stop");
				break;
			default:
				break;
			}

			str.append("</span></td><td>" + result.getUseTime() + "</td></tr>");

			// 详情显示
			str.append(
					"<tr class=\"hidden\"><td colspan=\"6\"><div class=\"view-details\"><div class=\"row\"><div class=\"col-sm-3\"><strong>请求地址:</strong></div><div class=\"col-sm-9\">")
					.append(result.getRequestUrl())
					.append("</div></div><br><div class=\"row\"><div class=\"col-sm-3\"><strong>请求返回码:</strong></div><div class=\"col-sm-9\">")
					.append(result.getStatusCode())
					.append("</div></div><br/><div class=\"row\"><div class=\"col-sm-3\"><strong>入参报文:</strong></div><div class=\"col-sm-9\"><textarea class=\"form-control\" cols=\"30\" rows=\"8\">")
					.append(result.getRequestMessage())
					.append("</textarea></div></div><br/><div class=\"row\"><div class=\"col-sm-3\"><strong>出参报文:</strong></div><div class=\"col-sm-9\"><textarea name=\"\" class=\"form-control\" cols=\"30\" rows=\"8\">")
					.append(result.getResponseMessage() == null ? "" : result
							.getResponseMessage())
					.append("</textarea></div></div><br/><div class=\"row\"><div class=\"col-sm-3\"><strong>备注:</strong></div><div class=\"col-sm-9\"> <textarea name=\"\" class=\"form-control\" cols=\"30\" rows=\"4\">")
					.append(result.getMark() == null ? "" : result.getMark())
					.append("</textarea></div></div></div></td></tr>");

			count++;
		}

		str.append("</tbody></table></div><div class=\"panel-footer\">神州数码系统集成服务有限公司@2016-2017 Created by 性能测试团队 </div></div></div></body></html>");
		return str;
	}

	/**
	 * 获取当天零点时间
	 * 
	 * @return
	 */
	public static Date getTodayZeroTime() {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		Date zero = calendar.getTime();
		return zero;
	}

	/**
	 * 获取昨天零点时间
	 * 
	 * @return 昨天零点时间戳
	 */
	public static Date getYesterdayZeroTime() {
		Date date = new Date();
		GregorianCalendar gc = new GregorianCalendar();
		gc.setTime(date);
		if ((gc.get(GregorianCalendar.HOUR_OF_DAY) == 0)
				&& (gc.get(GregorianCalendar.MINUTE) == 0)
				&& (gc.get(GregorianCalendar.SECOND) == 0)) {
			return new Date(date.getTime() - (24 * 60 * 60 * 1000));
		} else {
			Date date2 = new Date(date.getTime()
					- gc.get(GregorianCalendar.HOUR_OF_DAY) * 60 * 60 * 1000
					- gc.get(GregorianCalendar.MINUTE) * 60 * 1000
					- gc.get(GregorianCalendar.SECOND) * 1000 - 24 * 60 * 60
					* 1000);
			return date2;
		}
	}

	/**
	 * 获取当月第一天零点时刻
	 * 
	 * @return
	 */
	public static Date getThisMonthFirstDayZeroTime() {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, 0);
		c.set(Calendar.DAY_OF_MONTH, 1);// 设置为1号,当前日期既为本月第一天
		// 将小时至0
		c.set(Calendar.HOUR_OF_DAY, 0);
		// 将分钟至0
		c.set(Calendar.MINUTE, 0);
		// 将秒至0
		c.set(Calendar.SECOND, 0);
		// 将毫秒至0
		c.set(Calendar.MILLISECOND, 0);
		// 获取本月第一天的时间戳
		return c.getTime();
	}

	/**
	 * 获取本周第一天零点时刻
	 * 
	 * @return
	 */
	public static Date getThisWeekFirstDayZeroTime() {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		return cal.getTime();
	}

	/**
	 * 生成随机字符串
	 * 
	 * @param mode
	 *            模式 0-只包含大写字母 1-只包含小写字母 2-包含大小写字母 3-包含字母数字
	 * @param length
	 *            字符串长度
	 * @return
	 */
	public static String createRandomString(String mode, int length) {
		// 小写字母0-25 大写字母26-51 数字52-61
		String str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		int count = 0;
		StringBuilder randomStr = new StringBuilder();
		while (count < length) {
			count++;
			switch (mode) {
			case "0":
				randomStr.append(str.charAt(getRandomNum(51, 26)));
				break;
			case "1":
				randomStr.append(str.charAt(getRandomNum(25, 0)));
				break;
			case "2":
				randomStr.append(str.charAt(getRandomNum(51, 0)));
				break;
			case "3":
				randomStr.append(str.charAt(getRandomNum(61, 0)));
				break;
			default:
				break;
			}
		}
		return randomStr.toString();

	}

	/**
	 * 获取随机数
	 * 
	 * @param max
	 *            最大值
	 * @param min
	 *            最小值
	 * @return
	 */
	public static int getRandomNum(int max, int min) {
		Random ran = new Random();
		return ran.nextInt(max) % (max - min + 1) + min;
	}

	/**
	 * 替换报文入参中的全局变量
	 * 
	 * @param msg
	 * @param globalVariableService
	 * @return
	 */
	public static String replaceGlobalVariable(String msg,
			GlobalVariableService globalVariableService) {
		String regex = "\\$\\{__(.*?)\\}";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(msg);
		GlobalVariable variable = null;
		String useVariable = null;
		while (matcher.find()) {
			useVariable = "\\$\\{__" + matcher.group(1) + "\\}";
			if (!msg.contains("${__" + matcher.group(1) + "}")) {
				continue;
			}
			variable = globalVariableService.findByKey(matcher.group(1));
			if (variable == null) {
				continue;
			}
			msg = msg.replaceAll(useVariable,
					String.valueOf(variable.createSettingValue()));
		}
		return msg;
	}

	/**
	 * 发送http请求-get方式
	 * 
	 * @return
	 */
	@SuppressWarnings("resource")
	public static String doGetHttpRequest(String requestUrl) {
		HTTPTestClient client = new HTTPTestClient();
		HttpRequestBase request = null;
		try {
			Object[] responseContext = client.doGet(requestUrl, null, null);
			HttpResponse response = (HttpResponse) responseContext[0];
			request = (HttpRequestBase) responseContext[2];

			StringBuilder returnMsg = new StringBuilder();
			InputStream is = response.getEntity().getContent();
			Scanner scan = new Scanner(is, "UTF-8");
			while (scan.hasNext()) {
				returnMsg.append(scan.nextLine());
			}

			return returnMsg.toString();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return e.getMessage();
		} finally {
			if (request != null) {
				request.releaseConnection();
			}
		}
	}

	public static void main(String[] args) {
		System.out.println(createRandomString("3", 20));
	}

}
