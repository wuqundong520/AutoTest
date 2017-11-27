package com.dcits.util;

import java.util.HashMap;
import java.util.Map;

import com.dcits.business.base.service.BaseService;
import com.dcits.business.system.bean.DataDB;
import com.dcits.business.system.bean.GlobalSetting;
import com.dcits.util.bean.StatisticalQuantity;

/**
 * web相关的一些配置数据以及全局数据
 * @author xuwangcheng
 * @version 2017.11.17,1.0.0
 *
 */
public class SettingUtil {
	
	/**
	 * 全局设置
	 */
	private static Map<String,GlobalSetting> settingMap;
	/**
	 * 测试统计
	 */
	private static Map<String, StatisticalQuantity> statistics = new HashMap<String, StatisticalQuantity>();
	
	public static final String STATISTICAL_QUANTITY_INTERFACE_NAME = "interfaceInfo";
	
	public static final String STATISTICAL_QUANTITY_MESSAGE_NAME = "message";
	
	public static final String STATISTICAL_QUANTITY_SCENE_NAME = "messageScene";
	
	public static final String STATISTICAL_QUANTITY_SET_NAME = "testSet";
	
	public static final String STATISTICAL_QUANTITY_REPORT_NAME = "testReport";
	
	/**
	 * 查询用数据库
	 */
	private static Map<String, DataDB> queryDBMap;
	
	static {
		statistics.put(STATISTICAL_QUANTITY_INTERFACE_NAME, new StatisticalQuantity(STATISTICAL_QUANTITY_INTERFACE_NAME));
		statistics.put(STATISTICAL_QUANTITY_MESSAGE_NAME, new StatisticalQuantity(STATISTICAL_QUANTITY_MESSAGE_NAME));
		statistics.put(STATISTICAL_QUANTITY_SCENE_NAME, new StatisticalQuantity(STATISTICAL_QUANTITY_SCENE_NAME));
		statistics.put(STATISTICAL_QUANTITY_SET_NAME, new StatisticalQuantity(STATISTICAL_QUANTITY_SET_NAME));
		statistics.put(STATISTICAL_QUANTITY_REPORT_NAME, new StatisticalQuantity(STATISTICAL_QUANTITY_REPORT_NAME));
	}
	
	
	@SuppressWarnings("rawtypes")
	public static Map<String, StatisticalQuantity> countStatistics () {
		for (StatisticalQuantity sl:statistics.values()) {
			BaseService service = (BaseService) StrutsUtils.getSpringBean(sl.getItemName() + "Service");
			sl.setTotalCount(service.totalCount());
			sl.setTodayCount(service.countByTime(PracticalUtils.getTodayZeroTime()));
			sl.setYesterdayCount(service.countByTime(PracticalUtils.getYesterdayZeroTime(), PracticalUtils.getTodayZeroTime()));
			sl.setThisWeekCount(service.countByTime(PracticalUtils.getThisWeekFirstDayZeroTime()));
			sl.setThisMonthCount(service.countByTime(PracticalUtils.getThisMonthFirstDayZeroTime()));
		}
		
		return statistics;
	}
	
	public static void setQueryDBMap(Map<String, DataDB> queryDBMap) {
		SettingUtil.queryDBMap = queryDBMap;
	}
	
	/**
	 * 获取查询数据库信息列表
	 * @return
	 */
	public static Map<String, DataDB> getQueryDBMap() {
		return queryDBMap;
	}
	
	/**
	 * 有新增、删除、修改时更新此MAP
	 */
	public static void updateQueryDBMap() {
		
	}
	
	/**
	 * 获取全局设置项
	 * @return
	 */
	public static Map<String,GlobalSetting> getGlobalSettingMap () {
		return settingMap;
	}
	
	public static void setSettingMap(Map<String, GlobalSetting> settingMap) {
		SettingUtil.settingMap = settingMap;
	}
	
	/**
	 * 获取指定名称的全局设置项
	 * @param settingName
	 * @return
	 */
	public static String getSettingValue (String settingName) {
		GlobalSetting setting = settingMap.get(settingName);
		if (setting != null) {
			return setting.getSettingValue() == null ? setting.getDefaultValue() : setting.getSettingValue();
		}
		return "";
	}
	
	/**
	 * 更新内存中的指定全局设置项的值
	 * @param settingName
	 * @param settingValue
	 */
	public static void updateGlobalSettingValue(String settingName, String settingValue) {
		for (GlobalSetting setting:settingMap.values()) {
			if (setting.getSettingName().equals(settingName)) {
				setting.setSettingValue(settingValue);
			}
		}
	}
}
