package com.joolun.framework.config.typehandler;

import cn.hutool.json.JSONUtil;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *  存储到数据库, 将LONG数组转换成字符串;
 *  从数据库获取数据, 将字符串转为LONG数组.
 */
@MappedTypes({Long[].class})
@MappedJdbcTypes({JdbcType.VARCHAR})
public class ArrayLongTypeHandler extends BaseTypeHandler<Long[]> {

	private static Long[] l = new Long[]{};

	@Override
	public void setNonNullParameter(PreparedStatement ps, int i,
									Long[] parameter, JdbcType jdbcType) throws SQLException {
		ps.setString(i, JSONUtil.toJsonStr(parameter));
	}

	@Override
	public Long[] getNullableResult(ResultSet rs, String columnName)
			throws SQLException {
		return JSONUtil.parseArray(rs.getString(columnName)).toArray(l);
	}

	@Override
	public Long[] getNullableResult(ResultSet rs, int columnIndex)
			throws SQLException {
		return JSONUtil.parseArray(rs.getString(columnIndex)).toArray(l);
	}

	@Override
	public Long[] getNullableResult(CallableStatement cs, int columnIndex)
			throws SQLException {
		return JSONUtil.parseArray(cs.getString(columnIndex)).toArray(l);
	}

}
