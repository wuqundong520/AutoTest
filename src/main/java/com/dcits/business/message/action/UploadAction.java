package com.dcits.business.message.action;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.json.annotations.JSON;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.dcits.constant.ReturnCodeConsts;
import com.dcits.util.upload.Upload;
import com.opensymphony.xwork2.ActionSupport;

/**
 * 文件上传Action
 * @author xuwangcheng
 * @version 20171205,1.0.0.0
 *
 */
@Controller
@Scope("prototype")
public class UploadAction extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Map<String,Object> jsonMap = new HashMap<String,Object>();
	
	private File file;
    
    //提交过来的file的名字
    private String fileFileName;
    
    //提交过来的file的MIME类型
    private String fileFileContentType;
    
    public String upload() {
    	int returnCode = ReturnCodeConsts.SUCCESS_CODE;
    	String msg = "文件上传成功!";
    	
    	if (file == null) {
    		returnCode = ReturnCodeConsts.NO_FILE_UPLOAD_CODE;
    		msg = "未发现上传的文件!";
    	} else {
    		String fps = Upload.singleUpload(file, this.getFileFileName());
    		
    		if (fps == null) {
    			returnCode = ReturnCodeConsts.SYSTEM_ERROR_CODE;
        		msg = "上传文件失败,请重试!";
    		} 
    		
    		jsonMap.put("path", fps);
    	}
    	
    	
    	jsonMap.put("msg", msg);
    	jsonMap.put("returnCode", returnCode);
    	return SUCCESS;
    }
    
    
    
    
    
    public Map<String, Object> getJsonMap() {
		return jsonMap;
	}
    
    public void setFile(File file) {
		this.file = file;
	}
	
	public void setFileFileName(String fileFileName) {
		this.fileFileName = fileFileName;
	}
	
	public void setFileFileContentType(String fileFileContentType) {
		this.fileFileContentType = fileFileContentType;
	}
	
	@JSON(serialize=false)
	public File getFile() {
		return file;
	}
	
	@JSON(serialize=false)
	public String getFileFileName() {
		return fileFileName;
	}
	@JSON(serialize=false)
	public String getFileFileContentType() {
		return fileFileContentType;
	}
	
}
