package com.dcits.redisclient;

/**
 * redis基本操作接口
 * @author xuwangcheng
 * @version 20171208,1.0.0.0
 *
 * @param <K>
 * @param <V>
 */
public interface IRedisService<K, V> {
	void set(K key, V value, long expiredTime);
	V get(K key);
	Object getHash(K key, String name);
	void del(K key);
}
