package com.dcits.business.user.dao;

import java.util.List;

import com.dcits.business.base.dao.BaseDao;
import com.dcits.business.user.bean.OperationInterface;

/**
 * 操作接口DAO接口
 * @author xuwangcheng
 * @version 1.0.0.0,2017.2.14
 */

public interface OperationInterfaceDao extends BaseDao<OperationInterface>{

	/**
	 * 获取指定role拥有的操作接口
	 * @param roleId
	 * @return
	 */
	List<OperationInterface> listByRoleId(Integer roleId);
}
