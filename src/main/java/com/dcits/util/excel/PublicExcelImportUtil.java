package com.dcits.util.excel;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCell;

public class PublicExcelImportUtil {

	 /**
    * 获取文件扩展名
    * @param path
    * @return String
    * @author zhang 2015-08-17 23:26
    */
	public static String getExt(String path) {
       if (path == null || path.equals("") || !path.contains(".")) {
           return null;
       } else {
           return path.substring(path.lastIndexOf(".") + 1, path.length());
       }
   }
	
	/**
    * 判断后缀为xlsx的excel文件的数据类型
    * @param xssfRow
    * @return String
    * @author zhang 2015-08-18 00:12
    */
   public static String getValue(XSSFCell xssfRow) {
	   if (xssfRow == null) {
		   return "";
	   }
       if (xssfRow.getCellType() == xssfRow.CELL_TYPE_BOOLEAN) {
           return String.valueOf(xssfRow.getBooleanCellValue());
       } else if (xssfRow.getCellType() == xssfRow.CELL_TYPE_NUMERIC) {
           return String.valueOf(xssfRow.getNumericCellValue());
       } else {
           return String.valueOf(xssfRow.getStringCellValue());
       }
   }

   /**
    * 判断后缀为xls的excel文件的数据类型
    * @param hssfCell
    * @return String
    * @author zhang 2015-08-18 00:12
    */
   public static String getValue(HSSFCell hssfCell) {
	   if (hssfCell == null) {
		   return "";
	   }
       if (hssfCell.getCellType() == hssfCell.CELL_TYPE_BOOLEAN) {
           return String.valueOf(hssfCell.getBooleanCellValue());
       } else if (hssfCell.getCellType() == hssfCell.CELL_TYPE_NUMERIC) {
           return String.valueOf(hssfCell.getNumericCellValue());
       } else {
           return String.valueOf(hssfCell.getStringCellValue());
       }
   }
}
