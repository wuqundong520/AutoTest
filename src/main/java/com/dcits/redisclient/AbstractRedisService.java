package com.dcits.redisclient;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * 抽象类redis操作，基本操作实现
 * @author xuwangcheng
 * @version 2017.12.8,1.0.0.0
 *
 * @param <K>
 * @param <V>
 */

public class AbstractRedisService<K, V> implements IRedisService<K, V>{

	//@Autowired
	private RedisTemplate<K, V> redisTemplate; 
	
	
	public RedisTemplate<K, V> getRedisTemplate() {
		return redisTemplate;
	}
	
	public void setRedisTemplate(RedisTemplate<K, V> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}
	
	@Override
	public void set(final K key,final V value,final long expiredTime) {
		// TODO Auto-generated method stub
		BoundValueOperations<K, V> valueOper = redisTemplate.boundValueOps(key);  
        if (expiredTime <= 0) {  
            valueOper.set(value);  
        } else {  
            valueOper.set(value, expiredTime, TimeUnit.MILLISECONDS);  
        }  
	}

	@Override
	public V get(final K key) {
		// TODO Auto-generated method stub
		BoundValueOperations<K, V> valueOper = redisTemplate.boundValueOps(key);  
        return valueOper.get(); 
	}

	@Override
	public Object getHash(final K key,final String name) {
		// TODO Auto-generated method stub
		Object res = redisTemplate.boundHashOps(key).get(name);
        return res;
	}

	@Override
	public void del(final K key) {
		// TODO Auto-generated method stub
		 if (redisTemplate.hasKey(key)) {  
             redisTemplate.delete(key);  
         } 
	}

}
