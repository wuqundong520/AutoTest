package com.dcits.coretest.message;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;

import com.dcits.business.message.bean.ComplexSetScene;


/**
 * 仅测试用<br>
 * 包含组合场景信息和测试场景列表
 * @author xuwangcheng
 * @version 2017.11.25,1.0.0.0
 *
 */
public class TestComplexScene  {
	
	private ComplexSetScene complexSetScene;
	
	private List<Object[]> testObjects = new ArrayList<>();
	
	private Map<String, Map<String, String>> useVariables;
	
	private Map<String, Map<String, String>> saveVariables;
	
	private ObjectMapper mapper = new ObjectMapper();

	public TestComplexScene(ComplexSetScene complexSetScene,
			List<Object[]> testObjects) {
		super();
		this.complexSetScene = complexSetScene;
		this.testObjects = testObjects;
	}

	public TestComplexScene() {
		super();
		// TODO Auto-generated constructor stub
	}

	public void setUseVariables(Map<String, Map<String, String>> useVariables) {
		this.useVariables = useVariables;
	}
	
	public Map<String, Map<String, String>> getUseVariables() {
		return useVariables;
	}
	
	public void setSaveVariables(Map<String, Map<String, String>> saveVariables) {
		this.saveVariables = saveVariables;
	}
	
	public Map<String, Map<String, String>> getSaveVariables() {
		return saveVariables;
	}
	
	public ComplexSetScene getComplexSetScene() {
		return complexSetScene;
	}

	@SuppressWarnings("unchecked")
	public void setComplexSetScene(ComplexSetScene complexSetScene) {
		this.complexSetScene = complexSetScene;
		try {
			this.useVariables = mapper.readValue(complexSetScene.getUseVariables(), Map.class);
			this.saveVariables = mapper.readValue(complexSetScene.getSaveVariables(), Map.class);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	}

	public List<Object[]> getTestObjects() {
		return testObjects;
	}

	public void setTestObjects(List<Object[]> testObjects) {
		this.testObjects = testObjects;
	}

}
