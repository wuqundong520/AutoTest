package com.dcits.business.message.dao.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.dcits.business.base.bean.PageModel;
import com.dcits.business.base.dao.impl.BaseDaoImpl;
import com.dcits.business.message.bean.InterfaceInfo;
import com.dcits.business.message.bean.Message;
import com.dcits.business.message.bean.MessageScene;
import com.dcits.business.message.dao.MessageSceneDao;

/**
 * 报文场景dao实现
 * @author xuwangcheng
 * @version 1.0.0,2017.3.6
 *
 */

@Repository("messageSceneDao")
public class MessageSceneDaoImpl extends BaseDaoImpl<MessageScene> implements MessageSceneDao {

	private static final Logger LOGGER = Logger.getLogger(MessageSceneDaoImpl.class);
	@Override
	public void updateValidateFlag(Integer messageSceneId, String validateRuleFlag) {
		// TODO Auto-generated method stub
		String hql = "update MessageScene m set m.validateRuleFlag=:validateRuleFlag where m.messageSceneId=:messageSceneId";
		getSession().createQuery(hql)
			.setString("validateRuleFlag", validateRuleFlag)
			.setInteger("messageSceneId", messageSceneId)
			.executeUpdate();		
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MessageScene> findAll() {
		// TODO Auto-generated method stub		
		String hql = "From MessageScene m where m.message is not null and m.message.status='0' and m.message.interfaceInfo.status='0'";
		return getSession().createQuery(hql).setCacheable(true).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MessageScene> getBySetId(Integer setId) {
		// TODO Auto-generated method stub
		String hql = "select m from MessageScene m join m.testSets s where s.setId=:setId and m.message.status='0' and m.message.interfaceInfo.status='0'";		
		return getSession().createQuery(hql).setInteger("setId", setId).setCacheable(true).list();
	}

	@Override
	public InterfaceInfo getInterfaceOfScene(Integer messageSceneId) {
		// TODO Auto-generated method stub
		String hql = "select m.message.interfaceInfo from MessageScene m where m.messageSceneId=:messageSceneId";		
		return (InterfaceInfo) getSession().createQuery(hql).setInteger("messageSceneId", messageSceneId).uniqueResult();
	}

	@Override
	public Message getMessageOfScene(Integer messageSceneId) {
		// TODO Auto-generated method stub
		String hql = "select m.message from MessageScene m where m.messageSceneId=:messageSceneId";
		return (Message) getSession().createQuery(hql).setInteger("messageSceneId", messageSceneId).uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public PageModel<MessageScene> findSetScenesByPager(int dataNo, int pageSize, String orderDataName, String orderType
			, String searchValue, List<String> dataParams,  Integer setId, String mode) {
		// TODO Auto-generated method stub
		PageModel<MessageScene> pm = new PageModel<MessageScene>(orderDataName, orderType, searchValue, dataParams, dataNo, pageSize);
		
		String hql = "select m from MessageScene m inner join m.testSets t  where ";
		
		if ("1".equals(mode)) {
			hql += "t.setId!=:setId and m in elements(t.ms)";
		} else {
			hql += "t.setId=:setId";
		}
		
		//增加搜索条件
		if (searchValue != "") {	
			hql += " and ";
			int i = 1;
			for (String s : dataParams) {
				i++;
				if (s.isEmpty()) {
					continue;
				}
				 
				if (!s.startsWith("size")) {
					hql += "m.";
				} else {
					s = s.replace("(", "(m.");
				}
				hql += s + " like '%" + searchValue + "%'";	
				if (i <= dataParams.size()) {
					hql += " or ";
				}
			}
			
		}
		
		//增加排序
		if (!orderDataName.isEmpty()) {
			hql += " order by m." + orderDataName + " " + orderType;
		}
		
		LOGGER.info("The query HQL String: \n" + hql);
		pm.setDatas(getSession().createQuery(hql).setInteger("setId",setId)
				.setFirstResult(dataNo)
				.setMaxResults(pageSize)
				.setCacheable(true).list());
		return pm;
	}

}
