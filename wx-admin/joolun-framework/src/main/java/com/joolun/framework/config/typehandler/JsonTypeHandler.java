package com.joolun.framework.config.typehandler;

import cn.hutool.json.JSONObject;
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
 *  存储到数据库, 将JSON对象转换成字符串;
 *  从数据库获取数据, 将字符串转为JSON对象.
 */
@MappedTypes({JSONObject.class})
@MappedJdbcTypes({JdbcType.VARCHAR})
public class JsonTypeHandler extends BaseTypeHandler<JSONObject> {

	@Override
	public void setNonNullParameter(PreparedStatement ps, int i, JSONObject parameter,
									JdbcType jdbcType) throws SQLException {

		ps.setString(i, JSONUtil.toJsonStr(parameter));
	}

	@Override
	public JSONObject getNullableResult(ResultSet rs, String columnName)
			throws SQLException {

		return JSONUtil.parseObj(rs.getString(columnName)).toBean(JSONObject.class);
	}

	@Override
	public JSONObject getNullableResult(ResultSet rs, int columnIndex) throws SQLException {

		return JSONUtil.parseObj(rs.getString(columnIndex)).toBean(JSONObject.class);
	}

	@Override
	public JSONObject getNullableResult(CallableStatement cs, int columnIndex)
			throws SQLException {

		return JSONUtil.parseObj(cs.getString(columnIndex)).toBean(JSONObject.class);
	}

}
