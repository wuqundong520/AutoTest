package com.dcits.business.message.bean;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.json.annotations.JSON;

import com.dcits.annotation.FieldNameMapper;

/**
 * 测试集中的组合场景
 * @author xuwangcheng
 * @version 2017.11.23,1.0.0.0
 *
 */
public class ComplexSetScene  implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	
	/**
	 * 组合场景组成的新场景名称
	 */
	private String complexSceneName;
	/**
	 * 包含的场景<br>
	 * 使用messageSceneId保存，逗号分隔，保存的顺序即为执行顺序
	 */
	private String scenes;
	/**
	 * 变量保存列表<br>使用json串保存
	 * <br>
	 * {"id":{"NODE_PATH":"Variable_Name"}}
	 * <br><br>
	 * id - 场景的ID<br>
	 * NODE_PATH - 场景返回出参节点名称<br>
	 * Variable_Name - 保存的变量命名
	 */
	private String saveVariables;
	
	/**
	 * 变量替换列表<br>使用json串保存
	 * <br>
	 * {"id":{"NODE_PATH":"Variable_Name"}}
	 * <br><br>
	 * id - 场景的ID<br>
	 * NODE_PATH - 场景入参节点名称<br>
	 * Variable_Name - 使用此变量替换上的节点值,如果不存在，则使用测试数据的值
	 * <br>
	 * 保证需要用的变量在使用之前就已经获取到了。关注各个场景的执行顺序
	 */
	private String useVariables;
	
	/**
	 * 所属测试集
	 */
	private TestSet testSet;
	
	/**
	 * 创建时间
	 */
	private Timestamp createTime;
	/**
	 * 备注
	 */
	private String mark;

	/**
	 * 场景个数
	 */
	@FieldNameMapper("length(scenes)")
	private Integer scenesNum;
	
	public ComplexSetScene() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ComplexSetScene(Integer id, String complexSceneName, String scenes,
			String saveVariables, String useVariables, TestSet testSet,
			Timestamp createTime, String mark) {
		super();
		this.id = id;
		this.complexSceneName = complexSceneName;
		this.scenes = scenes;
		this.saveVariables = saveVariables;
		this.useVariables = useVariables;
		this.testSet = testSet;
		this.createTime = createTime;
		this.mark = mark;
	}

	public ComplexSetScene(String complexSceneName, String scenes,
			String saveVariables, String useVariables, TestSet testSet,
			Timestamp createTime, String mark) {
		super();
		this.complexSceneName = complexSceneName;
		this.scenes = scenes;
		this.saveVariables = saveVariables;
		this.useVariables = useVariables;
		this.testSet = testSet;
		this.createTime = createTime;
		this.mark = mark;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	
	public Integer getScenesNum() {
		if (StringUtils.isEmpty(scenes)) {
			return 0;
		}
		return scenes.split(",").length;
	}
	
	public String getComplexSceneName() {
		return complexSceneName;
	}

	public void setComplexSceneName(String complexSceneName) {
		this.complexSceneName = complexSceneName;
	}

	public String getScenes() {
		return scenes;
	}

	public void setScenes(String scenes) {
		this.scenes = scenes;
	}

	public String getSaveVariables() {
		return saveVariables;
	}

	public void setSaveVariables(String saveVariables) {
		this.saveVariables = saveVariables;
	}

	public String getUseVariables() {
		return useVariables;
	}

	public void setUseVariables(String useVariables) {
		this.useVariables = useVariables;
	}
	@JSON(serialize=false)
	public TestSet getTestSet() {
		return testSet;
	}

	public void setTestSet(TestSet testSet) {
		this.testSet = testSet;
	}
	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getMark() {
		return mark;
	}

	public void setMark(String mark) {
		this.mark = mark;
	}
	
}
