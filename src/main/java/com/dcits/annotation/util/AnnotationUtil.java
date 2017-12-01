package com.dcits.annotation.util;

import java.lang.reflect.Field;

import com.dcits.annotation.FieldNameMapper;

/**
 * 前台DataTables中表格列与后端实体类的字段映射
 * @author xuwangcheng
 * @version 2017.1.1,1.0.0.0
 *
 */
public class AnnotationUtil {
	
	/**
	 * 获取当前字段的真实查询名称(HQL中对应的)
	 * <br>查询该字段是否需要增加搜索条件
	 * @param clazz
	 * @param fieldName
	 * @param getType  0-查询展示字段名  1-查询排列字段
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static String getRealColumnName(Class clazz, String fieldName, int getType) {
		
		Field field = null;
		if (!isHaveField(clazz, fieldName)) {
			return "";
		}
		
		try {
			field = clazz.getDeclaredField(fieldName);
		} catch (NoSuchFieldException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//由于mysql中 Datetime字段不能通过like查询，目前暂时不对Datetime字段进行搜索
		if ((field.getType().getCanonicalName().equals("java.sql.Timestamp") 
				|| field.getType().getCanonicalName().equals("java.sql.Date")
				|| field.getType().getCanonicalName().equals("java.util.Timestamp")) && getType == 0) {				
			return "";
		}
		
		if (field.isAnnotationPresent(FieldNameMapper.class)) {
			FieldNameMapper fnp = field.getAnnotation(FieldNameMapper.class);
			if (!fnp.fieldPath().isEmpty()) {
				if (getType == 1 || (getType == 0 && fnp.ifSearch())) {
					return fnp.fieldPath();
				} else {
					return "";
				}
	
			}	
			if (getType == 0 && !fnp.ifSearch()) {
				return "";
			}
		}
		
		return fieldName;
	}
	
	@SuppressWarnings("rawtypes")
	private static boolean isHaveField(Class clazz, String fieldName) {
		for (Field f:clazz.getDeclaredFields()) {
			if (f.getName().equals(fieldName)) {
				return true;
			}
		}
		
		return false;
	}
}
