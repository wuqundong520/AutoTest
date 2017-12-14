package com.dcits.business.base.dao.impl;

import java.lang.reflect.ParameterizedType;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.dcits.business.base.bean.PageModel;
import com.dcits.business.base.dao.BaseDao;

/**
 * 通用DAO接口的实现类
 * 
 * @author xuwangcheng
 * @version 1.0.0.0,2017.2.13
 * @param <T>
 */
@SuppressWarnings("unchecked")
public class BaseDaoImpl<T> implements BaseDao<T> {
	
	private static final Logger LOGGER = Logger.getLogger(BaseDaoImpl.class);
	
	/**
	 * Hibernate sessionFactory
	 */
	@Autowired
	private SessionFactory sessionFactory;
	
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	public Session getSession() {
		return this.sessionFactory.getCurrentSession();
	}
	
	private Class<T> clazz;
	
	/**
	 * 通过反射获取传入的类
	 */
	@SuppressWarnings("rawtypes")
	public BaseDaoImpl() {		
		ParameterizedType type=(ParameterizedType)this.getClass().getGenericSuperclass();
		this.clazz = (Class)type.getActualTypeArguments()[0];	
	}
	
	public Integer save(T entity) {
		// TODO Auto-generated method stub
		Integer id = (Integer) getSession().save(entity);
		return id;
	}

	public void delete(int id) {
		// TODO Auto-generated method stub
		getSession().delete(get(id));
	}

	public void edit(T entity) {
		// TODO Auto-generated method stub
		getSession().merge(entity);
	}

	
	public T get(Integer id) {
		// TODO Auto-generated method stub
		
		return (T)getSession().get(clazz, id);
	}

	public T load(Integer id) {
		// TODO Auto-generated method stub
		return (T)getSession().load(clazz, id);
	}

	public List<T> findAll(String ...filterCondition) {
		// TODO Auto-generated method stub
		String hsql = "select t from " + clazz.getSimpleName() + " t";
		
		if (filterCondition != null && filterCondition.length > 0) {
			hsql += " where ";
			int i = 1;
			for (String s : filterCondition) {
				hsql += s;
				i++;
				if (i <= filterCondition.length) {
					hsql += " and ";
				}
			}
		}
		
		return getSession().createQuery(hsql).setCacheable(true).list();
	}

	public int totalCount(String ...filterCondition) {
		// TODO Auto-generated method stub
		int count = 0;
		String hql = "select count(t) from " + clazz.getSimpleName() + " t";
		
		if (filterCondition != null && filterCondition.length > 0) {
			hql += " where ";
			int i = 1;
			for (String s : filterCondition) {
				hql += s;
				i++;
				if (i <= filterCondition.length) {
					hql += " and ";
				}
			}
		}
		
		Long temp = (Long)getSession().createQuery(hql).uniqueResult();
		if (temp != null) {
			count = temp.intValue();
		}
		return count;
	}

	public PageModel<T> findByPager(int dataNo, int pageSize, String orderDataName, String orderType, String searchValue, List<String> dataParams, String ...filterCondition) {
		// TODO Auto-generated method stub
		PageModel<T> pm = new PageModel<T>(orderDataName, orderType, searchValue, dataParams, dataNo, pageSize);
		
		String hql = "from " + clazz.getSimpleName() + " o";
		
		if (searchValue != "" || filterCondition != null && filterCondition.length > 0) {
			hql += " where ";
		}
		
		//增加搜索条件
		if (searchValue != "") {			
			int i = 1;
			for (String s : dataParams) {
				i++;
				if (s.isEmpty()) {
					continue;
				}
				hql += s + " like '%" + searchValue + "%'";				
				if (i <= dataParams.size()) {
					hql += " or ";
				}
			}
			
		}
		//增加自定义的条件
		if (filterCondition != null && filterCondition.length > 0) {
			if (searchValue != "") {
				hql += " and ";
			}
			
			
			int i = 1;
			for (String s : filterCondition) {
				hql += s;
				i++;
				if (i <= filterCondition.length) {
					hql += " and ";
				}
			}
		}
		
		
		
		//增加排序
		if (!orderDataName.isEmpty()) {
			hql += " order by " + orderDataName + " " + orderType;
		}
		
		LOGGER.info("The query HQL String: \n" + hql);
	
		pm.setDatas(getSession().createQuery(hql)
				.setFirstResult(dataNo)
				.setMaxResults(pageSize)
				.setCacheable(true).list());
		pm.setRecordCount(totalCount(filterCondition));
		return pm;
	}

	public void update(String sql) {
		// TODO Auto-generated method stub
		getSession().createQuery(sql).executeUpdate();
	}

	public T findUnique(String sql) {
		// TODO Auto-generated method stub	
		return (T)getSession().createQuery(sql).uniqueResult();
	}

	@Override
	public int countByTime(Date ...time) {
		// TODO Auto-generated method stub
		int count = 0;
		String hql = "select count(t) from " + clazz.getSimpleName() + " t where t.createTime>:endTime1";			
		if (time.length > 1) {
			hql += " and t.createTime<:endTime2";
		}
		Query query = getSession().createQuery(hql).setTimestamp("endTime1", time[0]);
		if (time.length > 1) {
			query.setTimestamp("endTime2", time[1]);
		}
		Long temp = (Long)query.uniqueResult();
		if (temp != null) {
			count = temp.intValue();
		}
		return count;
	}
}
