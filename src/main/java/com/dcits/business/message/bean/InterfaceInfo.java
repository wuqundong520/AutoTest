package com.dcits.business.message.bean;
// default package

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.json.annotations.JSON;

import com.dcits.annotation.FieldNameMapper;
import com.dcits.business.user.bean.User;
import com.dcits.constant.MessageKeys;


/**
 * 接口自动化
 * 接口信息表
 * 
 * @author xuwangcheng
 * @version 1.0.0.0,2017.2.13
 */

public class InterfaceInfo implements Serializable {


    // Fields    

	private static final long serialVersionUID = 1L;
	
	/**
	 * 接口id
	 */
	private Integer interfaceId;
	
	/**
	 * 创建用户
	 */
	private User user;
	
	/**
	 * 接口名称，必须为英文
	 */
	private String interfaceName;
	
	/**
	 * 接口中文名
	 */
	private String interfaceCnName;
	
	/**
	 * 模拟请求地址
	 */
	private String requestUrlMock;
	
	/**
	 * 真实请求地址
	 */
	private String requestUrlReal;
	
	/**
	 * 接口类型
	 * CX 查询类
	 * SL 受理类
	 */
	private String interfaceType;
	
	/**
	 * 创建时间
	 */
	private Timestamp createTime;
	
	/**
	 * 当前状态
	 * 0 可用
	 * 1 不可用
	 */
	@FieldNameMapper(ifSearch=false)
	private String status;
	
	/**
	 * 最后一次修改用户的realName
	 */
	private String lastModifyUser;
    
	
	/**
	 * 当前接口下的参数
	 */
	private Set<Parameter> parameters = new HashSet<Parameter>();
	
	/**
	 * 当前接口下的报文
	 */
	private Set<Message> messages = new HashSet<Message>();
    // Constructors

	/**
	 * 接口协议类型
	 */
	private String interfaceProtocol;
	
	private String mark;
	
	private String createTimeText;
	
	private String createUserName;
	
	@FieldNameMapper(fieldPath="size(parameters)",ifSearch=false)
	private Integer parametersNum;
	
	@FieldNameMapper(fieldPath="size(messages)",ifSearch=false)
	private Integer messagesNum;
	
	
	/******特殊成员变量，某些情况下使用-excel导入报文信息*********/
	private String requestMsg; //入参报文
	private String createMessage;//是否创建默认报文
	private String createScene;//是否创建默认场景
	private String MessageType;//报文格式类型	
	/**************************/
	
    /** default constructor */
    public InterfaceInfo() {
    }

    public InterfaceInfo(Integer interfaceId) {
    	this.interfaceId = interfaceId;
    }
    
	/** minimal constructor */
    public InterfaceInfo(String interfaceName) {
        this.interfaceName = interfaceName;
    }
    
    /** full constructor */
    public InterfaceInfo(User user, String interfaceName, String interfaceCnName, String requestUrlMock, String requestUrlReal, String interfaceType, Timestamp createTime, String status, String lastModifyUser) {
        this.user = user;
        this.interfaceName = interfaceName;
        this.interfaceCnName = interfaceCnName;
        this.requestUrlMock = requestUrlMock;
        this.requestUrlReal = requestUrlReal;
        this.interfaceType = interfaceType;
        this.createTime = createTime;
        this.status = status;
        this.lastModifyUser = lastModifyUser;
    }

    /**
     * 获取参数的树型json树<br>由于接口的参数库中参数不是按照父子关系存储，则需要根据节点path来梳理父子关系
     * 
     * @return Object[] 0 - 适用于Ztree的简单json数据格式  1 - 出错的信息
     */
    @JSON(serialize=false)
    public Object[] getParameterZtreeMap () {
    	parameters = this.getParameters();
    	if (parameters.size() < 1) {//没有参数
    		return null;
    	}    	
    	Integer rootPid = 0;
    	StringBuilder errorInfo = new StringBuilder();
    	for (Parameter p:parameters) {
    		Integer parentId = getParentId(p.getPath());
    		
    		if (parentId == null) {
    			errorInfo.append("节点参数&nbsp;" + p.getParameterIdentify() + "&nbsp;[" + p.getPath() + "]不存在父节点或者父节点已被删除,请检查该节点的路径是否正确!<br>" );
    		} else if (parentId == 0) {
    			rootPid = p.getParameterId();
    		}
    			   			
    		p.setParentId(parentId);
    	}
    	
    	return new Object[]{parameters, rootPid,errorInfo};
    }
    
    /**
     * 根据自身path获取父节点id
     * @param path
     * @return
     */
    @JSON(serialize=false)
    private Integer getParentId (String path) {
    	if (MessageKeys.MESSAGE_PARAMETER_DEFAULT_ROOT_PATH.equals(path)) {
    		return 0; //根节点
    	}
    	
    	String parentIdentify = path.substring(path.lastIndexOf(".") + 1);
    	String parentPath = path.substring(0, path.lastIndexOf("."));
    	Parameter p = findParam(parentIdentify, parentPath);
    	if (p != null) {
    		return p.getParameterId();
    	}
    	return null; //找不到父节点
    }
    
    private Parameter findParam (String identify, String path) {
    	for (Parameter p:this.parameters) {
    		if (identify.equalsIgnoreCase(p.getParameterIdentify()) && path.equalsIgnoreCase(p.getPath())) {
    			return p;
    		}
    	}
    	
    	return null;
    }
    
    // Property accessors
    
    public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}
    
    public String getCreateUserName() {
		return createUserName;
	}
    
    public void setCreateTimeText(String createTimeText) {
		this.createTimeText = createTimeText;
	}
    
    public String getCreateTimeText() {
		return createTimeText;
	}
    
    public Integer getMessagesNum() {
		return this.messages.size();
	}
    
    public Integer getParametersNum() {
		return this.parameters.size();
	}
    
    public Integer getInterfaceId() {
        return this.interfaceId;
    }
    
    public String getInterfaceProtocol() {
		return interfaceProtocol;
	}

	public void setInterfaceProtocol(String interfaceProtocol) {
		this.interfaceProtocol = interfaceProtocol;
	}

	@JSON(serialize=false)
    public Set<Message> getMessages() {
		return messages;
	}

	public void setMessages(Set<Message> messages) {
		this.messages = messages;
	}

	@JSON(serialize=false)
    public Set<Parameter> getParameters() {
		return parameters;
	}
    
    
	public void setParameters(Set<Parameter> parameters) {
		this.parameters = parameters;
	}

	public void setInterfaceId(Integer interfaceId) {
        this.interfaceId = interfaceId;
    }

    public User getUser() {
        return this.user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }

    public String getInterfaceName() {
        return this.interfaceName;
    }
    
    public void setInterfaceName(String interfaceName) {
        this.interfaceName = interfaceName;
    }

    public String getInterfaceCnName() {
        return this.interfaceCnName;
    }
    
    public void setInterfaceCnName(String interfaceCnName) {
        this.interfaceCnName = interfaceCnName;
    }

    public String getRequestUrlMock() {
        return this.requestUrlMock;
    }
    
    public void setRequestUrlMock(String requestUrlMock) {
        this.requestUrlMock = requestUrlMock;
    }

    public String getRequestUrlReal() {
        return this.requestUrlReal;
    }
    
    public void setRequestUrlReal(String requestUrlReal) {
        this.requestUrlReal = requestUrlReal;
    }

    public String getInterfaceType() {
        return this.interfaceType;
    }
    
    public void setInterfaceType(String interfaceType) {
        this.interfaceType = interfaceType;
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public Timestamp getCreateTime() {
        return this.createTime;
    }
    
    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getLastModifyUser() {
        return this.lastModifyUser;
    }
    
    public void setLastModifyUser(String lastModifyUser) {
        this.lastModifyUser = lastModifyUser;
    }

    @JSON(serialize=false)
	public String getRequestMsg() {
		return requestMsg;
	}

	public void setRequestMsg(String requestMsg) {
		this.requestMsg = requestMsg;
	}
	
	
	@JSON(serialize=false)
	public String getCreateMessage() {
		return createMessage;
	}

	public void setCreateMessage(String createMessage) {
		this.createMessage = createMessage;
	}
	
	@JSON(serialize=false)
	public String getCreateScene() {
		return createScene;
	}

	public void setCreateScene(String createScene) {
		this.createScene = createScene;
	}

	@JSON(serialize=false)
	public String getMessageType() {
		return MessageType;
	}

	public void setMessageType(String messageType) {
		MessageType = messageType;
	}
	
	public void setMark(String mark) {
		this.mark = mark;
	}
	
	public String getMark() {
		if (StringUtils.isBlank(mark)) {
			return "";
		}
		return mark;
	}

	@Override
	public String toString() {
		return "InterfaceInfo [interfaceName=" + interfaceName
				+ ", interfaceCnName=" + interfaceCnName + ", requestUrlMock="
				+ requestUrlMock + ", requestUrlReal=" + requestUrlReal
				+ ", interfaceType=" + interfaceType + ", status=" + status
				+ ", interfaceProtocol=" + interfaceProtocol + ", requestMsg="
				+ requestMsg + ", createMessage=" + createMessage
				+ ", createScene=" + createScene + ", MessageType="
				+ MessageType + "]";
	}
	
	
	
}